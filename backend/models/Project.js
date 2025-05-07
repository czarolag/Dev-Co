const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  img: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true }
});

module.exports = mongoose.model('Item', itemSchema);