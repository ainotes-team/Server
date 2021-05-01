const mongoose = require('mongoose')
const User = require("./user")
const File = require("./file")

const UserFilePermissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: function() {
        return new Promise((res, rej) => User.findOne({_id: this.user}).then(data => res(data)).catch(err => res(false)))
      },
      message: 'invalid user id',
    },
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    validate: {
      validator: function() {
        return new Promise((res, rej) => File.findOne({_id: this.file}).then(data => res(data)).catch(err => res(false)))
      },
      message: 'invalid file id',
    },
    required: true
  },
  userPermission: {
    type: Number,
    required: true,
    validate: [v => v >= 0 && v <= 2, 'userPermission must be a value between 0 and 2']
  },
  parentDirectoryId: { type: Number },
  accepted: { type: Boolean },
})

const UserFilePermission = mongoose.model('UserFilePermission', UserFilePermissionSchema)

module.exports = exports = UserFilePermission
