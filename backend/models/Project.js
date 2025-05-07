const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true, // will be the Cloudinary URL or pasted image URL
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    tags: {
      type: [String],
      default: [],
    },
    url: {
      type: String,
      default: '',
    },
    collaboration: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true }
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Project', projectSchema);