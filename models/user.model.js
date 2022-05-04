const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  designation: String,
  provider: String,
  picture_url: String,    
  cover_url: String,
  bio: String,
  gender: String,
  website: String,
  birthday: String,
  city: String,
  state: String,
  zip: Number,
  moderator: { type: Boolean, default: false },
  friends: {
    myFriends: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    mySentRequests: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    myFriendRequests: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  },
});

module.exports = mongoose.model('user', userSchema);
