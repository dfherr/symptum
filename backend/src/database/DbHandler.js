// custom dependencies
const db = require('.');

/**
 * Module to centrally handle all database transactions.
 */
/* eslint-disable class-methods-use-this */
module.exports = class DbHandler {
    constructor() {
        this.t = null;

        return {
            t: this.t,
            findOne: this.findOne,
            findAll: this.findAll,
            create: this.create,
            bulkCreate: this.bulkCreate,
            update: this.update,
            delete: this.delete,
            query: this.query,
            findOrCreate: this.findOrCreate,
        };
    }

    /**
     * Read one object from database table.
     *
     * @param {string} tableName
     * @param {object} condition
     *
     * @return {Promise}
     */
    findOne(tableName, condition) {
        const Model = db.models[tableName];
        return Model.findOne(condition)
            .then(obj => Promise.resolve(obj))
            .catch(err => Promise.reject({ msgCode: `<FindOne_${tableName}>`, err }));
    }

    /**
     * Read all objects from database table.
     *
     * @param {string} tableName
     * @param {object} condition
     *
     * @return {Promise}
     */
    findAll(tableName, condition) {
        const Model = db.models[tableName];
        return Model.findAll(condition)
            .then(objArray => Promise.resolve(objArray))
            .catch(err => Promise.reject({ msgCode: `<FindAll_${tableName}>`, err }));
    }

    /**
     * Create ressource in database table.
     *
     * @param {string} tableName
     * @param {object} property
     *
     * @return {Promise}
     */
    create(tableName, property) {
        const Model = db.models[tableName];
        return Model.create(property, { transaction: this.t })
            .then(newObj => Promise.resolve(newObj))
            .catch(err => Promise.reject({ msgCode: `<Create_${tableName}>`, err }));
    }

    /**
     * Create multiple ressources in database table.
     *
     * @param {string} tableName
     * @param {array} properties
     *
     * @return {Promise}
     */
    bulkCreate(tableName, properties) {
        const Model = db.models[tableName];
        return Model.bulkCreate(properties, { transaction: this.t, returning: true })
            .then(newObj => Promise.resolve(newObj))
            .catch(err => Promise.reject({ msgCode: `<BulkCreate_${tableName}>`, err }));
    }

    /**
     * Update ressources in database table.
     *
     * @param {string} tableName
     * @param {object} condition
     * @param {object} property
     *
     * @return {Promise}
     */
    update(tableName, condition, property) {
        const Model = db.models[tableName];
        condition.transaction = this.t;
        return Model.update(property, condition)
            .then(() => Promise.resolve())
            .catch(err => Promise.reject({ msgCode: `<Update_${tableName}>`, err }));
    }

    /**
     * Delete ressources in database table.
     *
     * @param {string} tableName
     * @param {object} condition
     *
     * @return {Promise}
     */
    delete(tableName, condition) {
        const Model = db.models[tableName];
        condition.transaction = this.t;
        return Model.destroy(condition)
            .then(() => Promise.resolve())
            .catch(err => Promise.reject({ msgCode: `<Delete_${tableName}>`, err }));
    }

    /**
     * Find a ressource or create if it does not exist.
     *
     * @param {string} tableName
     * @param {object} options
     *
     * @return {Promise}
     */
    findOrCreate(tableName, options) {
        const Model = db.models[tableName];
        options.transaction = this.t;
        return Model.findOrCreate(options)
            .then(() => Promise.resolve())
            .catch(err => Promise.reject({ msgCode: `<FindOrCreate_${tableName}>`, err }));
    }
};
