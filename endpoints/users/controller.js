const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/user')
const config = require('../../config')

exports.register = (req, res, next) => User.create(req.body).then(async user => {
  return res.status(200).json(user.strip())
}).catch(err => {
  next({ status: 500, message: err.message })
})

exports.login = (req, res, next) => User.findOne({ email: req.body.email }, (err, user) => {
  if (!user) {
    return res.status(401).json({
      error: new Error('Incorrect username / password!')
    });
  }
  if (err) return next({ status: 500, message: err.message })

  user.comparePassword(req.body.password, function(err, isMatch) {
    if (err) return next({ status: 500, message: err.message })
    if (isMatch) {
      return res.status(200).json({
        userId: user._id,
        token: jsonwebtoken.sign({ userId: user._id }, config.jwt.tokenSecret)
      });
    } else {
      return res.status(401).json({ error: 'Incorrect username / password!' });
    }
  });
}).catch(err => {
  next({ status: 500, message: err.message })
})

exports.getMe = (req, res, next) => User.findOne({ _id: req.__userId }, (err, user) => {
  if (err) return next({ status: 500, message: err.message });
  if (!user) return next({ status: 404, message: "User not found" });
  return res.status(200).json(user.strip());
}).catch(err => {
  next({ status: 500, message: err.message })
})

// TODO: do not allow to change password this way
exports.putMe = (req, res, next) => User.updateOne({ _id: req.__userId }, req.body, (err, user) => {
  if (err) return next({ status: 500, message: err.message });
  if (!user) return next({ status: 404, message: "User not found" });
  return res.status(200).send();
}).catch(err => {
  next({ status: 500, message: err.message })
})

exports.get = (req, res, next) => User.findOne({ _id: req.params.userId }, (err, user) => {
  if (err) return next({ status: 500, message: err.message });
  if (!user) return next({ status: 404, message: "User not found" });
  return res.status(200).json(user.strip());
}).catch(err => {
  next({ status: 500, message: err.message })
})

exports.find = (req, res, next) => User.findOne({ email: req.params.email }, (err, user) => {
  if (err) return next({ status: 500, message: err.message });
  if (!user) return next({ status: 404, message: "User not found" });
  return res.status(200).json(user.strip());
}).catch(err => {
  next({ status: 500, message: err.message })
});

exports.changePassword = (req, res, next) => User.findOne({ _id: req.__userId }, (err, user) => {
  if (!user) {
    return res.status(401).json({
      error: new Error('Incorrect username / password!')
    });
  }
  if (err) return next({ status: 500, message: err.message })

  user.comparePassword(req.body.oldPassword, async function(err, isMatch) {
    if (err) return next({ status: 500, message: err.message })
    if (isMatch) {
      user.password = req.body.newPassword
      await user.save()

      return res.status(200).json({
        userId: user._id,
        token: jsonwebtoken.sign({ userId: user._id }, config.jwt.tokenSecret)
      });
    } else {
      return res.status(401).json({ error: 'Incorrect username / password!' });
    }
  });
}).catch(err => {
  next({ status: 500, message: err.message })
})
