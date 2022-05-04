const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const postSchema = new mongoose.Schema({
      posted_by: {
        type: Schema.Types.ObjectId, ref: 'user' 
      }, 
      post_url: { type: String },
      post_caption: { type: String },
      like:[
        {
          type: Schema.Types.ObjectId, ref: 'user' 
        }
      ],
      dislike:[
        {
          type: Schema.Types.ObjectId, ref: 'user' 
        }
      ],
      comment:[{}],
      // report:[{
      //   type: Schema.Types.ObjectId, ref: 'user' 
      // }]
})  

module.exports = mongoose.model('post', postSchema);
