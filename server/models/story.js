import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const storySchema = new Schema({
  desire: {
    type: String,
    required: true
  },
  benefit: {
    type: String,
    required: true
  },
  author: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }]
},
{
  timestamps: { createdAt: '_createdAt', updatedAt: '_updatedAt' }
});
module.exports = storySchema;
