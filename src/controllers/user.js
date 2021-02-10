// Native modules import
import _ from 'lodash';
import formidable from 'formidable';
import fs from 'fs';

// Models import
import User from '../models/user.js';

// Personal modules import
import { Logger, logMoment } from '../logger/logger.js';

export const userById = (req, res, next, userId) => {
  User.findById(userId)
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: `Ce pirate n'existe pas ou une erreur s'est produite.`
        })
      }
      req.profile = user;
      next();
    });
};

export const hasAuthorization = (req, res, next) => {
  const sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
  const adminUser = req.profile && req.auth && req.auth.right === process.env.ADMIN_TITLE;
  const authorized = sameUser || adminUser;

  Logger.debug(`${logMoment.dateAndTime}: 
  [back-end/src/controllers/user.js => hasAuthorization:31] :  
  req.user: ${req.profile}
  req.auth: ${JSON.stringify(req.auth)}
  sameUser: ${sameUser}
  adminUser: ${adminUser}
  adminTitle: ${process.env.ADMIN_TITLE}
  `);

  if (!authorized) {
    return res.status(403).json({
      error: `Tu n'as pas la permission de faire ça, moussaillon, où est-ce que tu te crois ?! Chez mémé ?!`
    });
  }
  Logger.info(`${logMoment.dateAndTime}: [back-end/src/controllers/user.js => hasAuthorization:44] : authorized to proceed`);
  next();
};

export const getUsers = async (req, res) => {
  const currentPage = req.query.page || 1;
  const perPage = Number(process.env.PER_PAGE) || 3;
  let totalUsers;

  const posts = await User.find()
    .countDocuments()
    .then(count => {
      totalUsers = count;
      return User.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .sort({ created: -1 })
        .select('_id pseudo email about role hobbies photo right'); // added right 03/02 13h42
    })
    .then(users => {
      return res.json(users);
    })
    .catch(err => console.log(err));
};

export const getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

export const updateUser = (req, res, next) => {
  Logger.debug(`[back-end/src/controllers/users.js => updateUser] : function fired.`)
  let form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: `Photo was not uploaded because of error : ${err}`
      })
    }
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    user.save((err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      return res.json(user);
    })
  })
};

export const userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set('Content-Type', req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

export const deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) {
      // Logger.error(`${logMoment.dateAndTime} : La méthode deleteUser a rencontré une erreur : ${err}.`);
      return res.status(400).json({
        error: err
      });
    }
    // Logger.info(`${logMoment.dateAndTime} : L'utilisateur ${deletedUser.pseudo}, e-mail ${deletedUser.email}, id ${deletedUser._id} a été supprimé avec succès.`);
    return res.json({
      message: `Le pirate ${deletedUser.pseudo} dont l'adresse de courrier est ${deletedUser.email} a été annihilé. Bon vent !`
    });
  })
}