const pool = require("../config/config");
const bcrypt = require("bcrypt");

async function verifyUser(loginCredential) {
  let usr_email = loginCredential.username.trim();
  let usr_pass = loginCredential.password.trim();
  try {
    let user = await pool.query(
      `select * from sch_mstr.usr_mstr where usr_email='${usr_email}' and sts_flg='1'`
    );
    let oemail = user.rows[0];
    if (user.rowCount == 0) {
      return "user not found";
    } else if (user.rowCount > 0) {
     
      let isMatch;

      isMatch = await bcrypt.compare(usr_pass, oemail.usr_pass);
      if (!isMatch) return "invalid password";

      let obj = {
        usr_email: usr_email,
        user_id: user.rows[0].usr_id,
        name: user.rows[0].usr_first_name + " " + user.rows[0].usr_last_name,
        role: user.rows[0].role_id,
      };
      return obj;
    } else {
      return "unprocessable entity";
    }
  } catch (e) {
    console.log(e);
    return {
      error: e.message,
      msg: "internal server error",
    };
  }
}

module.exports = { verifyUser };
