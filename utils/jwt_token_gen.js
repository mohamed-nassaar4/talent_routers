const jwt = require("jsonwebtoken");
const jwt_secret_key = "TALENT";

async function genAccessToken(userProfile) {
  let token = jwt.sign(userProfile, jwt_secret_key, {
    expiresIn: "5m",
  });
  return token;
}
async function genRefreshToken(userProfile) {
  let token = jwt.sign(userProfile, jwt_secret_key, {
    expiresIn: "1d",
  });
  return token;
}

async function verifyToken(req, res, next) {
  try {
    console.log(req.headers['authorization'], 'Authorization Header');
    console.log(req.cookies, 'Cookies');

    if (!req.headers['authorization']) {
      return res.status(401).json({ msg: 'Unauthorized user: Missing authorization header' });
    }

    const accessToken = req.headers['authorization'].replace(/Bearer /g, "");
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ msg: 'Access Denied. No token provided.' });
    }

    if (!refreshToken) {
      return res.status(401).json({ msg: 'Access Denied. No refresh token provided.' });
    }

    jwt.verify(accessToken, jwt_secret_key, (err, decoded) => {
      //  if (err) {
      //   console.error(err);
      //   return res.status(401).json({ msg: "Unauthorized" });
      // }

      console.log(decoded, "Decoded Token");
      const newAccessToken = jwt.sign({ user: decoded }, jwt_secret_key, { expiresIn: '5m' });

      res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .header('authorization', newAccessToken);

      next();
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
module.exports = { genAccessToken: genAccessToken,genRefreshToken:genRefreshToken, authenticate: verifyToken };
