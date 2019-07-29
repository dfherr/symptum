// custom dependencies
const dbSchemata = require('../../../../../config').database.params.schema;

// the schema the table belongs to
const tableSchema = dbSchemata.symptum;

/**
 * @typedef {Object} drugs
 *
 * @return {drugs}
 */
module.exports = (sequelize, DataTypes) => sequelize.define('drugs', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    picture: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    schema: tableSchema,
    tableName: 'drugs',
    // if timestamps are on true, sequelize is looking for columns named 'createdAt' and 'updatedAt'
    timestamps: false,
    // tells sequelize that table names are not camelcase but snakecase
    underscored: true,
});
