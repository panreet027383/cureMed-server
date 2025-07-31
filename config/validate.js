const jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
  console.log("********");

  const full_token = req.headers['authorization'];
  if (!full_token) {
    return res.status(401).json({ status: false, msg: "Token not provided." });
  }

  console.log(full_token);

  const ary = full_token.split(" ");
  const actualToken = ary[1];

  try {
    const TokenValidObj = jwt.verify(actualToken, process.env.SEC_KEY);
    console.log("Verified:", TokenValidObj);

    if (TokenValidObj) {
      req.user = jwt.decode(actualToken); // Or just use TokenValidObj if it contains payload
      console.log("Decoded payload:", req.user);
      
      return next(); // 
    } else {
      return res.status(403).json({ status: false, msg: "Invalid Token" });
    }
  } catch (err) {
    return res.status(403).json({ status: false, msg: err.message });
  }
}

module.exports = { validateToken };
