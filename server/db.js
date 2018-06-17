const mysql = require('mysql');

var state = {
    pool: null
};

function connect(options, done) {
    state.pool = mysql.createPool(options);
    done();
}

function get() {
    return state.pool;
}

module.exports = { connect, get };