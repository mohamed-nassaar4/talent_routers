const connectToDatabase = require('../config/db')
const moment = require('moment')

exports.getTodo = async (req, res) => {
  try {
    const db = await connectToDatabase();
    let todoData = await db.all(`select * from TODO order by created_dttm desc`)
    res.send(todoData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      msg: 'internal server error'
    })
  }
}

exports.todoCreate = async (req, res) => {
  try {

    const db = await connectToDatabase();
    const currentDttm = moment().format('YYYY-MM-DD HH:mm:ss')
    let { todo_content, last_upd_by, user_id } = req.body
    let todoExist = await db.all(`select * from TODO where user_id='${parseInt(user_id)}' order by created_dttm desc limit 10`);
    console.log(todoExist.length)
    if (todoExist.length == 10) {
      console.log('ss')
      let firstEntry = moment(todoExist[9].created_dttm, 'YYYY-MM-DD HH:mm:ss');
      let lastEntry = moment(todoExist[0].created_dttm, 'YYYY-MM-DD HH:mm:ss');
      const differenceInMinutes = lastEntry.diff(firstEntry, 'minutes');
      const delayMinutes = moment(currentDttm, 'YYYY-MM-DD HH:mm:ss').diff(lastEntry, 'minutes');
      console.log(differenceInMinutes, delayMinutes);
      
      if (differenceInMinutes > 15 && delayMinutes <= 3) {
        return res.send({ msg: 'Limit Exceed' })
      }
    }
    //   if (todoExist.length == 0) {
    let todo_id = await db.all(`select todo_id from TODO order by todo_id desc limit 1`);
    todo_id = todo_id.length > 0 ? parseInt(todo_id[0].todo_id + 1) : 1
    await db.run(`INSERT INTO TODO (todo_id,todo_content,created_dttm,last_upd_by,last_upd_dttm,status,user_id) VALUES (?,?,?,?,?,?,?)`, [todo_id, todo_content, currentDttm, last_upd_by, currentDttm, 1, user_id]);

    return res.send({ msg: "Todo Created Successfully" });
    //   } else {
    //     return res.send({ msg: "Todo Number Already Exist" })
    //   }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      msg: 'internal server error'
    })
  }
}

exports.todoUpdate = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const last_upd_dttm = moment().format('YYYY-MM-DD HH:mm:ss')
    let { todo_content, todo_id, last_upd_by } = req.body
    await db.run(`UPDATE  TODO  SET  todo_content = '${todo_content}',last_upd_by='${last_upd_by}',last_upd_dttm = '${last_upd_dttm}' where  todo_id = ${parseInt(todo_id)}`);
    res.send({ msg: "Todo Updated Successfully" });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      msg: 'internal server error'
    })
  }
}

exports.todoDelete = async (req, res) => {
  try {

    const db = await connectToDatabase();
    let { todo_id } = req.body
    await db.run(`DELETE from TODO where todo_id=${parseInt(todo_id)}`);
    return res.send({ msg: "Todo Deleted Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      msg: 'internal server error'
    })
  }
}
