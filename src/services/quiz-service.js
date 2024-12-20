const { default: mongoose } = require('mongoose');
const db = require('../_helpers/db');
const encryptData  = require('../_helpers/encrypt');
const Quiz = db.Quiz;
const Answer = db.Answer;

module.exports = {
    getAll,
    getQuiz,
    create,
    update,
    delete: _delete
};


async function getAll() {
    return await Quiz.find();
}

async function getQuiz(previouslyFetchedIds) {
    const record = await Quiz.findOne({
        id: { $nin: previouslyFetchedIds }
    });
    // if (record) {
    //     const questions = record?.questions.map((question) => {
    //         //return encryptData(question);
    //     })
    //     return questions;
    // }
    return record || {};

}
async function create(quizParam) {
    const quiz = new Quiz(quizParam);
    if (quizParam?.questions) {
        const answers = [];
        quizParam.questions.forEach((question) => {
            question.options.forEach((option) => {
                if (option.isAnswer === true) {
                    answers.push({ id: option.id, order: option.order });
                }
            })
        })
        const answer = new Answer({ quizId: quizParam.id, answers });
        await answer.save();
    }
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