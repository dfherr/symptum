const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const DbHandler = require('../DbHandler');
const logger = require('../../../logger');


class ImportData {
    constructor() {
        this.t = null;

        return {
            t: this.t,
            importSymptoms: this.importSymptoms,
            importDiseases: this.importDiseases,
        };
    }

    /**
    * Import symptoms from csv
    */
    importSymptoms() {
        return new Promise((outerResolve, outerReject) => {
            const dbHandler = new DbHandler();
            dbHandler.findOne('symptoms', {})
                .then(symptom => new Promise((resolve, reject) => {
                    if (symptom != null) {
                        reject('Symptoms already imported');
                    } else {
                        resolve();
                    }
                }))
                .then(() => new Promise((resolve, reject) => {
                    logger.info('Importing symptoms from csv...');
                    const csvPath = path.join(__dirname, '..', '..', '..', 'misc', 'import_data', 'icd10-codes.csv');
                    const symptoms = [];
                    logger.info('Parsing csv file...');
                    const readStream = fs.createReadStream(csvPath);
                    readStream.pipe(csv(['code', 'name']))
                        .on('data', (row) => {
                            symptoms.push({
                                name: row.name,
                                icd10: row.code,
                            });
                        })
                        .on('end', () => {
                            logger.info('CSV file parsed successfully...');
                            // use Promise to asynchrounously insert symptoms in batches to the db
                            const batchCreate = counter => new Promise((resolveInner, rejectInner) => {
                                const symptomBatch = [];
                                while (counter < symptoms.length) {
                                    symptomBatch.push(symptoms[counter]);
                                    counter += 1;
                                    if (counter % 500 === 0) {
                                        break;
                                    }
                                }
                                logger.info('Adding batch of symptoms to database...');
                                dbHandler.bulkCreate('symptoms', symptomBatch)
                                    .then(() => {
                                        if (counter < symptoms.length) {
                                            resolveInner(batchCreate(counter));
                                        } else {
                                            resolveInner();
                                        }
                                    })
                                    .catch(err => rejectInner(err));
                            });
                            resolve(batchCreate(0));
                        });
                }))
                .then(() => {
                    logger.info('Symptom import completed successfully.');
                    outerResolve();
                })
                .catch((err) => {
                    if (err !== 'Symptoms already imported') {
                        logger.error(err);
                        outerReject(err);
                    }
                });
        });
    }

    /**
    * Import diseases from json
    */
    importDiseases() {
        return new Promise((outerResolve, outerReject) => {
            const dbHandler = new DbHandler();
            dbHandler.findOne('diseases', {})
                .then(symptom => new Promise((resolve, reject) => {
                    if (symptom != null) {
                        reject('Diseases already imported');
                    } else {
                        resolve();
                    }
                }))
                .then(() => new Promise((resolve, reject) => {
                    logger.info('Importing diseases from json...');
                    const jsonPath = path.join(__dirname, '..', '..', '..', 'misc', 'import_data', 'diseases.json');

                    logger.info('Parsing json...');
                    const rawJson = fs.readFileSync(jsonPath);
                    const diseases = JSON.parse(rawJson);

                    logger.info('JSON file parsed successfully...');
                    // use Promise to asynchrounously insert disease in batches to the db
                    const batchCreate = counter => new Promise((resolveInner, rejectInner) => {
                        const diseasesBatch = [];
                        while (counter < diseases.length) {
                            diseasesBatch.push(diseases[counter]);
                            counter += 1;
                            if (counter % 500 === 0) {
                                break;
                            }
                        }
                        logger.info('Adding batch of diseases to database...');
                        dbHandler.bulkCreate('diseases', diseasesBatch)
                            .then(() => {
                                if (counter < diseases.length) {
                                    resolveInner(batchCreate(counter));
                                } else {
                                    resolveInner();
                                }
                            })
                            .catch(err => rejectInner(err));
                    });
                    resolve(batchCreate(0));
                }))
                .then(() => {
                    logger.info('Disease import completed successfully.');
                    outerResolve();
                })
                .catch((err) => {
                    if (err !== 'Diseases already imported') {
                        logger.error(err);
                        outerReject(err);
                    }
                });
        });
    }
}

module.exports = new ImportData();
