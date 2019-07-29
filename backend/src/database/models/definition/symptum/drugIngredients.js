// custom dependencies
const dbSchemata = require('../../../../../config').database.params.schema;

// the schema the table belongs to
const tableSchema = dbSchemata.symptum;

/**
 * @typedef {Object} drugIngredients
 *
 * @return {drugIngredients}
 */
module.exports = (sequelize, DataTypes) => sequelize.define('drugIngredients', {
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
    concentration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // drugId: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     references: {
    //         model: 'drugs',
    //         key: 'id',
    //     },
    // },
}, {
    schema: tableSchema,
    tableName: 'drugIngredients',
    // if timestamps are on true, sequelize is looking for columns named 'createdAt' and 'updatedAt'
    timestamps: false,
    // tells sequelize that table names are not camelcase but snakecase
    underscored: true,
});
