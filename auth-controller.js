module.exports = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.send(401).status("Please Login to access this page");
  }
};
