// Native modules imports
import express from 'express';
import favicon from 'express-favicon';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fs from 'fs';


// Personal modules imports
import { Logger, logMoment } from './logger/logger.js';
// import * as CONST from './Helpers/CONSTANTS.js';

// dotenv config to get access to all environment variables
dotenv.config();

// Adding the routes
import postRoutes from './routes/post.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import { checkSigninToken } from './controllers/auth.js';

// Constants definition
const app = express();
const PORT = process.env.PORT || 9092;

// Middlewares definition
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(checkSigninToken);
app.use('/tds', authRoutes);
app.use('/tds', postRoutes);
app.use('/tds', userRoutes);
app.use(favicon('public/images/favicon.png'));

// Connection to MongoDB Atlas database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    Logger.info(
      `${logMoment.dateAndTime}: connected to database '${mongoose.connection.db.databaseName}'.`
    );
  });
mongoose.connection.on('error', (err) => {
  Logger.error(`db connection error: ${err.message}`);
});

// apiDocs
app.get('/api', (req, res) => {
  fs.readFile('./docs/api-docs.json', (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    const docs = JSON.parse(data);
    return res.json(docs);
  })
})

const server = app.listen(PORT, () => {
  Logger.info(`${logMoment.dateAndTime}: app listening on port ${PORT}.`);
});

// Commented that out until I figure out what's wrong with the password thing.
// Handling different types of errors and logging to log files
const errorTypes = ['unhandledRejection', 'uncaughtException'];
errorTypes.map((type) => {
  process.on(type, async () => {
    try {
      Logger.error(`${logMoment.dateAndTime}: Error of type process.on ${type} occurred.`);
      process.exit(0);
    } catch (_) {
      Logger.error(`${logMoment.dateAndTime}: Encountered an error of type ${_.message}.`);
      process.exit(1);
    }
  });
});

// **************** Simple live chat ****************

// Native modules import
import WebSocket from 'ws';

// Constants definition
const wsServer = new WebSocket.Server({noServer: true, clientTracking: true});

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request,socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

wsServer.on('connection', (socket) => {
  socket.on('message', (message) => {
    wsServer.clients.forEach((client) => {
      if (socket !== client && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});