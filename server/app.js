import express from 'express'
// import http from 'http'
import bodyParser from 'body-parser'
// import morgan from 'morgan'
import mongoose from 'mongoose'
import routes from './routes/routes'

export const app = express();
export const server = http.createServer(app);

// DB setup
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/muber');
}

// App setup
// app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }))
// app.use('/', routes);
routes(app);

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
})

// export const server = http.createServer(app)
