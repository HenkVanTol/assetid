const db = require('../db');

 function getAll() {
     return new Promise(function (resolve, reject) {
        db.get().query('select * from hierarchyType', function (err, rows) {
            if (err) {
                console.log("err", err);
                return reject(err);
            }
            console.log("rows: ", rows);
            resolve(rows);
        });
     });
}

module.exports = { getAll };