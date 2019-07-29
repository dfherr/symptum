// custom dependencies
const logger = require('../../logger');
const DbHandler = require('./../database/DbHandler');

/**
 * Get all diseases.
 *
 * @param {object} req
 * @param {object} res
 */
function getAllDiseases(req, res) {
    logger.verbose('Get all diseases functionality triggered');

    const dbHandler = new DbHandler();

    // get all dieseases
    dbHandler.findAll('diseases', { attributes: ['id', 'icd10', 'name'] })
        // send response object
        .then((diseases) => {
            diseases.forEach((disease) => {
                disease.name = `[${disease.icd10}] ${disease.name}`;
                delete disease.icd10;
            });
            res.send({
                success: true,
                message: 'All diseases',
                data: diseases,
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

exports.getAllDiseases = getAllDiseases;
