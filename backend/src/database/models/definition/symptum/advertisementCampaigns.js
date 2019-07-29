// custom dependencies
const dbSchemata = require('../../../../../config').database.params.schema;

// the schema the table belongs to
const tableSchema = dbSchemata.symptum;

/**
 * @typedef {Object} advertisementCampaigns
 *
 * @return {advertisementCampaigns}
 */
module.exports = (sequelize, DataTypes) => sequelize.define('advertisementCampaigns', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    from: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    to: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    // drugId: {
    //     type: DataTypes.BIGINT,
    //     allowNull: false,
    //     references: {
    //         model: 'drugs',
    //         key: 'id',
    //     },
    // },
}, {
    schema: tableSchema,
    tableName: 'advertisementCampaigns',
    // if timestamps are on true, sequelize is looking for columns named 'createdAt' and 'updatedAt'
    timestamps: false,
    // tells sequelize that table names are not camelcase but snakecase
    underscored: true,
});
