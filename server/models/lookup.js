const db = require('../db');

 function getAll() {
     return new Promise(function (resolve, reject) {
        db.get().query('select * from hierarchyType', function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
     });
}

module.exports = { getAll };