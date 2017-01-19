import mongoose from 'mongoose';
import roleSchema from './role';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

// Define our model
const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  },
  roles: [roleSchema],
  owner: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }]
},
{
  timestamps: { createdAt: '_createdAt', updatedAt: '_updatedAt' }
});
projectSchema.plugin(uniqueValidator);

// Create the model class
const ModelClass = mongoose.model('project', projectSchema);

// Export the model
module.exports = ModelClass;
