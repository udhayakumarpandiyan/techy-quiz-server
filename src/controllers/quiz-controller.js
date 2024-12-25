const express = require('express');
const router = express.Router();
const quizService = require('../services/quiz-service');

// routes
router.post('/add', add);
router.get('/', getAll);
router.post('/get-quiz', getQuiz);
router.post('/submit-quiz', submitQuiz);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function add(req, res, next) {
    quizService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    quizService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getQuiz(req, res, next) {
    quizService.getQuiz(req.body)
        .then(quiz => quiz ? res.json(quiz) : res.sendStatus(404))
        .catch(err => next(err));
}
function submitQuiz(req, res, next) {
    quizService.submitQuiz(req, res)
        .then(quiz => quiz ? res.json(quiz) : res.sendStatus(404))
        .catch(err => next(err));
}


function update(req, res, next) {
    quizService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    quizService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}