module.exports = (req, res, next) => {
  if (req.session.user) {
    console.log(req.session.user);
    next();
  } else {
    console.log(req.session);
    res.status(401).json("Please Login to access this page");
  }
};
