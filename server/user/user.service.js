const User = require('./user.model');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

exports.findUserByEmail = async (email) => {
    const user = await User.find({ email: email });

    if (user.length >= 1) return user;

    return null;
}

exports.findUserByID = async (id) => {
    const user = await User.findById(id);
    console.log('user222', user)

    return user;
}
exports.createUser = async (body) => {

    try {

        const hashedPassword = await encryptPassword(body.password);

        const user = await createUserObject(body.name, body.email, hashedPassword);

        const token = await createToken(body.email, user._id);

        sendMail(body.email, user._id, token);

        return user;


    } catch (error) {
        console.log('error', error);
    }
}

encryptPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}
createUserObject = async (name, email, password) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        email: email,
        password: password,
        isVerified: false,
        documents: []
    });

    await user.save();
    return user;
}

createToken = async (email, id) => {

    const token = jwt.sign({
        email: email,
        id: id
    },
        process.env.SECRET,
        {
            expiresIn: "1h"
        });
    return token;
}

sendMail = async (email, id, token) => {


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASS
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_ID,
        to: process.env.EMAIL_ID,
        subject: 'Verification mail',
        text: `Click on this link to verify
                http://localhost:4200/login/${token}/${id}`
    }
    await transporter.sendMail(mailOptions);
}

exports.updateIsVerified = async (id) => {

    await User.findByIdAndUpdate(id, {
        $set: {
            isVerified: true
        }
    });
}
exports.verifyPassword = async (password, hashedPassword) => {

    try {
        const isValid = await bcrypt.compare(password, hashedPassword);
        return isValid;
    } catch (err) {
        return null;
    }
}
