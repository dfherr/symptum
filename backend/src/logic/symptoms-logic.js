// custom dependencies
const logger = require('../../logger');
const DbHandler = require('./../database/DbHandler');

/**
 * Get all symptoms.
 *
 * @param {object} req
 * @param {object} res
 */
function getAllSymptoms(req, res) {
    logger.verbose('Get all symptoms functionality triggered');

    const dbHandler = new DbHandler();

    // get all symptoms
    dbHandler.findAll('symptoms', {})
        // send response object
        .then((symptoms) => {
            symptoms.forEach((symptom) => {
                symptom.name = `[${symptom.icd10}] ${symptom.name}`;
                delete symptom.icd10;
            });
            res.send({
                success: true,
                message: 'All symptoms',
                data: symptoms,
                status: 200,
            });
        })
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.getAllSymptoms = getAllSymptoms;
