const mongoose = require('mongoose');
let user = require('../models/user.model');
let post = require('../models/post.model');
let reportData = require('../models/admin.model');

module.exports.allPost = async () => {
  try {
    return await reportData.find();
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports.delReport = async (id, post_uid) => {
  try {
    await reportData.deleteOne({ _id: id });
    await post.deleteOne({ _id: post_uid });

    return { status: 200 };
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports.updatePost = async (id, pic_url, caption) => {
  try {
    await post({
      posted_by: id,
      post_url: pic_url,
      post_caption: caption,
    }).save();

    return { status: 200 };
  } catch (error) {
    return { status: 400, message: error.message };
  }
};
module.exports.getPost = async (ids, page, limit) => {
  try {
    return await post
      .find({
        posted_by: {
          $in: ids,
        },
      })
      .populate({
        path: 'posted_by',
      })
      .sort({
        _id: -1,
      })
      .skip(page * limit)
      .limit(limit);
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports.inclike = async (id, user_id) => {
  try {
    const mypost = await post.findById(id).populate({
      path: 'posted_by',
    });

    mypost.dislike.includes(user_id) && mypost.dislike.pull(user_id);
    mypost.like.includes(user_id)
      ? mypost.like.pull(user_id)
      : mypost.like.push(user_id);

    await mypost.save();
    return mypost;
  } catch (error) {
    console.log(error);
  }
};

module.exports.dislike = async (id, user_id) => {
  try {
    const mypost = await post.findById(id).populate({
      path: 'posted_by',
    });

    mypost.like.includes(user_id) && mypost.like.pull(user_id);

    mypost.dislike.includes(user_id)
      ? mypost.dislike.pull(user_id)
      : mypost.dislike.push(user_id);

    await mypost.save();

    return mypost;
  } catch (error) {
    console.log(error);
  }
};

module.exports.comment = async (id, message, user_id, picture_url) => {
  try {
    const mypost = await post.findById(id).populate({
      path: 'posted_by',
    });
    mypost.comment.push({ user_id, message, picture_url });
    await mypost.save();

    return mypost;
  } catch (error) {
    console.log(error);
  }
};

module.exports.report = async (data, user_id) => {
  try {
    var uid = mongoose.Types.ObjectId(user_id);
    const report_person = await user.findById(user_id);
    const existPost = await reportData.findOne({
      'reported_by._id': uid,
      post_url: data.data.post_url,
      post_caption: data.data.post_caption,
    });
    if (existPost === null) {
      await reportData({
        post_uid: data.data._id,
        post_url: data.data.post_url,
        posted_by: data.data.posted_by,
        post_caption: data.data.post_caption,
        reported_by: report_person,
      }).save();
      return { status: 200 };
    }
    return { status: 200 };
  } catch (error) {
    console.log(error);
  }
};
