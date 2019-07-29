// module dependencies
const express = require('express');

// custom dependencies
const diseasesLogic = require('../logic/diseases-logic');

// init router
const router = express.Router();

// get all diseases
router.get('/', diseasesLogic.getAllDiseases);

module.exports = router;
