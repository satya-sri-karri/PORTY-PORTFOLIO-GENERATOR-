const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = async (req,res,next) => {
  const header=req.headers.authorization;
  if(!header?.startsWith("Bearer ")) return res.status(401).json({error:"No token. Please login."});
  let decoded;
  try { decoded=jwt.verify(header.split(" ")[1],process.env.JWT_SECRET); }
  catch { return res.status(401).json({error:"Invalid or expired token."}); }
  try {
    const user=await User.findById(decoded.userId).select("+tokenVersion");
    if(!user || (decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) return res.status(401).json({error:"Your session has expired. Sign in again."});
    req.userId=decoded.userId;req.userName=decoded.name;next();
  } catch { res.status(503).json({error:"Your account could not be verified. Please retry shortly."}); }
};
