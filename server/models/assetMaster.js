const db = require('../db');

function hierarchyTypes() {
    return new Promise(function (resolve, reject) {
        db.get().query('select * from hierarchyType', function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function assetClasses() {
    return new Promise(function (resolve, reject) {
        db.get().query('select * from assetClass', function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function find(name, description) {
    console.log("description", description);
    return new Promise(function (resolve, reject) {
        db.get().query('select * from assetMaster where description = ?', description, function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function findById(id) {
    return new Promise(function (resolve, reject) {
        db.get().query('select * from assetMaster where id = ?', id, function (err, rows) {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });
}

function create(assetMaster) {
    return new Promise((resolve, reject) => {
        let values = [
            assetMaster.name, 
            assetMaster.description, 
            assetMaster.serial,
            assetMaster.registration, 
            assetMaster.acquisitionDate, 
            assetMaster.retirementDate, 
            assetMaster.hierarchyTypeId
        ];
        console.log("values: ", values);
        db.get().query("insert into assetMaster (name, description, serial, registration, acquisitionDate, retirementDate, hierarchyTypeId) values (?)", [values], function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve({
                id: result.insertId,
                name: assetMaster.email,
                description: assetMaster.password,
                serial: assetMaster.serial,
                registration: assetMaster.registration,
                purchasePrice: assetMaster.purchasePrice,
                acquisitionDate: assetMaster.acquisitionDate,
                retirementDate: assetMaster.retirementDate,
                hierarchyTypeId: assetMaster.hierarchyTypeId
            });
        });
    });
}

function update(assetMaster) {
    return new Promise((resolve, reject) => {
        let values = [assetMaster.name, assetMaster.description, assetMaster.serial,
        assetMaster.registration, assetMaster.acquisitionDate, assetMaster.retirementDate, assetMaster.hierarchyTypeId, assetMaster.id];
        console.log("values for update: ", values);
        db.get().query("update assetMaster set name = ?, description = ?, serial = ?, registration = ?, acquisitionDate = ?, retirementDate = ?, hierarchyTypeId = ? where id = ?", values, function (err, result) {
            if (err) reject(err);
            resolve({
                id: assetMaster.id,
                name: assetMaster.email,
                description: assetMaster.password,
                serial: assetMaster.serial,
                registration: assetMaster.registration,
                purchasePrice: assetMaster.purchasePrice,
                acquisitionDate: assetMaster.acquisitionDate,
                retirementDate: assetMaster.retirementDate,
                hierarchyTypeId: assetMaster.hierarchyTypeId
            });
        });
    });
}

module.exports = { hierarchyTypes, assetClasses, find, create, findById, update };