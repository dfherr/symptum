// module dependencies
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UniqueConstraintError } = require('sequelize');

// custom dependencies
const logger = require('../../logger');
const DbHandler = require('./../database/DbHandler');

/**
 * Log a user in.
 *
 * @param {object} req
 * @param {object} res
 */
function login(req, res) {
    // authenticate via passport middleware
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: info.message,
                err,
            });
        }

        req.login(user, { session: false }, (error) => {
            if (error) {
                res.status(400).send({
                    success: false,
                    status: 400,
                    message: error,
                });
            }
            // generate a signed json web token with the contents of user object and return it in the response
            const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: 86400 }); // expires in 24 hours
            return res.json({
                success: true, message: info.message, token, userId: user.id,
            });
        });
    })(req, res);
}

exports.login = login;

/**
 * Sign a user up.
 *
 * @param {object} req
 * @param {object} res
 */
function signup(req, res) {
    logger.verbose('Signup user functionality triggered');

    const user = req.body;
    const dbHandler = new DbHandler();
    logger.info(`POST user: ${user.email}`);

    // hash password & delete plain text password
    user.passwordHash = bcrypt.hashSync(user.password, 12);
    delete user.password;

    // insert the user
    dbHandler.create('users', user)
        // send a response object containing the just created user
        .then(createdUser => res.send({
            success: true,
            message: 'The created user',
            data: createdUser,
            status: 200,
        }))
        // send an error response object
        .catch((err) => {
            if (err.err instanceof UniqueConstraintError
            && err.err.original.constraint === 'users_email_key') {
                err = `Email ${user.email} already exists.`;
            } else {
                logger.error(err);
            }
            return res.status(500).send({
                success: false,
                message: err,
                status: 500,
            });
        });
}

exports.signup = signup;

/**
 * Get user information based on user id.
 *
 * @param {*} req
 * @param {*} res
 */
function getUserProfile(req, res) {
    logger.verbose('Get user functionality triggered');

    const { id } = req.query;
    const dbHandler = new DbHandler();
    logger.info(`GET user data from id: ${id}`);

    // get the user from the database
    dbHandler.findOne('users', { where: { id } })
        // send a response object containing the user's profile
        .then((user) => {
            delete user.dataValues.passwordHash;
            return res.send({
                success: true,
                message: `Found user with id: ${id}`,
                data: user.dataValues,
                status: 200,
            });
        })
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.getUserProfile = getUserProfile;
