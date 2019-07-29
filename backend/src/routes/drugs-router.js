// module dependencies
const express = require('express');
const { checkSchema } = require('express-validator/check');

// custom dependencies
const drugsLogic = require('../logic/drugs-logic');
const Val = require('../middlewares/Validations');

// init router
const router = express.Router();

// add a drug
router.post('/', checkSchema(Val.addDrug()), Val.handleErrors, drugsLogic.addDrug);

// get all drug ingredients
router.get('/ingredients', drugsLogic.getDrugIngredients);

// get a drug
router.get('/:drugId', checkSchema(Val.getDrug()), Val.handleErrors, drugsLogic.getDrug);

// get all drugs for a certain disease
router.get('/for-disease/:diseaseId', checkSchema(Val.getDrugsForDisease()), Val.handleErrors, drugsLogic.getDrugsForDisease);

module.exports = router;
