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
        res.clearCookie('token', {
            httpOnly: true,  // Ensures the cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production',  // Set to true in production to only allow HTTPS requests
            sameSite: 'strict', // Prevents the cookie from being sent with cross-origin requests
            path: '/' // Ensures the correct path is used
        });
        return { message: 'Logout successful' };
    } catch (err) {
        return {
            status: 'error',
            message: 'Internal Server Error',
        };
    }
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}
async function create(userParam) {
    const existingUser = await User.findOne({ email: userParam.email });
    if (existingUser === null) {
        const user = new User(userParam);
        if (userParam.password) {
            user.hash = bcrypt.hashSync(userParam.password, 10);
        }
        await user.save();
    }
    else {
        return { success: false, message: `${userParam.email} already exists , Please try with different email id .`}
    }
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
    console.log("user: ", user, email);
    if (!user) {
        return { success: false, message: 'Email Id not found' };
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
