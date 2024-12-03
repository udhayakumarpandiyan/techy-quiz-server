const config = require('../../config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI || config.connectionString);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user-model'),
    Quiz: require('../models/quiz-model'),
    Answer: require('../models/answer-model')
};