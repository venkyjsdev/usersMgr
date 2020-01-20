'use strict'

/**
* @description Model validator.
* @author LocUsNine - Vikas Gawade
* @date 17/01/2020
*/

/**
 * @description confirms validity of an object compared to its model
 * @param {object} data
 * @param {object} template 
 * @return {Promise} {valid: boolean, reason: string, data: object}
 */
let validateObject = (data = {}, template) => {
    return new Promise((resolve, reject) => {
        try {
            template.required.forEach(required => {
                required.split('.').reduce((prev, cur) => {
                    if (!prev.hasOwnProperty(cur)) resolve({ valid: false, reason: `Field ${required} is required`, data })
                    return prev[cur]
                }, data)
            })
            template.enforceType.forEach(typed => {
                typed.split('.').reduce((prev, cur) => {
                    let exist = prev.data.hasOwnProperty(cur) && prev.model.hasOwnProperty(cur)
                    let type = typeof prev.data[cur]
                    let must = typeof prev.model[cur]
                    if (exist && type !== must)
                        resolve({ valid: false, reason: `Field ${typed} should be ${must} instead of ${type} (${prev.data[cur]})`, data })
                    return { data: prev.data[cur], model: prev.model[cur] }
                }, { data, model: template.model })
            })
            template.default.forEach(field => {
                field.key.split('.').reduce((prev, cur, i, array) => {
                    if (eval(`!${prev}.hasOwnProperty('${cur}')`)) {
                        if (i < array.length - 1) eval(`${prev}.${cur} = {}`)
                        else eval(`${prev}.${cur} = field.value || eval(field.formula)`)
                    }
                    return prev + '.' + cur
                }, 'data')
            })
            resolve({ valid: true, data })
        }
        catch (e) { reject(e) }
    })
}

let enforceType = (data = {}, template) => {
    return new Promise((resolve, reject) => {
        try {
            template.enforceType.forEach(typed => {
                typed.split('.').reduce((prev, cur) => {
                    let exist = prev.data.hasOwnProperty(cur) && prev.model.hasOwnProperty(cur)
                    let type = typeof prev.data[cur]
                    let must = typeof prev.model[cur]
                    if (exist && type !== must)
                        resolve({ valid: false, reason: `Field ${typed} should be ${must} instead of ${type} (${prev.data[cur]})`, data })
                    return { data: prev.data[cur], model: prev.model[cur] }
                }, { data, model: template.model })
            })
            resolve({ valid: true, data })
        }
        catch (e) { reject(e) }
    })
}

/**
 * @description confirms validity of an object compared to its model
 * @param {array} data
 * @param {object} template 
 * @return {Promise} { valid: array, invalid: array }
 */
let validate = (data, template, update) => {
    return new Promise((resolve, reject) => {
        Promise.all(
            data.map(elem => {
                if (update) return enforceType(elem, template)
                else return validateObject(elem, template)
            }))
            .then(result => {
                return result.reduce((prev, cur) => {
                    cur.valid ? prev.valid.push(cur.data) : prev.invalid.push(cur)
                    return prev
                }, { invalid: [], valid: [] })
            })
            .then(result => resolve(result))
            .catch(e => reject(e))
    })
}

module.exports.validate = validate
