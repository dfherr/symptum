// custom dependencies
const dbSchemata = require('../../../../../config').database.params.schema;

// the schema the table belongs to
const tableSchema = dbSchemata.symptum;

/**
 * @typedef {Object} diseases
 *
 * @return {diseases}
 */
module.exports = (sequelize, DataTypes) => sequelize.define('diseases', {
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
    symptomIcds: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    // stores the relativeLikelihoods for male/female and age groups
    // age groups are the k-means clustering groups
    // of https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3825015/
    //
    // the values are integers in format 1 in x people
    // the array is structured as follows:
    // [m0-2, m3-5, m6-13,m14-18,m19-33,m34-48,m49-64,m65-78,m79+,
    // f0-2, f3-5, f6-13,f14-18,f19-33,f34-48,f49-64,f65-78,f79+]
    relativeLikelihoods: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
}, {
    schema: tableSchema,
    tableName: 'diseases',
    // if timestamps are on true, sequelize is looking for columns named 'createdAt' and 'updatedAt'
    timestamps: false,
    // tells sequelize that table names are not camelcase but snakecase
    underscored: true,
});
