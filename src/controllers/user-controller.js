﻿const express = require('express');
const router = express.Router();
const userService = require('../services/user-service');

// routes
router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;

function login(req, res, next) {
    userService.login(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}
function logout(req, res, next) {
    userService.logout()
        .then(() => res.json({}))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then((response) => response ? res.json(response) : res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
function forgotPassword(req, res, next) {
    userService.forgotPassword(req, res)
        .then((response) => response ? res.json(response) : res.json({}))
        .catch(err => next(err));
}
function resetPassword(req, res, next) {
    userService.resetPassword(req, res)
        .then(() => res.json({}))
        .catch(err => next(err));
}