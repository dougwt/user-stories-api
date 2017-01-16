import express from 'express'
// import http from 'http'
import bodyParser from 'body-parser'
// import morgan from 'morgan'
import mongoose from 'mongoose'
import routes from './routes'
import Response from './response'

const app = express();

// DB setup
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/user_stories');
};

// App setup
// app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }));
app.use('/', routes);

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
  if(err.status === 404) {
    res.status(404).send(Response.error('The requested resource does not exist.'));
    next()
  }
  res.status(500).send(Response.error(err.message));
});

// module.exports = http.createServer(app)
module.exports = app;
