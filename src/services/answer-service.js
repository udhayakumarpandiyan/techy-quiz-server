const db = require('../_helpers/db');
const Answer = db.Answer;

module.exports = {
    getAnswerByQuizId,
    create,
    update,
    delete: _delete
};

async function getAnswerByQuizId(quizId) {
    const record = await Answer.findOne({ id: quizId });
    return record || {};

}
async function create(answerParam) {
    const answer = new Answer(answerParam);
    if (answer) {
        await answer.save();
    }
}

async function update(id, answerParam) {
    const answer = await Answer.findById(id);
    if (!answer) throw 'Quiz answer not found';
    Object.assign(answer, answerParam);
    await answer.save();
}

async function _delete(id) {
    await Answer.findByIdAndRemove(id);
}