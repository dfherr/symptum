// module dependencies
const express = require('express');
const { checkSchema } = require('express-validator/check');

// custom dependencies
const drugsLogic = require('../logic/drugs-logic');
const Val = require('../middlewares/Validations');

// init router
const router = express.Router();

// get image of a drug
router.get('/drug/:drugId', checkSchema(Val.getDrugPicture()), Val.handleErrors, drugsLogic.getDrugPicture);


module.exports = router;
