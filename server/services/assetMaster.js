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

function find(name, description) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.find(name, description)
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

module.exports = { hierarchyTypes, assetClasses, find, create, findById, update };