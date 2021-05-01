const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Number,
    required: true,
  },
  lastChangedDate: {
    type: Number,
    required: true,
  },
  lineMode: {
    type: Number,
    required: true,
  },
  strokeContent: {
    type: String,
  },

  userFilePermissions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'UserFilePermission'
  },
  components: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Component'
  },
})

const File = mongoose.model('File', FileSchema)

module.exports = exports = File
