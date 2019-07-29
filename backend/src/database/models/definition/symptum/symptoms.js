// custom dependencies
const dbSchemata = require('../../../../../config').database.params.schema;

// the schema the table belongs to
const tableSchema = dbSchemata.symptum;

/**
 * @typedef {Object} symptoms
 *
 * @return {symptoms}
 */
module.exports = (sequelize, DataTypes) => sequelize.define('symptoms', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    icd10: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    schema: tableSchema,
    tableName: 'symptoms',
    // if timestamps are on true, sequelize is looking for columns named 'createdAt' and 'updatedAt'
    timestamps: false,
    // tells sequelize that table names are not camelcase but snakecase
    underscored: true,
});
