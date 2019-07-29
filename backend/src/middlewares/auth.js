// module dependencies
const passport = require('passport');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

// custom dependencies
const DbHandler = require('../database/DbHandler');

// jwt
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

/**
 * Init passport and setup configuration.
 */
module.exports = function initPassport() {
    const dbHandler = new DbHandler();

    // login with username and passport
    passport.use(new LocalStrategy(
        {
            // by default, local strategy uses email and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true, // allows us to pass back the entire request to the callback
        },
        ((req, email, password, done) => {
            // password validator
            const isValidPassword = function validatePw(userDbPw, pw) {
                return bcrypt.compareSync(pw, userDbPw);
            };

            // try finding the user in the database
            dbHandler.findOne('users', { where: { email } })
                .then((user) => {
                    if (!user) {
                        // return req.res.status(401).send({ success: false, message: 'Incorrect email', status: 401 });
                        return done(null, false, { message: 'Incorrect email.' });
                    }
                    if (!isValidPassword(user.passwordHash, password)) {
                        // return req.res.status(401).send({ success: false, message: 'Incorrect pw', status: 401 });
                        return done(null, false, { message: 'Incorrect password.' });
                    }

                    return done(null, user.dataValues, { message: 'Authentication successful' });
                    // return req.res.send({
                    // success: true, message: 'Authentication successful', status: 200, token: req.sessionID,
                    // });
                })
                // .catch(error => done(error));
                .catch(err => req.res.status(500).send({
                    success: false,
                    message: err,
                    status: 500,
                }));
        }),
    ));

    // authentication with token
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret',
        passReqToCallback: true,
    },
    ((req, jwtPayload, cb) => {
        // check if the provided id matches
        dbHandler.findOne('users', { where: { id: jwtPayload.id } })
            .then(user => cb(null, user))
            .catch(err => cb(err));
    })));
};
