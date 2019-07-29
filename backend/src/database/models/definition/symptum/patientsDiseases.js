// custom dependencies
const dbSchemata = require('../../../../../config').database.params.schema;

// the schema the table belongs to
const tableSchema = dbSchemata.symptum;

/**
 * @typedef {Object} patients_diseases
 *
 * @return {patients_diseases}
 */
module.exports = (sequelize, DataTypes) => sequelize.define('patients_diseases', {
    when: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    schema: tableSchema,
    tableName: 'patients_diseases',
    // if timestamps are on true, sequelize is looking for columns named 'createdAt' and 'updatedAt'
    timestamps: false,
    // tells sequelize that table names are not camelcase but snakecase
    underscored: true,
});
