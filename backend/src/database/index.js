// module dependencies
const Sequelize = require('sequelize');

// custom dependencies
const config = require('../../config');
const models = require('./models/models');

// setting up the database connection with additional config options
const { database } = config;
const sequelize = new Sequelize(database.url, database);

// initializing the models
models.init(sequelize);

// setting up model associations
Object.keys(sequelize.models).forEach((modelName) => {
    if (sequelize.models[modelName].associate) {
        sequelize.models[modelName].associate(sequelize);
    }
});

module.exports = sequelize;
