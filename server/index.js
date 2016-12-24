import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import morgan from 'morgan'

let app = express()

// App setup
app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }))

// Server setup
export const port = process.env.API_PORT || 3090
export const server = http.createServer(app)
server.listen(port)
console.log('Server listening on:', port)
