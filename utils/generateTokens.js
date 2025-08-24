const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_KEY,
    { expiresIn: '365d' } // Token will expire in 1 year
  );
};

module.exports.generateToken = generateToken;
