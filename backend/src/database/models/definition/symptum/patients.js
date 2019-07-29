// custom dependencies
const dbSchemata = require('../../../../../config').database.params.schema;

// the schema the table belongs to
const tableSchema = dbSchemata.symptum;

/**
 * @typedef {Object} patients
 *
 * @return {patients}
 */
module.exports = (sequelize, DataTypes) => sequelize.define('patients', {
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
    insuranceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    insuranceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'diverse'),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // doctorId: {
    //     type: DataTypes.BIGINT,
    //     allowNull: false,
    //     references: {
    //         model: 'users',
    //         key: 'id',
    //     },
    // },
}, {
    schema: tableSchema,
    tableName: 'patients',
    // if timestamps are on true, sequelize is looking for columns named 'createdAt' and 'updatedAt'
    timestamps: false,
    // tells sequelize that table names are not camelcase but snakecase
    underscored: true,
});
