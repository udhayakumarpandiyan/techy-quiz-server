const express = require('express');
const router = express.Router();
const quizService = require('../services/quiz-service');

// routes
router.post('/add', add);
router.get('/', getAll);
router.get('/:id', getQuizById);
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

function getQuizById(req, res, next) {
    quizService.getQuizById(req.params.id)
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