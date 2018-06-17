const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const db = require('../db');
const sql = require('mssql');

function findById(id) {
    return new Promise(function (resolve, reject) {
        db.get().request()
        .input("id", sql.Int, id)
        .query("select * from dbo.[user] where id = @id", function (err, result) {
            if (err) return reject(err);
            resolve(result.recordset[0]);
        });
    });
}

function findByEmail(email) {
    return new Promise(function (resolve, reject) {
        db.get().request()
        .input("email", sql.VarChar(255), email)
        .query("select * from dbo.[user] where email = @email")
            .then(result => {
                resolve(result.recordset[0]);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function insert(user, done) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            let values = [user.email, user.password];
            db.get().request()
            .input("email", sql.VarChar(255), user.email)
            .input("password", sql.VarChar(255), user.password)
            .query("insert into dbo.[user] (email, password) values (@email, @password);select scope_identity() as insertedId;", function (err, result) {
                if (err) return done(err);
                done(null, {
                    id: result.recordset[0].insertedId,
                    email: user.email,
                    password: user.password
                });
            });
        });
    });
}

function create(user) {
    return new Promise(function (resolve, reject) {
        insert(user, function (err, data) {
            if (err !== null) return reject(err);
            resolve(data);
        });
    });
}

// The user's password is never saved in plain text.  Prior to saving the
// user model, we 'salt' and 'hash' the users password.  This is a one way
// procedure that modifies the password - the plain text password cannot be
// derived from the salted + hashed version. See 'comparePassword' to understand
// how this is used.
function update(user) {
    let sql = "select * from user where id = @id";
    let existing = db.get()
    .input("id", sql.Int, user.id)
    .request().query(sql, function (err, result) {
        if (err) throw err;
        //check if password has changed - salt and hash if it did
        if (result) {
            if (result.password != user.password) {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) { return next(err); }
                    bcrypt.hash(user.password, salt, null, (err, hash) => {
                        if (err) { return next(err); }
                        user.password = hash;
                    });
                });
            }
            let updateSql = "update user set email = @email, password = @password where id = @id";
            db.get().request()
            .input("email", sql.VarChar(255), user.email)
            .input("password", sql.VarChar(255), user.password)
            .input("id", sql.Int, user.id)
            .query(sql, function (err, result) {
                if (err) throw err;
                if (result) {
                    console.log(result.affectedRows + " user record(s) updated");
                }
            });
        }
    });
}

// We need to compare the plain text password (submitted whenever logging in)
// with the salted + hashed version that is sitting in the database.
// 'bcrypt.compare' takes the plain text password and hashes it, then compares
// that hashed password to the one stored in the DB.  Remember that hashing is
// a one way process - the passwords are never compared in plain text form.
function comparePassword(currentPassword, candidatePassword, cb) {
    bcrypt.compare(candidatePassword, currentPassword, (err, isMatch) => {
        cb(err, isMatch);
    });
};

module.exports = { create, update, comparePassword, findByEmail, findById };
