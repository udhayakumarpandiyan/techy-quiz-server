const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const db = require('../_helpers/db');

const User = db.User;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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
        res?.clearCookie('token'); // If the token is in a cookie
        res?.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        res?.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
    res?.end();
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

async function forgotPassword(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: 'Email not found' };
    }

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: email,
    }
    const token = jwt.sign(data, jwtSecretKey, { expiresIn: '1h' });

    // Send email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: {
            name: "CoderQuiz",
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Password Reset Request',
        text: `Here is your password reset link: ${resetLink}`,
        html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    user.resetToken = token;
    user.tokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return { success: false, message: 'Failed to send email' };
        }
        return { success: true, message: 'Password reset link sent to your email' };
    });
}
async function resetPassword(req, res) {
    const { token, password } = req.body;
    const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });
    if (!user) {
        return { success: false, message: 'Invalid or expired token' };
    }

    user.hash = await bcrypt.hash(password, 10); // Hash the new password
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();
    return { success: true, message: 'Password has been reset successfully' };
}

module.exports = {
    login,
    logout,
    getAll,
    getById,
    create,
    update,
    forgotPassword,
    resetPassword,
    delete: _delete
};
