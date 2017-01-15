import express from 'express'
// import http from 'http'
import bodyParser from 'body-parser'
// import morgan from 'morgan'
import mongoose from 'mongoose'
import routes from './routes'

const app = express();

// DB setup
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/user_stories');
}

// App setup
// app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }));
app.use('/', routes);

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
})

// module.exports = http.createServer(app)
module.exports = app;
