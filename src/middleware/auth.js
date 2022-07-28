const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization', 'Bearer Token')

    if (!token) {
      return res
        .status(403)
        .send({
          status: false,
          message: 'Missing required token in request',
        });
    }

    let validToken = token.split(' ')  

    const decodeToken = jwt.verify(validToken[1], "group9")
    
    if (!decodeToken) {
      return res
        .status(403)
        .send({
          status: false,
          message: 'Invalid token',
        });
    }

    req.userId = decodeToken.userId

    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

module.exports.userAuth = userAuth;
