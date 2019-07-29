// module dependencies
const express = require('express');
const { checkSchema } = require('express-validator/check');

// custom dependencies
const pharmaLogic = require('../logic/pharma-logic');
const Val = require('../middlewares/Validations');

// init router
const router = express.Router();

// post a new advertisement campaign
router.post('/campaign', checkSchema(Val.startAdCampaign()), Val.handleErrors, pharmaLogic.startAdCampaign);

// get an advertisement campaign
router.get('/campaign/:campaignId', checkSchema(Val.getAdCampaign()), Val.handleErrors, pharmaLogic.getAdCampaign);

module.exports = router;
