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
            assetMaster.hierarchyTypeId,
            assetMaster.masterId,
            assetMaster.classId, 
            assetMaster.name,
            assetMaster.description,
            assetMaster.serial,
            assetMaster.registration,
            assetMaster.acquisitionDate,
            assetMaster.serviceDate, 
            assetMaster.retirementDate,
            assetMaster.purchasePrice, 
            assetMaster.purchaseOrderNumber,
            assetMaster.creatorId
        ];
        console.log("values: ", values);
        db.get().query(`insert into assetMaster 
                        (hierarchyTypeId, 
                            masterId, 
                            classId, 
                            name, 
                            description, 
                            serial, 
                            registration, 
                            acquisitionDate, 
                            serviceDate, 
                            retirementDate, 
                            purchasePrice,
                            purchaseOrderNumber,
                            creatorId) values (?)`
        , [values], function (err, result) {
            if (err) {
                console.log("error on asset create: ", err);
                return reject(err);
            }
            resolve({
                id: result.insertId,
                hierarchyTypeId: assetMaster.hierarchyTypeId,
                masterId: assetMaster.masterId,
                classId: assetMaster.classId,
                name: assetMaster.email,
                description: assetMaster.password,
                serial: assetMaster.serial,
                registration: assetMaster.registration,
                acquisitionDate: assetMaster.acquisitionDate,
                serviceDate: assetMaster.serviceDate,
                retirementDate: assetMaster.retirementDate,
                purchasePrice: assetMaster.purchasePrice,
                purchaseOrderNumber: assetMaster.purchaseOrderNumber,
                creatorId: assetMaster.creatorId
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