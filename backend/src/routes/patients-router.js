// module dependencies
const express = require('express');
const { checkSchema } = require('express-validator/check');

// custom dependencies
const patientsLogic = require('../logic/patients-logic');
const Val = require('../middlewares/Validations');

// init router
const router = express.Router();

// get a patient (?insuranceNumber=5))
router.get('/', checkSchema(Val.getOrDeletePatient()), Val.handleErrors, patientsLogic.getPatient);

// update a patient
router.put('/:patientId', checkSchema(Val.updatePatient()), Val.handleErrors, patientsLogic.updatePatient);

// delete a patient (?insuranceNumber=5)
router.delete('/', checkSchema(Val.getOrDeletePatient()), Val.handleErrors, patientsLogic.deletePatient);

// post a new patient
router.post('/', checkSchema(Val.addPatient()), Val.handleErrors, patientsLogic.addPatient);

// post patient's disease history
router.post('/:patientId/diseases', checkSchema(Val.addDiseaseHistory()), Val.handleErrors, patientsLogic.addDiseaseHistory);

// get patient's disease history
router.get('/:patientId/diseases', checkSchema(Val.getDiseaseHistory()), Val.handleErrors, patientsLogic.getDiseaseHistory);

router.delete('/:patientId/diseases', checkSchema(Val.deleteDiseaseHistory()), Val.handleErrors, patientsLogic.deleteDiseaseHistory);

// post a patient's symptoms
router.post('/:patientId/symptoms', checkSchema(Val.addSymptoms()), Val.handleErrors, patientsLogic.addSymptoms);

module.exports = router;
