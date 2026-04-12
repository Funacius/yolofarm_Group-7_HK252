const ohstem = require("../config/ohstem.config");

function requireInternalIngestToken(req, res, next) {
  const token = req.get("X-Internal-Token");
  if (!token || token !== ohstem.internalIngestToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

module.exports = { requireInternalIngestToken };
