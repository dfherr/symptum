// custom dependencies
const relations = require('./relations');

/**
 * Initializing the models.
 *
 * @param {Sequelize} sequelize the sequelize instance
 */
exports.init = (sequelize) => {
    // symptum
    sequelize.import('./definition/symptum/users.js');
    sequelize.import('./definition/symptum/patients.js');
    sequelize.import('./definition/symptum/symptoms.js');
    sequelize.import('./definition/symptum/diseases.js');
    sequelize.import('./definition/symptum/drugs.js');
    sequelize.import('./definition/symptum/drugIngredients.js');
    sequelize.import('./definition/symptum/advertisementCampaigns.js');
    sequelize.import('./definition/symptum/patientsDiseases.js');

    // trigger the initiation of relations
    relations.init(sequelize);
};
