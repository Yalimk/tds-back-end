// Native modules import
import nodeMailer from 'nodemailer';

// Personal modules import
import { Logger, logMoment } from '../logger/logger.js';

export const sendEmail = async (emailData) => {
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.GOOGLE_ACCOUNT,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });
  try {
    const info = await transporter.sendMail(emailData);
    Logger.info(
      `${logMoment.dateAndTime}: [front-end/src/helpers/HELPERS.js => sendEmail] : info.response: ${info.response}`
    );
  } catch (err) {
    Logger.error(
      `${logMoment.dateAndTime}: [front-end/src/helpers/HELPERS.js => sendEmail] : error: ${err}`
    );
  }
};
