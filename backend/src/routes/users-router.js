// module dependencies
const express = require('express');
const { checkSchema } = require('express-validator/check');
const passport = require('passport');

// custom dependencies
const usersLogic = require('../logic/users-logic');
const Val = require('../middlewares/Validations');

// init router
const router = express.Router();

// signup
router.post('/signup', checkSchema(Val.signup()), Val.handleErrors, usersLogic.signup);

// login
router.post('/login', checkSchema(Val.login()), Val.handleErrors, usersLogic.login);

// get user profile (authentication is required)
router.get('/profile', checkSchema(Val.getUserProfile()), Val.handleErrors,
    passport.authenticate('jwt', { session: false }), usersLogic.getUserProfile);

module.exports = router;
