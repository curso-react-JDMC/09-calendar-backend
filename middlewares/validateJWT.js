const { response, request } = require("express");
var jwt = require("jsonwebtoken");

const validateJwt = async (req = request, res = response, next) => {
  //Headers x-token
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "There is no token in the request",
    });
  }

  try {
    jwt.verify(token, process.env.SECRET_JWT_SEED, (err, data) => {
      if (err) {
        throw err;
      }
      const { uid, name } = data;
      req.uid = uid;
      req.name = name;
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Token not valid",
      err,
    });
  }

  next();
};

module.exports = validateJwt;
