const mongoose = require('mongoose')

const DirectorySchema = new mongoose.Schema({
  directoryId: { type: Number, required: true },
  parentDirectoryId: { type: Number, required: true },
  name: { type: String, required: true },

})

const Directory = mongoose.model('Directory', DirectorySchema)

module.exports = exports = Directory
