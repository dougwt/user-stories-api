import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './router'
import Response from './response'
import { NODE_ENV, MONGODB_CONNECTION } from './config'

const app = express();

// DB setup
mongoose.Promise = global.Promise;          // Use ES6 Promise
if (NODE_ENV !== 'test') {
  console.log(`Connecting to mongodb://${MONGODB_CONNECTION}`)
  mongoose.connect(`mongodb://${MONGODB_CONNECTION}`);
};

// App setup
if (NODE_ENV !== 'test') {
  app.use(morgan('combined'))               // Log incoming http requests
}
app.use(helmet())                           // Secure w/ various HTTP headers
app.use(cors())                             // Enable CORS for all routes
app.use(bodyParser.json({ type: '*/*' }));  // Parse all http requests as json
app.use('/', router);                       // Load API router

// Handle express errors
app.get('*', (req, res, next) => {
  // This catch-all route is used to assign 404 error statuses
  // to any unmatched requests and raise an error to be caught below.
  var err = new Error();
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  if (res.headersSent) {
    console.log(err)
    return next(err);
  }
  // TODO: Generate standard responses from here using err.status?
  if(err.status === 404) {
    res.status(404).send(Response.error('The requested resource does not exist.'));
    next()
  }
  else {
    res.status(500).send(Response.error(err.message));
  }

});

module.exports = app;
