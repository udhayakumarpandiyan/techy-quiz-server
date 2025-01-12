const { default: mongoose } = require('mongoose');
const db = require('../_helpers/db');
const encryptData = require('../_helpers/encrypt');
const { getAnswerByQuizId } = require('./answer-service');
const Quiz = db.Quiz;
const Answer = db.Answer;

module.exports = {
    getAll,
    getQuiz,
    getSampleQuiz,
    submitQuiz,
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
async function getSampleQuiz(param) {
    if (!param.technology) {
        return { error: 'technology parameter is required' };
    }
    const technology = Number(param.technology);

    if (isNaN(technology)) {
        return { error: 'technology must be valid number' };
    }
    const record = await Quiz.findOne({
        technology: technology,
        category: 0
    });
    return record || {};
}
async function submitQuiz(req, res) {
    const { quizId, answers, totalTimeTakenInSeconds } = req.body;
    let quizAnswers = await getAnswerByQuizId(quizId);
    let correctAnswers = 0;
    if (quizAnswers && answers) {
        for (let i = 0; i < quizAnswers.length; i++) {
            for (let j = 0; j < answers.length; j++) {
                if (quizAnswers[i].id === answers[j].id) {
                    correctAnswers++;
                }
            }
        }
        let bonus = (((10 * 60) - totalTimeTakenInSeconds) / 2 / 60).toFixed(2);
        const result = {
            actualScore: (correctAnswers * 10) + Number(bonus),
            bonusPoints: bonus,
            result: correctAnswers > 8 ? 1 : correctAnswers > 6 ? 2 : correctAnswers > 4 ? 3 : 4,
            timeTaken: totalTimeTakenInSeconds,
        }
        return result;
    }

    return {};

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