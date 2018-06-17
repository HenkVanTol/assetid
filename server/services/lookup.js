const LookupModel = require('../models/lookup');

function getAll() {
    return new Promise((resolve, reject) => {
        LookupModel.getAll()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log("lookupservice error: ", err);
                reject(err);
            });
    });
}

module.exports = { getAll };