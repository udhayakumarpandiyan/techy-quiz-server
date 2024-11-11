const db = require('../_helpers/db');
const Quiz = db.Quiz;

module.exports = {
    getAll,
    getQuizById,
    create,
    update,
    delete: _delete
};


async function getAll() {
    return await Quiz.find();
}

async function getQuizById(id) {
    return await Quiz.findById(id);
}
async function create(quizParam) {
    // validate
    const quiz = new Quiz(quizParam);
    // save user
    await quiz.save();
}

async function update(id, quizParam) {
    const quiz = await Quiz.findById(id);
    // validate
    if (!quiz) throw 'Quiz not found';
    // copy userParam properties to user
    Object.assign(quiz, quizParam);
    await quiz.save();
}

async function _delete(id) {
    await Quiz.findByIdAndRemove(id);
}