const { default: mongoose } = require('mongoose');
let User = require('../models/user.model');
let Post = require('../models/post.model');
module.exports.getAll = async () => {
  try {
    return await User.find();
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports.getSpecificUser = async (user_id) => {
  try {
    return await User.findById(user_id);
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports.updateUser = async (id, updateObj) => {
  try {
    await User.findByIdAndUpdate(id, updateObj);
    return { status: 200 };
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports.sendRequest = async (loginUserId, friendId) => {
  try {
    const myUser = await User.findById(loginUserId);
    const friendUser = await User.findById(friendId);

    if (myUser.friends.mySentRequests.includes(friendId))
      throw new Error('Request is Pending');

    if (myUser.friends.myFriends.includes(friendId))
      throw new Error('Already in your Friend list');

    myUser.friends.mySentRequests.push(friendUser._id);
    friendUser.friends.myFriendRequests.push(myUser._id);

    await friendUser.save();
    await myUser.save();

    return { status: 200, message: 'Friend request sent' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports.confirmRequest = async (loginUserId, friendId) => {
  try {
    const myUser = await User.findById(loginUserId);
    const friendUser = await User.findById(friendId);

    if (myUser.friends.myFriends.includes(friendId))
      throw new Error('Already added to your Friend list');

    myUser.friends.myFriendRequests.pull(friendUser._id);
    friendUser.friends.mySentRequests.pull(myUser._id);

    //   add to friend array
    myUser.friends.myFriends.push(friendUser._id);
    friendUser.friends.myFriends.push(myUser._id);

    await myUser.save();
    await friendUser.save();

    return { status: 200, message: 'Request Confirmed' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports.deleteOrCancelRequest = async (loginUserId, friendId) => {
  try {
    const myUser = await User.findById(loginUserId);
    const friendUser = await User.findById(friendId);

    //   remove from requests array
    myUser.friends.mySentRequests.pull(friendUser._id);
    myUser.friends.myFriendRequests.pull(friendUser._id);
    myUser.friends.myFriends.pull(friendUser._id);
    friendUser.friends.myFriends.pull(myUser._id);
    friendUser.friends.myFriendRequests.pull(myUser._id);
    friendUser.friends.mySentRequests.pull(myUser._id);

    await friendUser.save();
    await myUser.save();

    return { status: 200, message: 'friend request cancelled' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports.suggestUsers = async (uid) => {
  try {
    const myUser = await User.findById(uid);

    const ignoreFriendId = [
      uid,
      ...myUser.friends.myFriends,
      ...myUser.friends.mySentRequests,
      ...myUser.friends.myFriendRequests,
    ];

    return await User.find({ _id: { $nin: ignoreFriendId } });
  } catch (error) {
    return { status: 400, message: error.message };
  }
};
