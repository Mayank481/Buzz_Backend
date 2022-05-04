module.exports = (req, res, next) => {
  Object.keys(req.body).forEach(
    (key) => typeof req.body[key] === 'undefined' && delete req.body[key]
  );
  next();
};
