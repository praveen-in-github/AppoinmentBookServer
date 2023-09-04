module.exports = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.sendStatus(401).status("Please Login to access this page");
  }
};
