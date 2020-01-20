'use strict'

/**
* @description Routes handler. This file handles all http requests.
* @author LocUsNine - Vikas Gawade
* @date 17/01/2020
*/

// NPM modules
const bodyParser = require('body-parser') // Json parse for express

// Custom Modules
const { db } = require('../services')

/** 
* Function than handles all request routes
* @param app {}, a representation of an express app needed to handle routes
*/
let handler = app => {
    // Set Body-Parser for APP
    let jsonParser = bodyParser.json()
    // Access Control
    app.all('*', (req, res, next) => {
        console.log('hit ' + req.originalUrl)
        //Access control, if required
        next()
    })

    app.post('/:collection', jsonParser, (req, res) => {
        db.insert(req, res)
    })
    app.get('/:collection/:id', (req, res, next) => {
        db.readById(req, res)
    })
    app.get('/:collection', (req, res) => {
        db.readAll(req, res)
    })
    app.put('/:collection/:id', jsonParser, (req, res) => {
        db.update(req, res)
    })
    app.delete('/:collection/:id', (req, res) => {
        db.deleteById(req, res)
    })
   
    app.all('*', (req, res) => {
        res.status(404).json('Not found')
    })
}
exports.handler = handler