import { Schema } from 'mongoose';

const storySchema = new Schema({
  role: {
    type: Schema.Types.ObjectId,
    ref: 'role',
    default: null
  },
  desire: {
    type: String,
    required: true
  },
  benefit: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: null
  }
},
{
  timestamps: { createdAt: '_createdAt', updatedAt: '_updatedAt' }
});

// storySchema.index({ desire: 1, benefit: 1}, { unique: true });

module.exports = storySchema;
