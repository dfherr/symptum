// module dependencies
const { validationResult } = require('express-validator/check');

// custom dependencies
const logger = require('../../logger');

/**
 * Module to centrally handle all input validations.
 */
module.exports = class Validations {
    /**
   * Handle the validation result and fail requests that comes up with validation errors.
   *
   * @param {object} req
   * @param {object} res
   * @param {object} next
   */
    static handleErrors(req, res, next) {
    // finds the validation errors in this request and wraps them in an object
        const errors = validationResult(req);

        // check if errors occurred
        if (!errors.isEmpty()) {
            // if validation fails, always log the first occurring error
            const firstError = errors.array()[0];
            logger.error(`${firstError.location}: ${firstError.msg}`);

            // return error response
            return res.status(422).send({
                success: false,
                message: firstError.msg,
                status: 422,
            });
        }

        // if validation was successful
        return next();
    }

    // ######## VALDATION SCHEMATA ########
    /**
   * Returns a schema to validate the input of a POST /signup request.
   */
    static signup() {
        return {
            email: {
                in: ['body'],
                errorMessage: '<No email or not parseable to email>',
                isEmail: true,
                exists: true,
            },
            password: {
                in: ['body'],
                errorMessage: '<No password or not parseable to string>',
                isString: true,
                exists: true,
            },
            firstName: {
                in: ['body'],
                errorMessage: '<No firstName or not parseable to string>',
                isString: true,
                escape: true,
                exists: true,
            },
            lastName: {
                in: ['body'],
                errorMessage: '<No lastName or not parseable to string>',
                isString: true,
                escape: true,
                exists: true,
            },
            type: {
                in: ['body'],
                errorMessage:
          "<No type or not parseable to enum['doctor', 'marketer']>",
                matches: {
                    options: [/\b(?:doctor|marketer)\b/],
                },
                isString: true,
                escape: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a POST /login request.
   */
    static login() {
        return {
            email: {
                in: ['body'],
                errorMessage: '<No email or not parseable to email>',
                isEmail: true,
                exists: true,
            },
            password: {
                in: ['body'],
                errorMessage: '<No password or not parseable to string>',
                isString: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a GET /profile request.
   */
    static getUserProfile() {
        return {
            id: {
                in: ['query'],
                errorMessage: '<No userId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a GET /patients OR DELETE /patients request.
   */
    static getOrDeletePatient() {
        return {
            insuranceNumber: {
                in: ['query'],
                errorMessage: '<No insurance number or not parseable to integer>',
                isString: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a PUT /patients request.
   */
    static updatePatient() {
        return {
            patientId: {
                in: ['params'],
                errorMessage: '<No patientId or not parseable to integer>',
                isInt: true,
                exists: true,
            },

            // the new patient values:
            name: {
                in: ['body'],
                errorMessage: '<No name or not parseable to string>',
                isString: true,
                exists: true,
            },
            insuranceName: {
                in: ['body'],
                errorMessage: '<No insuranceName or not parseable to string>',
                isString: true,
                exists: true,
            },
            insuranceNumber: {
                in: ['body'],
                errorMessage: '<No insuranceNumber or not parseable to string>',
                isString: true,
                exists: true,
            },
            gender: {
                in: ['body'],
                errorMessage:
          "<No gender or not parseable to enum['male', 'female', 'diverse']>",
                isString: true,
                matches: {
                    options: [/\b(?:male|female|diverse)\b/],
                },
                exists: true,
            },
            age: {
                in: ['body'],
                errorMessage: '<No age or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a POST /patients request.
   */
    static addPatient() {
        return {
            name: {
                in: ['body'],
                errorMessage: '<No name or not parseable to string>',
                isString: true,
                exists: true,
            },
            insuranceName: {
                in: ['body'],
                errorMessage: '<No insuranceName or not parseable to string>',
                isString: true,
                exists: true,
            },
            insuranceNumber: {
                in: ['body'],
                errorMessage: '<No insuranceNumber or not parseable to string>',
                isString: true,
                exists: true,
            },
            gender: {
                in: ['body'],
                errorMessage:
          "<No gender or not parseable to enum['male', 'female', 'diverse']>",
                isString: true,
                matches: {
                    options: [/\b(?:male|female|diverse)\b/],
                },
                exists: true,
            },
            age: {
                in: ['body'],
                errorMessage: '<No age or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a POST /:patientId/diseases request.
   */
    static addDiseaseHistory() {
        return {
            diseasehistory: {
                in: ['body'],
                errorMessage: '<No diseasehistory or not parseable to array[object]>',
                // isArray: true,
                exists: true,
            },
            patientId: {
                in: ['params'],
                errorMessage: '<No patientId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
            // whens: {
            //     in: ['body'],
            //     errorMessage: '<whens not parseable to array[date]>',
            //     isArray: true,
            //     exists: true,
            // },
            // actives: {
            //     in: ['body'],
            //     errorMessage: '<actives not parseable to array[boolean]>',
            //     isArray: true,
            //     exists: true,
            // },
        };
    }

    /**
   * Returns a schema to validate the input of a GET /:patientId/diseases request.
   */
    static getDiseaseHistory() {
        return {
            patientId: {
                in: ['params'],
                errorMessage: '<No patientId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }

    static deleteDiseaseHistory() {
        return {
            patientId: {
                in: ['params'],
                errorMessage: '<No patientId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a POST /drugs request.
   */
    static addDrug() {
        return {
            name: {
                in: ['body'],
                errorMessage: '<No name or not parseable to string>',
                isString: true,
                exists: true,
            },
            // NOTE: images can at this point not be validated via express-validator
            //
            // picture: {
            //     in: ['body'],
            //     errorMessage: '<No picture or not parseable to BLOB>',
            //     // isString: true,
            //     exists: true,
            // },
            dosage: {
                in: ['body'],
                errorMessage: '<No dosage or not parseable to string>',
                isString: true,
                exists: true,
            },
            price: {
                in: ['body'],
                errorMessage: '<No price or not parseable to string>',
                isString: true,
                exists: true,
            },
            // to determine the diseases it treats
            diseaseIds: {
                in: ['body'],
                errorMessage: '<No diseaseIds or not parseable to array[int]>',
                isString: true,
                exists: true,
            },
            // to determine the drug ingredients
            drugIngredients: {
                in: ['body'],
                errorMessage: '<No drugIngredients or not parseable to array[{name: String, concentration: String}]>',
                isString: true,
                exists: true,
            },
        };
    }


    /**
   * Returns a schema to validate the input of a POST /:patientId/symptoms request.
   */
    static addSymptoms() {
        return {
            patientId: {
                in: ['params'],
                errorMessage: '<No patientId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
            symptomIds: {
                in: ['body'],
                errorMessage: '<No symptomIds or not parseable to array[int]>',
                isArray: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a GET /drugs request.
   */
    static getDrug() {
        return {
            drugId: {
                in: ['params'],
                errorMessage: '<No drugId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }

    /**
    * Returns a schema to validate the input of a GET /drugs request.
    */
    static getDrugPicture() {
        return {
            drugId: {
                in: ['params'],
                errorMessage: '<No drugId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a GET /for-disease/:diseaseId request.
   */
    static getDrugsForDisease() {
        return {
            diseaseId: {
                in: ['params'],
                errorMessage: '<No diseaseId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a POST /campaign request.
   */
    static startAdCampaign() {
        return {
            price: {
                in: ['body'],
                errorMessage: '<No price or not parseable to string>',
                isString: true,
                exists: true,
            },
            from: {
                in: ['body'],
                errorMessage: '<No from or not parseable to date>',
                isDate: true,
                exists: true,
            },
            to: {
                in: ['body'],
                errorMessage: '<No to or not parseable to date>',
                isDate: true,
                exists: true,
            },
            drugId: {
                in: ['body'],
                errorMessage: '<No drugId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }

    /**
   * Returns a schema to validate the input of a GET /campaign/:campaignId request.
   */
    static getAdCampaign() {
        return {
            campaignId: {
                in: ['params'],
                errorMessage: '<No campaignId or not parseable to integer>',
                isInt: true,
                exists: true,
            },
        };
    }
};
