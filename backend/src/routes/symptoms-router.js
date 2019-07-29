// module dependencies
const express = require('express');

// custom dependencies
const symptomsLogic = require('../logic/symptoms-logic');

// init router
const router = express.Router();

// get all diseases
router.get('/', symptomsLogic.getAllSymptoms);

module.exports = router;
