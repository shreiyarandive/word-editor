const jwt = require('jsonwebtoken');
const { findUserByEmail, findUserByID, createUser, verifyPassword, updateIsVerified } = require('./user.service');

exports.registerUser = async (req, res, next) => {

    let user = null;
    try {
        user = await findUserByEmail(req.body.email);
        console.log('existing user', user)
        if (user != null) {
            res.status(401).json({
                message: 'user already exists'
            });
        } else {
            user = await createUser(req.body);
            res.status(200).json(user);
        }

    } catch (err) {
        res.status(400).json({
            message: 'Something went wrong'
        });
    }

}

exports.verifyAccount = async (req, res, next) => {
    let user = null;
    try {
        jwt.verify(req.body.token, process.env.SECRET);
        user = await findUserByID(req.body.id);
        if (user == null) {
            res.status(400).json({
                message: 'Invalid user ID'
            });
        } else {
            await updateIsVerified(req.body.id);
            res.status(200).json({
                message: 'User Verified'
            });
        }
    } catch (err) {
        res.status(400).json({
            message: 'Token expired'
        });
    }

}
exports.loginUser = async (req, res, next) => {
    let user = null;
    user = await findUserByEmail(req.body.email);
    if (user == null) {
        res.status(400).json({
            message: 'invalid email Id'
        });
    } else {
        const passwordsMatch = await verifyPassword(req.body.password, user[0].password);
        if (passwordsMatch) {
            if (user[0].isVerified)
                res.status(200).json(user);
            else
                res.status(400).json({
                    message: 'Please Verify your account'
                });
        } else {
            res.status(400).json({
                message: 'Invalid Password'
            });
        }
    }
}