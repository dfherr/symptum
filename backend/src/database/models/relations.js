/**
 * Initializing the relations between the models.
 *
 * @param {Sequelize} sequelize the sequelize instance
 */
exports.init = (sequelize) => {
    // the sequelize models (database tables)
    const { models } = sequelize;

    // schema symptum
    const { patients } = models;
    const { symptoms } = models;
    const { diseases } = models;
    const { drugs } = models;
    const { drugIngredients } = models;
    const { advertisementCampaigns } = models;
    const { users } = models;

    // cascade options (to enforce the observance of key constraints)
    const cascade = {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    };

    /**
     * The associations between the models.
     *
     * @see http://docs.sequelizejs.com/manual/tutorial/associations.html
     * @example Player.belongsTo(Team); // Will add a teamId attribute to Player to hold the primary key value for Team
     */
    // patients - users (FK)
    // the doctor of a patient
    patients.belongsTo(users, { as: 'doctor', ...cascade });
    users.hasOne(patients, { as: 'doctor', ...cascade });

    // advertisementCampaigns - drugs (FK)
    // the drug the campaign is promoting
    advertisementCampaigns.belongsTo(drugs, cascade);
    drugs.hasMany(advertisementCampaigns, cascade);

    // advertisementCampaigns - users (FK)
    // the pharma user who started the campaign
    advertisementCampaigns.belongsTo(users, cascade);
    users.hasMany(advertisementCampaigns, cascade);

    // drugIngredients - drugs (m:n table)
    // the ingredients of a drug
    drugIngredients.belongsToMany(drugs, { through: 'drugs_drugIngredients', ...cascade });
    // drugs.hasMany(drugIngredients, cascade);

    // patients - symptoms (m:n table)
    // the symptoms a patient has
    patients.belongsToMany(symptoms, { through: 'patients_symptoms', ...cascade });
    // symptoms.hasMany(patients, cascade);

    // drugs - diseases (m:n table)
    // diseases a drug cures
    drugs.belongsToMany(diseases, { through: 'drugs_diseases', ...cascade });
    // diseases.hasMany(drugs, cascade);

    // symptoms - diseases (m:n table)
    // the symptoms a disease causes
    symptoms.belongsToMany(diseases, { through: 'symptoms_diseases', ...cascade });
    // diseases.hasMany(symptoms, cascade);

    // patients - diseases (m:n table)
    // the history of diseases a patient has
    patients.belongsToMany(diseases, { through: 'patients_diseases', ...cascade });
    // diseases.hasMany(patients, cascade);
};
