const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../config')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide a valid email address'],
    // https://stackoverflow.com/a/55136804/11578154
    // check if email is valid
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email address'],
    // check if email is in use
    validate: {
      validator: function() {
        return new Promise((res, rej) => User.findOne({email: this.email, _id: {$ne: this._id}}).then(data => res(!data)).catch(err => res(false)))
      },
      message: 'Email already taken',
    }
  },
  displayName: {
    type: String,
    match: [/^([a-zA-Z0-9_\- ]){3,30}$/, 'Please provide a valid display name (only use letters, numbers, "-" and "_", max length of 30, min length of 3)'],
  },
  profilePicture: {
    type: String
  },

  password: {
    type: String,
    match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Please provide a password with at least one upper case letter, one lower case letter, one digit, one special character and a minimum length of eight'],
    required: true
  },

  userFilePermissions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'UserFilePermission'
  },

  creationDate: {
    type: Date,
    // a creation date may not be provided by the user
    // validate: {
    //   validator: function() {
    //     return new Promise((res, rej) => res(!this.creationDate))
    //   },
    //   message: 'Please do not provide a creation date',
    // }
  },
})

// https://stackoverflow.com/a/14595363/11578154
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // set the creation date
    user.creationDate = Date.now()

    // generate a salt
    bcrypt.genSalt(config.crypto.saltWorkFactor, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.strip = function() {
  let stripped = ({...this}._doc);
  delete stripped.password
  return stripped
};

const User = mongoose.model('User', UserSchema)

module.exports = exports = User
