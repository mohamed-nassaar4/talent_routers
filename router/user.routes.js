const express = require('express');
const router = express.Router();
const {getUser,userDelete,userLogin,userRegister,userUpdate} = require('../controller/user.contoller');
const {authenticate}=require('../utils/jwt_token_gen')

router.get('/get_user', authenticate,getUser);
router.post('/user_login', userLogin)
router.post('/user_insert', userRegister)
router.post('/user_edit',authenticate, userUpdate);
router.post('/user_remove', userDelete);

module.exports = router;