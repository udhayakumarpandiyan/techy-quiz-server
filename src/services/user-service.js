﻿const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

const User = db.User;

module.exports = {
    login,
    logout,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function login({ email, password }) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.hash)) {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            userId: email,
        }
        const token = jwt.sign(data, jwtSecretKey);
        return {
            ...user.toJSON(),
            token
        };
    }
    else {
        return 'Authentitcation Failed';
    }
}
async function logout(req, res) {
    try {
        const authHeader = req.headers['cookie']; // get the session cookie from request header
        if (!authHeader) return res.sendStatus(204); // No content
        const cookie = authHeader.split('=')[1]; // If there is, split the cookie string to get the actual jwt token
        const accessToken = cookie.split(';')[0];
        // const checkIfBlacklisted = await blacklistModel.findOne({ token: accessToken }); // Check if that token is blacklisted
        // // if true, send a no content response.
        // if (checkIfBlacklisted) return res.sendStatus(204);
        // // otherwise blacklist token
        // const newBlacklist = new Blacklist({
        //     token: accessToken,
        // });
        // await newBlacklist.save();
        // Also clear request cookie on client
        res.setHeader('Clear-Site-Data', '"cookies"');
        res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
    res.end();
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}
async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }
    const user = new User(userParam);
    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);
    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // copy userParam properties to user
    Object.assign(user, userParam);
    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}