// custom dependencies
const Sequelize = require('sequelize');
const logger = require('../../logger');
const DbHandler = require('./../database/DbHandler');

/**
 * Add a patient.
 *
 * @param {object} req
 * @param {object} res
 */
function addPatient(req, res) {
    logger.verbose('Add patient functionality triggered');

    const patient = req.body;
    const dbHandler = new DbHandler();
    logger.info(`POST patient: ${patient.name}`);

    // extract my doctorId from the user object set by passport
    patient.doctorId = req.user.id;

    // insert the patient
    dbHandler.create('patients', patient)
        // send a response object containing the just created patient
        .then(createdPatient => res.send({
            success: true,
            message: 'The created patient',
            data: createdPatient,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.addPatient = addPatient;

/**
 * Update a patient.
 *
 * @param {object} req
 * @param {object} res
 */
function updatePatient(req, res) {
    logger.verbose('Update patient functionality triggered');

    const patient = req.body;
    const dbHandler = new DbHandler();
    logger.info(`PUT patient: ${patient.name}`);

    // extract the patient ID from the params
    patient.id = req.params.patientId;
    // extract my doctorId from the user object set by passport
    patient.doctorId = req.user.id;

    // the db query condition
    const condition = {
        where: {
            id: patient.id,
        },
    };

    // update the patient
    dbHandler.update('patients', condition, patient)
        // send a response object
        .then(() => res.send({
            success: true,
            message: `Patient ${patient.id} updated`,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.updatePatient = updatePatient;

/**
 * Delete a patient.
 *
 * @param {object} req
 * @param {object} res
 */
function deletePatient(req, res) {
    logger.verbose('Delete patient functionality triggered');

    const { insuranceNumber } = req.query;
    const dbHandler = new DbHandler();
    logger.info(`DELETE patient: ${insuranceNumber}`);

    // the db query condition
    const condition = {
        where: {
            insuranceNumber,
        },
    };

    // delete the patient from the database
    dbHandler.delete('patients', condition)
        // send a response object
        .then(() => res.send({
            success: true,
            message: `Deleted patient with insurance number: ${insuranceNumber}`,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.deletePatient = deletePatient;

/**
 * Get a patient's data.
 *
 * @param {object} req
 * @param {object} res
 */
function getPatient(req, res) {
    logger.verbose('Get patient functionality triggered');

    const { insuranceNumber } = req.query;
    const dbHandler = new DbHandler();
    logger.info(`GET patient: ${insuranceNumber}`);

    // the db query condition
    const condition = {
        where: {
            insuranceNumber,
        },
    };

    // get the patient from the database
    dbHandler.findOne('patients', condition)
        // send a response object containing the patient
        .then(patient => res.send({
            success: true,
            message: `Found patient with insurance number: ${insuranceNumber}`,
            data: patient.dataValues,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.getPatient = getPatient;

/**
 * Get a diseasesHistory's disease history.
 *
 * @param {object} req
 * @param {object} res
 */
function getDiseaseHistory(req, res) {
    logger.verbose('Get disease history of a patient functionality triggered');

    const { patientId } = req.params;
    const dbHandler = new DbHandler();
    logger.info(`GET disease history for patient: ${patientId}`);

    // the db query condition
    const condition = {
        where: {
            patientId,
        },
    };

    // get the diseasesHistory from the database
    dbHandler.findAll('patients_diseases', condition)
        // send a response object containing the diseasesHistory
        .then(diseasesHistory => res.send({
            success: true,
            message: `Found disease history for patient: ${patientId}`,
            data: diseasesHistory,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.getDiseaseHistory = getDiseaseHistory;

function deleteDiseaseHistory(req, res) {
    logger.verbose('Delete disease from disease history functionality triggered');

    const { patientId } = req.params;
    const dbHandler = new DbHandler();
    logger.info(`DELETE disease history for patient: ${patientId}`);

    // the db query condition
    const condition = {
        where: {
            patientId,
        },
    };

    // delete the patient from the database
    dbHandler.delete('patients_diseases', condition)
        // send a response object
        .then(() => res.send({
            success: true,
            message: `Deleted disease history from patient ${patientId}`,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.deleteDiseaseHistory = deleteDiseaseHistory;

/**
 * Add a patient's disease history.
 *
 * @param {object} req
 * @param {object} res
 */
function addDiseaseHistory(req, res) {
    logger.verbose('Add disease history functionality triggered');

    // disease history has the following format:
    //
    // [
    //     { diseaseId: 1, when: '2.2.10', active: true },
    //     { diseaseId: 1, when: '2.2.10', active: false },
    // ];

    const { patientId } = req.params;
    const { diseasehistory } = req.body;
    const dbHandler = new DbHandler();
    logger.info(`POST disease history for patient: ${patientId}`);

    // build the object to be added to the database
    const patientsDiseases = [];

    // iterate over all the diseaseHistory and add them to patientsDiseases
    diseasehistory.forEach((patientsDisease) => {
        patientsDiseases.push({
            patientId,
            ...patientsDisease,
        });
    });

    // insert the patient's diseases in the m:n table 'patients_diseases'
    dbHandler.bulkCreate('patients_diseases', patientsDiseases)
        // send a response object
        .then(() => res.send({
            success: true,
            message: 'The patient\'s diseases have been created',
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.addDiseaseHistory = addDiseaseHistory;

/** Gets the correct likelihood from the likelihood array
 *  It's structured like this:
 *
 * [m0-2, m3-5, m6-13,m14-18,m19-33,m34-48,m49-64,m65-78,m79+,
 * f0-2, f3-5, f6-13,f14-18,f19-33,f34-48,f49-64,f65-78,f79+]
 *
 * @param {*} likelihoods
 * @param {*} age
 * @param {*} gender
 */
function getLikelihood(likelihoods, age, gender) {
    let index = 0;
    if (gender === 'female') {
        index = 9;
    }
    if (age > 3 && age < 6) {
        index += 1;
    } else if (age < 14) {
        index += 2;
    } else if (age < 19) {
        index += 3;
    } else if (age < 34) {
        index += 4;
    } else if (age < 49) {
        index += 5;
    } else if (age < 65) {
        index += 6;
    } else if (age < 79) {
        index += 7;
    } else {
        index += 8;
    }

    return likelihoods[index];
}

/**
 *  Creates the differential diagnosis for a patient with the provided symptoms
 *
 * @param {*} patientId
 * @param {*} symptomIds
 */
function createDifferentialDiagnosis(patientId, symptomIds) {
    return new Promise((resolve, reject) => {
        let condition = {
            where: {
                id: {
                    [Sequelize.Op.in]: symptomIds,
                },
            },
        };
        logger.info('test1');
        const dbHandler = new DbHandler();
        dbHandler.findAll('symptoms', condition)
            .then(symptoms => new Promise((innerResolve, innerReject) => {
                if (symptoms.length === 0) {
                    return resolve([]);
                }
                const symptomIcds = [];
                symptoms.forEach((symptom) => {
                    symptomIcds.push(symptom.icd10);
                });
                logger.info(symptomIcds);
                condition = {
                    where: {
                        symptomIcds: {
                            [Sequelize.Op.contains]: symptomIcds,
                        },
                    },
                };
                dbHandler.findAll('diseases', condition)
                    .then(diseases => innerResolve(diseases))
                    .catch(err => innerReject(err));
            }))
            .then(diseases => new Promise((innerResolve, innerReject) => {
                if (diseases.length === 0) {
                    logger.info('No diseases match these symptoms');
                    return resolve([]);
                }
                logger.info(`Found ${diseases.length} diseases`);

                const condition2 = {
                    where: {
                        id: patientId,
                    },
                };
                dbHandler.findOne('patients', condition2)
                    .then(patient => innerResolve({ patient, diseases }))
                    .catch(err => innerReject(err));
            }))
            .then(data => new Promise((innerResolve, innerReject) => {
                const output = [];
                let likelihoodSum = 0;
                data.diseases.forEach((disease) => {
                    let likelihood = getLikelihood(disease.relativeLikelihoods, data.patient.age, data.patient.gender);
                    if (likelihood > 0) {
                        likelihood = 1.0 / likelihood; // transform to probability
                        likelihoodSum += likelihood; // calculate for normalization
                    }
                    if (disease.icd10 === 'R51') {
                        logger.info(disease);
                    }
                    const outDisease = {
                        diseaseId: disease.id,
                        name: `[${disease.icd10}] ${disease.name}`,
                        likelihood,
                    };
                    output.push(outDisease);
                });
                output.forEach((outDisease) => {
                    outDisease.likelihood = (outDisease.likelihood / likelihoodSum) * 100;
                });

                output.sort((a, b) => {
                    if (a.likelihood < b.likelihood) {
                        return 1;
                    }
                    if (a.likelihood > b.likelihood) {
                        return -1;
                    }
                    return 0;
                });

                resolve(output);
            }))
            .catch((err) => {
                reject(err);
            });
    });
}

/**
 * Add a patient's symptoms.
 *
 * @param {object} req
 * @param {object} res
 */
function addSymptoms(req, res) {
    logger.verbose('Add symptoms functionality triggered');

    const { patientId } = req.params;
    const { symptomIds } = req.body;
    const dbHandler = new DbHandler();
    logger.info(`POST symptoms for patient: ${patientId}`);

    // build the object to be added to the database
    const patientsSymptoms = [];

    // iterate over all symptoms and add them to patientsSymptoms
    symptomIds.forEach((symptomId) => {
        patientsSymptoms.push({
            patientId,
            symptomId,
        });
    });

    // the db query deleteCondition
    const deleteCondition = {
        where: {
            patientId,
        },
    };

    // delete all patient's symptoms from previous differential diagnosis
    dbHandler.delete('patients_symptoms', deleteCondition)
        .then(() => {
            // insert the patient's symptoms in the m:n table 'patients_symptoms'
            dbHandler.bulkCreate('patients_symptoms', patientsSymptoms)
                // perform the differential diagnosis and send a response object
                .then(() => new Promise((resolve, reject) => {
                    logger.info('Creating differential diagnosis...');
                    resolve(createDifferentialDiagnosis(patientId, symptomIds));
                }))
                // then send response
                .then((diagnosis) => {
                    res.send({
                        success: true,
                        data: diagnosis,
                        message: 'The patient\'s symptoms have been created and the differential diagnosis performed',
                        status: 200,
                    });
                })
                .catch((err) => {
                    logger.error(err);
                });
        })
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.addSymptoms = addSymptoms;
