'use strict'

/**
* @description Index file for userMgr App 
* @author LocUsNine - Vikas Gawade
* @date 18/01/2020
*/

// Built-in Modules
const http = require('http')

// NPM Modules
const express = require('express')
const cors = require('cors')

// Internal Modules
const routes = require('./middleware/routes')

const env = process.env.NODE_ENV || 'default'
const { httpPort } = require('./config')[env]

// Express Init
const app = express()
app.set('env', 'production') // Set env to production to avoid showing trace errors
app.use(cors())

// Endpoint Handler 
routes.handler(app)

// WebServer HTTP
http.createServer(app).listen(httpPort, () => {
    console.log(`userMgr started at ${new Date().toLocaleString()}`)
    console.log(`HTTPS is OFF. PID: ${process.pid}. Port: ${httpPort}`)
})


