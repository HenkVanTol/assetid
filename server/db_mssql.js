const mssql = require('mssql');

var state = {
    pool: null
};

function connect(options) {
    return new Promise(function (resolve, reject) {
        mssql.connect(options)
            .then(pool => {
                state.pool = pool;
                resolve(pool);
            })
            .catch(error => reject(error));
    });
}

function get() {
    return state.pool;
}

module.exports = { connect, get };