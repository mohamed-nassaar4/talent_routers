const express = require('express');
const router = express.Router();
const { getTodo, todoCreate, todoUpdate, todoDelete } = require('../controller/todo.controller');

router.get('/get_todo', getTodo);
router.post('/todo_insert', todoCreate)
router.post('/todo_update', todoUpdate);
router.post('/todo_delete',todoDelete);

module.exports = router;