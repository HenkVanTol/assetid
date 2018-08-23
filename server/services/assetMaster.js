const AssetMasterModel = require('../models/assetMaster');

function hierarchyTypes() {
    return new Promise((resolve, reject) => {
        AssetMasterModel.hierarchyTypes()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function assetClasses() {
    return new Promise((resolve, reject) => {
        AssetMasterModel.assetClasses()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function find(name, description, classId, serial) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.find(name, description, classId, serial)
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.findById(id)
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function findByMasterId(masterId) {
    console.log("service masterId: ", masterId);
    return new Promise((resolve, reject) => {
        AssetMasterModel.findByMasterId(masterId)
            .then(results => {
                console.log("serivce results:", results);
                resolve(results);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function findByHierarchyTypeId(hierarchyTypeId) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.findByHierarchyTypeId(hierarchyTypeId)
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function findAll() {
    return new Promise((resolve, reject) => {
        AssetMasterModel.findById(id)
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function deleteAsset(id) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.deleteAsset(id)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function create(assetMaster) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.create(assetMaster)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function update(assetMaster) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.update(assetMaster)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function clearComponents(masterId) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.clearComponents(masterId)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function setComponentMaster(componentId, masterId) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.setComponentMaster(componentId, masterId)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}


module.exports = { hierarchyTypes, assetClasses, find, create, findById, update, deleteAsset, findByHierarchyTypeId, setComponentMaster, clearComponents, findByMasterId };