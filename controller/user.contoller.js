const fs = require('fs');
const moment = require('moment');
const path = require('path');
const connectToDatabase = require('../config/db');
const {genAccessToken,genRefreshToken}=require('../utils/jwt_token_gen');
const { use } = require('../router/user.routes');

exports.getUser = async (req, res) => {
  try {
    const db = await connectToDatabase();
    let userData = await db.all(`select * from USER_LOGIN order by id desc`)
   return res.send(userData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      msg: 'internal server error'
    })
  }
}

exports.userLogin = async (req, res) => {
  try {
    const db = await connectToDatabase();
    let { user_name, user_pass } = req.body
    let userExist = await db.all(`select * from USER_LOGIN where user_name='${user_name}' and user_pass='${user_pass}'`);

    if (userExist.length > 0) {
      const user={ msg: "Success", role: userExist[0].role, user_name: user_name }
      const accessToken=await genAccessToken(user);
      const refreshToken = await genRefreshToken(user)

      console.log(accessToken,refreshToken)
      return res
      .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .header('authorization', accessToken)
        .send(user);

    } else {
      return res.send({ msg: "User Not Exist" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      msg: 'internal server error'
    })
  }
}

exports.userRegister = async (req, res) => {
  try {

    const db = await connectToDatabase();
    const last_upd_dttm = moment().format('YYYY-MM-DD HH:mm:ss')
    let { user_name, user_pass, role, last_upd_by } = req.body;
    console.log(req.body)
    let userExist = await db.all(`select * from USER_LOGIN where user_name='${user_name}'`);
    if (userExist.length == 0) {
      let user_id = await db.all(`select id from USER_LOGIN order by id desc limit 1`);
      console.log(user_id);
      user_id = user_id.length > 0 ? parseInt(user_id[0].id + 1) : 1
      await db.run(`INSERT INTO USER_LOGIN (id,user_name, user_pass,role,last_upd_by,last_upd_dttm,created_dttm) VALUES (${parseInt(user_id)},'${user_name}', '${user_pass}','${role}','${last_upd_by}','${last_upd_dttm}','${last_upd_dttm}')`);

      return res.send({ msg: "User Created Successfully" });
    } else {
      return res.send({ msg: "User Already Exist" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      msg: 'internal server error'
    })
  }
}

exports.userUpdate = async (req, res) => {
  try {

    const db = await connectToDatabase();
    const currentDttm = moment().format('YYYY-MM-DD HH:mm:ss')
    let { id, user_pass, role, last_upd_by } = req.body
    console.log(req.body)
    await db.run(
      `UPDATE USER_LOGIN SET user_pass = ?, role = ?,last_upd_by = ?,last_upd_dttm = ? WHERE id = ?`,
      [user_pass, role, last_upd_by, currentDttm, id]
    );

    return res.send({ msg: "User Updated Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      msg: 'internal server error'
    })
  }
}

exports.userDelete = async (req, res) => {
  try {

    const db = await connectToDatabase();
    let { id } = req.body;
    console.log(id)
    await db.run(`DELETE from USER_LOGIN where id=${parseInt(id)}`);
    return res.send({ msg: "User Deleted Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      msg: 'internal server error'
    })
  }
}
