// module dependencies
const _ = require('lodash');

// custom dependencies
const Sequelize = require('sequelize');
const imageType = require('image-type');
const logger = require('../../logger');
const DbHandler = require('./../database/DbHandler');
const sequelize = require('./../database/index');

/**
 * Add a drug.
 *
 * @param {object} req
 * @param {object} res
 */
function addDrug(req, res) {
    logger.verbose('Add drug functionality triggered');

    // extract diseases the drug treats and drugIngredients and delete them
    const diseaseIdsDrugTreats = req.body.diseaseIds;
    const drugIngredients = JSON.parse(req.body.drugIngredients);

    delete req.body.diseaseIds;
    delete req.body.drugIngredients;

    const drug = req.body;
    const dbHandler = new DbHandler();
    logger.info(`POST drug: ${drug.name}`);

    // log if pictures have been provided
    if (!req.files) {
        logger.info(`No picture for drug ${drug.name} provided`);
    }

    // extract the drug image
    _.forOwn(req.files, (file) => {
        drug.picture = file.data;
    });

    logger.verbose(drug.picture);

    // insert the drug
    dbHandler.create('drugs', drug)
        .then(createdDrug => new Promise((resolve, reject) => {
            logger.info(`Create entries for the diseases drug ${drug.name} treats`);

            // build the object to be added to the database
            const diseasesTheDrugTreats = [];
            const drugId = createdDrug.id;

            // iterate over all diseases and add them to diseasesTheDrugTreats
            diseaseIdsDrugTreats.split(',').forEach((diseaseId) => {
                diseasesTheDrugTreats.push({
                    drugId,
                    diseaseId,
                });
            });

            // create the entries for the diseases the drug treats
            dbHandler.bulkCreate('drugs_diseases', diseasesTheDrugTreats)
                .then(() => resolve(createdDrug))
                .catch(err => reject(err));
        }))
        .then(createdDrug => new Promise((resolve, reject) => {
            logger.info(`Create entries for the drugIngredients of drug ${drug.name}`);

            // add drugIngredients of the drug
            dbHandler.bulkCreate('drugIngredients', drugIngredients)
                .then((createdIngredients) => {
                    resolve({ ingredients: createdIngredients, drug: createdDrug });
                })
                .catch((err) => {
                    reject(err);
                });
        }))
        .then(created => new Promise((resolve, reject) => {
            logger.info(`Create entries for the drugIngredientsOfTheDrug of drug ${drug.name}`);
            // build the object to be added to the database
            const drugIngredientsOfTheDrug = [];
            const drugId = created.drug.id;

            // iterate over all drugIngredients and add them to drugIngredientsOfTheDrug
            created.ingredients.forEach((drugIngredient) => {
                drugIngredientsOfTheDrug.push({
                    drugId,
                    drugIngredientId: drugIngredient.dataValues.id,
                });
            });

            // add drugIngredients of the drug
            dbHandler.bulkCreate('drugs_drugIngredients', drugIngredientsOfTheDrug)
                .then(() => resolve(created.drug))
                .catch(err => reject(err));
        }))
        // send a response object containing the just created drug
        .then(createdDrug => res.send({
            success: true,
            message: 'The created drug',
            data: createdDrug,
            status: 200,
        }))
        // send an error response object
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err,
                status: 500,
            });
        });
}

exports.addDrug = addDrug;

/**
 * Get a drug.
 *
 * @param {object} req
 * @param {object} res
 */
function getDrug(req, res) {
    logger.verbose('Get drug functionality triggered');

    const { drugId } = req.params;
    const dbHandler = new DbHandler();
    logger.info(`GET drug: ${drugId}`);

    // the db query condition
    const condition = {
        attributes: ['id', 'name', 'dosage', 'price'],
        where: {
            id: drugId,
        },
    };

    // get the drug from the database
    dbHandler.findOne('drugs', condition)
        // send a response object containing the drug
        .then(drug => res.send({
            success: true,
            message: `Found drug with id: ${drugId}`,
            data: drug.dataValues,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.getDrug = getDrug;

/**
 * Get a drug picture.
 *
 * @param {object} req
 * @param {object} res
 */
function getDrugPicture(req, res) {
    logger.verbose('Get drug functionality triggered');

    const { drugId } = req.params;
    const dbHandler = new DbHandler();
    logger.info(`GET picture of drug: ${drugId}`);

    // the db query condition
    const condition = {
        attributes: ['picture'],
        where: {
            id: drugId,
        },
    };

    // get the drug from the database
    dbHandler.findOne('drugs', condition)
        // send the image as the response
        .then((drug) => {
            res.set('Content-Type', imageType(drug.picture).mime);
            res.send(Buffer.from(drug.picture));
        })
        // send an error response object
        .catch((err) => {
            logger.error(err);
            res.status(500).send({
                success: false,
                message: err,
                status: 500,
            });
        });
}

exports.getDrugPicture = getDrugPicture;

/**
 * Get all drugIds for a certain disease.
 *
 * @param {object} req
 * @param {object} res
 */
function getDrugsForDisease(req, res) {
    logger.verbose('Get drugs for disease functionality triggered');

    const { diseaseId } = req.params;
    const dbHandler = new DbHandler();
    logger.info(`GET drugs for disease: ${diseaseId}`);

    // raw quuery because sequelize can't handle group by with associations properly
    let rawQuery = 'SELECT "drugs"."id", "drugs"."name", "drugs"."dosage"';
    rawQuery += ' ,"drugs"."price", MAX("ads"."to") AS "adUntil" FROM "public"."drugs" AS "drugs"';
    rawQuery += ' INNER JOIN "public"."drugs_diseases" AS "drugs_diseases"';
    rawQuery += ' ON "drugs"."id" = "drugs_diseases"."drug_id"';
    rawQuery += ' INNER JOIN "public"."diseases" AS "diseases"';
    rawQuery += ' ON "diseases"."id" = "drugs_diseases"."disease_id"';
    rawQuery += ' INNER JOIN "public"."advertisementCampaigns" AS "ads"';
    rawQuery += ' ON "ads"."drug_id" = "drugs"."id"';
    rawQuery += ' WHERE "diseases"."id" = :diseaseId';
    rawQuery += ' GROUP BY "drugs"."id"';
    rawQuery += ' ORDER BY "adUntil" DESC, "drugs"."id" DESC;';

    // get all drugs for a particular disease
    sequelize.query(rawQuery, { replacements: { diseaseId }, type: Sequelize.QueryTypes.SELECT })
        // send response object
        .then((drugs) => {
            logger.info(drugs);
            res.send({
                success: true,
                message: `All drugs for the disease ${diseaseId}`,
                data: drugs,
                status: 200,
            });
        })
        // send an error response object
        .catch((err) => {
            logger.info(err);
            res.status(500).send({
                success: false,
                message: err,
                status: 500,
            });
        });
}

exports.getDrugsForDisease = getDrugsForDisease;

/**
 * Get all drug ingredients.
 *
 * @param {object} req
 * @param {object} res
 */
function getDrugIngredients(req, res) {
    logger.verbose('Get all drug ingredients functionality triggered');

    const dbHandler = new DbHandler();

    // get all drug ingredients
    dbHandler.findAll('drugIngredients', {})
        // send response object
        .then(drugIngredients => res.send({
            success: true,
            message: 'All drug ingredients',
            data: drugIngredients,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.getDrugIngredients = getDrugIngredients;
