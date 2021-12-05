const jwt = require("jsonwebtoken");
const secret = "RahasiaDong!=112";

function generateToken(payload) {
  return jwt.sign(payload, secret, {expiresIn: 86400000});
}

function verifytoken(token, callback) {
  return jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, decoded);
    }
  });
}

module.exports = {
  generateToken,
  verifytoken,
};
