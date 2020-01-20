'use strict'

/**
* @description db service for handling crud operations.
* @author LocUsNine - Vikas Gawade
* @date 18/01/2020
*/

const { db, model } = require('../middleware/controllers')
let template = require('../middleware/models').user

let manageError = (res, error) => {
        console.log(error)
        res.status(400).json({ error })
}

/**
 *
 * @description Function that insert(s) doc(s) into mongoDB
 * @param {object} req 
 * @param {object} res
 */
let insert = (req, res) => {
        let { collection } = req.params
        let data
        if (typeof req.body.data === 'object') data = Array.isArray(req.body.data) ? req.body.data : [req.body.data]
        let strict
        Object.keys(req.query).forEach(key => {
                if (key.toLowerCase() === 'strict') strict = req.query[key].toLowerCase() === "true"
        })
        let validTemplate = template && template.name && template.required && template.model && template.enforceType
        if (data && Array.isArray(data) && data.length && validTemplate) {
                if (collection.toLowerCase() === template.name.toLowerCase()) {
                        let invalid
                        model.validate(data, template).
                                then(result => {
                                        if (strict && result.invalid.length) manageError(res, { message: 'strict mode', result })
                                        else {
                                                if (result.valid.length) return db.insert(collection, result.valid)
                                                else manageError(res, { message: 'no valid data', result })
                                                if (result.invalid.length) invalid = result.invalid
                                        }
                                })
                                .then(response => {
                                        if (response) res.json({ collection, msg: 'User was created successfully.', response, invalid })
                                })
                                .catch(error => manageError(res, error))
                }
                else manageError(res, 'Collection doesn\'t match model')
        }
        else manageError(res, 'invalid data or template')
}

/**
 * @description Function that reads a single doc from mongoDB
 * @param {object} req 
 * @param {object} res
 */
let readById = (req, res) => {
        let { collection, id } = req.params
        if (collection) {
                if (id) {
                        db.find(collection, id)
                                .then(data => res.json({ msg: 'Request Result.', data }))
                                .catch(error => manageError(res, error))

                }
                else manageError(res, { message: 'id is required' })
        }
        else manageError(res, { message: 'collection is required' })
}

/**
 *
 * @description Function that reads doc(s) from mongoDB
 * @param {object} req
 * @param {object} res
 */
let readAll = (req, res) => {
        let { collection } = req.params
        if (collection) {
                db.get(collection)
                        .then(result => res.json({ collection, data: result.length ? result : 'No users found' }))
                        .catch(error => manageError(res, error))

        }
        else manageError(res, { message: 'collection parameter is required' })
}

/**
 *
 * @description Function that updates a doc in mongoDB
 * @param {object} req 
 * @param {object} res
 */
let update = (req, res) => {
        let { collection, id } = req.params
        let data
        if (typeof req.body.data == 'object') data = Array.isArray(req.body.data) ? req.body.data : [req.body.data]
        let validTemplate = template && template.name && template.required && template.model && template.enforceType
        if (data && Array.isArray(data) && data.length && validTemplate && id) {
                if (collection.toLowerCase() === template.name.toLowerCase()) {
                        model.validate(data, template, true)
                                .then(result => {
                                        if (result.valid.length) { return db.update(collection, id, result.valid[0]) }
                                        else manageError(res, { message: 'no valid data', result })
                                })
                                .then(response => res.status(200).json({ msg: 'User was updated successfully.', response }))
                                .catch(error => manageError(res, error))
                }
                else manageError(res, { message: 'Collection doesn\'t match model' })
        }
        else manageError(res, { message: 'invalid data, template or id' })
}

/**
 *
 * @description Function that deletes a single doc from mongoDB
 * @param {object} req 
 * @param {object} res
 */
let deleteById = (req, res) => {
        let { collection, id } = req.params
        if (collection && id) {
                db.delete(collection, id)
                        .then(response => res.json({ msg: `${collection} ${id} deleted successfully`, response }))
                        .catch(error => manageError(res, error))
        }
        else manageError(res, { message: 'collection and id are required' })
}

module.exports.insert = insert
module.exports.readById = readById
module.exports.readAll = readAll
module.exports.update = update
module.exports.deleteById = deleteById

