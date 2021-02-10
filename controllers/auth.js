// Native modules import
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import dotenv from 'dotenv';
import _ from 'lodash';

// Models import
import User from '../models/user.js';

// Personal modules import
import { Logger, logMoment } from '../logger/logger.js';
import { sendEmail } from '../helpers/HELPERS.js';

// dotenv config
dotenv.config();

// Controller enabling signup functionality
export const signup = async (req, res) => {
  const userExists = await User.findOne({
    $or: [{ email: req.body.email }, { pseudo: req.body.pseudo }],
  });
  if (userExists) {
    return res.status(403).json({
      error: `Tu es amnésique ou tu essaies de voler l'identité de quelqu'un, moussaillon ? Cet e-mail ou/et ce pseudo est/sont déjà pris ! (erreur 403)`,
    });
  } else {
    const user = new User(req.body);
    await user.save();
    // Logger.info(
    //   `L'utilisateur ${user.pseudo}, e-mail ${user.email}, id ${user._id} a été créé en base de données avec succès.`
    // );
    return res.json({
      message:
        'Tes papiers sont en règles, moussaillon. Tu peux entrer dans la taverne, maintenant...',
    });
  }
};

// Function enabling signin functionality
export const signin = (req, res) => {
  const { email, password } = req.body;
  if ('' !== email && '' !== password) {
    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          error: `Aucun pirate ne correspond à ces informations. Vérifie-les ou crée un compte, sacrebleu ! (erreur 401)`,
        });
      }
      if (!user.authenticateUser(password)) {
        return res.status(401).json({
          error: `Adresse de courrier et mot de passe ne correspondent pas, marin d'eau douce ! (erreur 401)`,
        });
      }
      const token = jwt.sign({ _id: user._id, right: user.right }, process.env.JWT_SECRET);
      res.cookie('t', token, {
        expire: new Date() + 3600000,
      });
      const { _id, pseudo, email, right } = user;
      // Logger.info(
      //   `${logMoment.dateAndTime}: L'utilisateur ${pseudo}, e-mail ${email}, id ${_id} vient de se connecter à la Taverne des Soiffards.`
      // );
      return res.json({
        token,
        user: { _id, email, pseudo, right }, // I used to send the whole user but changed for safety reasons.
        // user,
      });
    });
  }
};

// Function enabling signout functionality
export const signout = (req, res) => {
  res.clearCookie('t');
  return res.json({
    message: `Tu viens de quitter la taverne, moussaillon. A bientôt !`,
  });
};

// Function checking whether user is signed in
export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
});

// Function to check if user has a token (after signing in)
export const checkSigninToken = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: `Vous devez passer le garde de la taverne pour avoir accès à ce contenu, marin d'eau douce ! (erreur 401)`,
    });
  }
  next();
};

// Function allowing password reset email send functionality
export const forgotPassword = (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: `req.body is missing from the request.`,
    });
  }
  if (!req.body.email) {
    return res.status(400).json({
      message: `Où veux-tu qu'on t'envoie l'e-mail de réinitialisation si tu ne nous en donnes pas, moussaillon ?!`,
    });
  }
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: `Aucun pirate n'est lié à cet e-mail, marin d'eau douce !`,
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        iss: process.env.APP_NAME,
      },
      process.env.JWT_SECRET
    );
    // Logger.silly(`token (should be same as resetPasswordLink) inside forgot password: ${token}`)
    const emailData = {
      from: 'alexandremasson33@gmail.com',
      to: email,
      subject: 'Réinitialisation du mot de passe',
      text: `Clique ICI pour réinitialiser ton mot de passe, puisque tu n'as pas de tête : 
      ${process.env.CLIENT_URI}/reset-password/${token}`,
      html: `<h2>Clique <a href="${process.env.CLIENT_URI}/reset-password/${token}">ICI</a> pour réinitialiser ton mot de passe, puisque tu n'as pas de tête...</h2>`,
    }

    return user.updateOne({resetPasswordLink: token}, (err, success) => {
      if (err) {
        return res.status(400).json({
          message: err
        })
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Un e-mail t'a été envoyé à l'adresse : ${email}, moussaillon. Suis les instructions pour réinitialiser ton mot de passe.`
        })
      }
    })
  });
};

// Function allowing the user to reset their password
export const resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword} = req.body;
  Logger.silly(`${logMoment.dateAndTime}: [back-end/src/controllers/auth.js => resetPassword:150] : req.files: ${JSON.stringify(req.files)}.`)
  Logger.silly(`${logMoment.dateAndTime}: [back-end/src/controllers/auth.js => resetPassword:151] : req.body: ${JSON.stringify(req.body)}.`)
  Logger.silly(`${logMoment.dateAndTime}: [back-end/src/controllers/auth.js => resetPassword:152] : newPassword: ${newPassword}.`)
  Logger.silly(`${logMoment.dateAndTime}: [back-end/src/controllers/auth.js => resetPassword:153] : resetPasswordLink: ${resetPasswordLink}.`)
  User.findOne({resetPasswordLink}, (err, user) => {
    if (err || !user) {
      Logger.debug(` [auth resetPassword (back-end)] : inside if (err || !user)`)
      return res.status(401).json({
        error: `The token for password reset is invalid.`
      })
    }
    const fieldsToUpdate = {
      password: newPassword, // tried changing to newPassword to match the newly created virtual field newPassword 04/02 17h32
      resetPasswordLink: ''
    }
    user = _.assignIn(user, fieldsToUpdate);
    Logger.silly(`${logMoment.dateAndTime}: [back-end/src/controllers/auth.js => resetPassword:166] : fieldsToUpdate: ${JSON.stringify(fieldsToUpdate)}.`)
    user.updated = Date.now();
    user.save((err, savedUser) => {
      Logger.silly(`${logMoment.dateAndTime}: [back-end/src/controllers/auth.js => resetPassword:169] : at the start of user.save callback.`)
      if (err) {
        Logger.error(`${logMoment.dateAndTime}: [back-end/src/controllers/auth.js => resetPassword:171] : inside user.save callback's if(err).`)
        return res.status(400).json({
          error: err
        })
      }
      Logger.silly(`${logMoment.dateAndTime}: [back-end/src/controllers/auth.js => resetPassword:169] : right before sending response at the end of user.save callback.`)
      res.json({
        message: `Ton mot de passe a bien été mis à jour, matelot ! Tu peux à présent te connecter à la Taverne !`
      });
    });
  });
};
