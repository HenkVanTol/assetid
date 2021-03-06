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

function find(name, description, classId, serial) {
    if (name == "") name = null;
    if (description == "") description = null;
    if (serial == "") serial = null;
    let values = ['%' + name + '%', '%' + description + '%', '%' + serial + '%', classId];
    console.log("values: ", values);
    return new Promise(function (resolve, reject) {
        db.get().query(`select * from assetMaster where name like ? or description like ? or serial like ? or classId = ?`, values, function (err, rows) {
            if (err) {
                console.log("ERROR ON SEARCH: ", err);
                return reject(err);
            }
            console.log("ROWS: ", rows);
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

function findByMasterId(masterId) {
    return new Promise(function (resolve, reject) {
        db.get().query('select * from assetMaster where masterId = ?', masterId, function (err, rows) {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function findByHierarchyTypeId(hierarchyTypeId) {
    return new Promise(function (resolve, reject) {
        db.get().query('select * from assetMaster where hierarchyTypeId = ?', hierarchyTypeId, function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function deleteAsset(id) {
    console.log("in delete");
    return new Promise(function (resolve, reject) {
        db.get().query('delete from assetMaster where id = ?', id, function (err, rows) {
            if (err) return reject(err);
            resolve({ id });
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
            assetMaster.creatorId,
            assetMaster.id
        ];
        console.log("values for update: ", values);
        db.get().query(`update assetMaster 
                        set hierarchyTypeId = ?, 
                            masterId = ?, 
                            classId = ?, 
                            name = ?, 
                            description = ?, 
                            serial = ?, 
                            registration = ?,
                            acquisitionDate = ?,
                            serviceDate = ?,
                            retirementDate = ?,
                            purchasePrice = ?,
                            purchaseOrderNumber = ?,
                            creatorId = ?
                        where Id = ?`,
            values, function (err, result) {
                if (err) reject(err);
                resolve({
                    // hierarchyTypeId: assetMaster.hierarchyTypeId,
                    // masterId: assetMaster.masterId,
                    // classId: assetMaster.classId,
                    // name: assetMaster.name, 
                    // description: assetMaster.description,
                    // serial: assetMaster.serial,
                    // registration: assetMaster.registration, 
                    // acquisitionDate: assetMaster.acquisitionDate,
                    // serviceDate: assetMaster.serviceDate,
                    // retirementDate: assetMaster.retirementDate, 
                    // purchasePrice: assetMaster.purchasePrice,
                    // purchaseOrderNumber: assetMaster.purchaseOrderNumber,
                    // creatorId: assetMaster.creatorId,
                    // id: assetMaster.id
                    assetMaster
                });
            });
    });
}

function clearComponents(masterId) {
    console.log("IN CLEARCOMPONENTS");
    return new Promise((resolve, reject) => {
        let values = [
            masterId
        ];
        console.log("VALUES: ", values);
        db.get().query("update assetMaster set masterId = null where masterid = ?", masterId, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve({ id: masterId });
            }
        })
    });
}

function setComponentMaster(componentId, masterId) {
    console.log("IN SETCOMPONENTMASTER");
    return new Promise((resolve, reject) => {
        let values = [
            masterId,
            componentId
        ];
        console.log("VALUES: ", values);
        db.get().query(`update assetMaster 
                                set masterId = ?
                                where Id = ?`,
            values, function (err, result) {
                if (err) {
                    console.log("SETCOMPONENTMASTER ERROR: ", err);
                    reject(err);
                }
                resolve({ id: componentId });
            });
    });
}

module.exports = { hierarchyTypes, assetClasses, find, create, findById, update, deleteAsset, findByHierarchyTypeId, setComponentMaster, clearComponents, findByMasterId };