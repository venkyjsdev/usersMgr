'use strict'

/**
* @description MongoDB interface
* @author LocUsNine - Vikas Gawade
* @date 17/01/2020
*/

// NPM Modules
const mongo = require('mongodb')
const ObjectId = mongo.ObjectID


// Options for mongoDB
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }

// config
const env = process.env.NODE_ENV || 'default'
let { ip, port, database } = require('../../config')[env].data

let db

let connect = () => {
    return new Promise((resolve, reject) => {
        if (db) resolve()
        else {
            const url = `mongodb://${ip}:${port}`
            mongo.connect(url, mongoOptions, (err, client) => {
                if (err) reject(err)
                else {
                    db = client.db(database)
                    resolve()
                }
                db.on('close', () => reconnect())
            })
        }
    })
}

let reconnect = () => {
    let url = `mongodb://${ip}:${port}`
    mongo.connect(url, mongoOptions, (err, client) => {
        if (err) console.log(err)
        else db = client.db(database)
        db.on('close', () => reconnect())
    })
}

/**
 * @description gets single document from a collection provided the ID is known
 * @param {string} collection collection name
 * @param {string} id 
 * @return {Promise} document found
 */
let findDoc = (collection, id) => {
    return new Promise((resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            connect()
                .then(() => db.collection(lower).findOne({ _id: ObjectId(id) }))
                .then(result => resolve(result))
                .catch(err => reject(err))
        }
        catch (e) { reject(e) }
    })
}

/**
 * @description gets documents from a collection applying filters
 * @param {string} collection collection name
 * @param {object} filters object with fields and values
 * @return {Promise} array of documents found
 */
let getDocs = (collection) => {
    return new Promise((resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            connect()
                .then(() => db.collection(lower).find({}).toArray())
                .then(result => resolve(result))
                .catch(err => reject(err))
        }
        catch (e) { reject(e) }
    })
}

/**
 * @description inserts one or more documents into a collection
 * @param {string} collection collection name
 * @param {array} data array of objects to insert
 * @return {Promise} result
 */
let insertDoc = (collection, data) => {
    return new Promise((resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            connect()
                .then(() => db.collection(lower).insertMany(data))
                .then(result => resolve(result))
                .catch(err => reject(err))
        }
        catch (e) { reject(e) }
    })
}

/**
 * @description updates one document in a collection
 * @param {string} collection collection name
 * @param {string} id  
 * @param {object} data object to update
 * @return {Promise} result
 */
let updateDoc = (collection, id, data) => {
    return new Promise((resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            connect()
                .then(() => db.collection(lower).updateOne({ _id: ObjectId(id) }, { $set: data }))
                .then(result => resolve(result))
                .catch(err => reject(err))
        }
        catch (e) { reject(e) }
    })
}

/**
 * @description deletes document from a collection provided the ID is known
 * @param {string} collection collection name
 * @param {string} id  
 * @return {Promise} result
 */
let deleteDoc = (collection, id) => {
    return new Promise((resolve, reject) => {
        try {
            let lower = collection.toLowerCase()
            connect()
                .then(() => db.collection(lower).deleteOne({ _id: ObjectId(id) }))
                .then(result => resolve(result))
                .catch(err => reject(err))
        }
        catch (e) { reject(e) }
    })
}

module.exports.find = findDoc
module.exports.get = getDocs
module.exports.insert = insertDoc
module.exports.update = updateDoc
module.exports.delete = deleteDoc
