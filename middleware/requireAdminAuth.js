const requireAdminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "You must login" });
  } else if (!req.user.auth) {
    return res.status(401).send({ error: "You do not have admin privileges"})
  }
  next();
}
module.exports = requireAdminAuth;
