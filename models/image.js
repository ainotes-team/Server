const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
  file: { type: mongoose.Schema.Types.ObjectId, required: false},
  path: { type: String, required: true }
})

const Image = mongoose.model('Image', ImageSchema)

module.exports = exports = Image
