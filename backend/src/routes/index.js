// module dependencies
const express = require('express');
const passport = require('passport');

// import sub routers
const usersRouter = require('./users-router');
const imagesRouter = require('./images-router');
const patientsRouter = require('./patients-router');
const drugsRouter = require('./drugs-router');
const pharmaRouter = require('./pharma-router');
const diseasesRouter = require('./diseases-router');
const symptomsRouter = require('./symptoms-router');

// init router
const router = express.Router();

// connect sub routers to the main router
router.use('/users', usersRouter);
router.use('/images', imagesRouter);
router.use('/patients', passport.authenticate('jwt', { session: false }), patientsRouter);
router.use('/drugs', passport.authenticate('jwt', { session: false }), drugsRouter);
router.use('/pharma', passport.authenticate('jwt', { session: false }), pharmaRouter);
router.use('/diseases', passport.authenticate('jwt', { session: false }), diseasesRouter);
router.use('/symptoms', passport.authenticate('jwt', { session: false }), symptomsRouter);

// hello world test route
router.get('/', (req, res) => res.send('Hello World'));

module.exports = router;
