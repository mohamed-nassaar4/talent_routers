const express = require('express');
const router = express.Router();
const { getTodo, todoCreate, todoUpdate, todoDelete } = require('../controller/todo.controller');
const {authenticate}=require('../utils/jwt_token_gen')

router.get('/get_todo',authenticate, getTodo);
router.post('/todo_insert', authenticate,todoCreate)
router.post('/todo_update',authenticate, todoUpdate);
router.post('/todo_delete',authenticate,todoDelete);

module.exports = router;