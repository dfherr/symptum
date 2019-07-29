// module dependencies
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const fileUpload = require('express-fileupload');

// custom modules
const config = require('./config');
const logger = require('./logger');
const database = require('./src/database');
const bootstrapDb = require('./src/database/bootstrap/importData');
const initPassport = require('./src/middlewares/auth');

// main router
const mainRouter = require('./src/routes');

// init the server
const app = express();

// allow CORS
app.use(cors());

// init passport
initPassport();
app.use(passport.initialize());
app.use(passport.session());

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// parse incoming requests containing files
app.use(fileUpload());

// connect routers to the app
app.use(config.webserver.baseUrl, mainRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in dev
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'dev' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

// this shall print a warning since connection timeouts are not handled too well by Sequelize.
// Thus, debugging a non-establishable database connection can be detected easier
logger.warn('Try establishing a connection to the database... ');
// testing connection to database
database.authenticate()
    .then(() => {
        // if authenticated has been successful
        logger.info('... Successfully connected to database');

        // sync database models (if not synced yet)
        database.sync({ force: false })
            .then(() => logger.info('Sequelize models have been synced'))
            .catch(err => logger.error(`An error happened while trying to sync Sequelize models: ${err}`))
            .then(() => bootstrapDb.importSymptoms())
            .then(() => bootstrapDb.importDiseases())
            .catch(err => logger.error(`An error happened while trying to bootstrap database: ${err}`));


        app.emit('started');
    })
    .catch((err) => {
        logger.error(`Unable to connect to the database due to error: ${err}`);
    });

module.exports = app;
