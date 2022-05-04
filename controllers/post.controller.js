const post = require('../services/post.service');

module.exports.allPost = async (req, res) => {
  const result = await post.allPost();
  res.send(result);
};
module.exports.delReport = async (req, res) => {
  const user_id = req.body.id;
  const post_uid = req.body.post_uid;

  const result = await post.delReport(user_id, post_uid);

  res.sendStatus(result.status);
};

module.exports.updatePost = async (req, res) => {
  const { pic_url, caption, user_id } = req.body;
  const result = await post.updatePost(user_id, pic_url, caption);
  res.sendStatus(result.status);
};

module.exports.getPost = async (req, res) => {
  let page = parseInt(req.query.page) || 0;
  let limit = parseInt(req.query.limit) || 10;

  const result = await post.getPost(
    [req.user.id, ...req.user.friends.myFriends],
    page,
    limit
  );
  res.send(result);
};

module.exports.like = async (req, res) => {
  const result = await post.inclike(req.body.post_id, req.user.id);
  res.send(result);
};

module.exports.unlike = async (req, res) => {
  const result = await post.dislike(req.body.post_id, req.user.id);
  res.send(result);
};

module.exports.comment = async (req, res) => {
  const result = await post.comment(
    req.body.post_id,
    req.body.comment.message,
    req.user.id,
    req.user.picture_url
  );
  res.send(result);
};

module.exports.report = async (req, res) => {
  const result = await post.report(req.body, req.user.id);
  res.sendStatus(result.status);
};
