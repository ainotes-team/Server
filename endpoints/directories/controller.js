const Directory = require('../../models/directory')
const config = require('../../config')

exports.create = (req, res, next) => Directory.create(req.body).then(ufp => {
  return res.status(200).json(ufp)
}).catch(err => {
  next({ status: 500, message: err.message })
})

exports.getById = (req, res, next) => Directory.findOne({ _id: req.params.directoryId }).then(ufp => {
  return res.status(200).json(ufp)
}).catch(err => {
  next({ status: 500, message: err.message })
})

exports.updateById = (req, res, next) => Directory.updateOne({ _id: req.params.fileId }, req.body, (err, f) => {
  if (err) return next({ status: 500, message: err.message })
  return res.status(200).send();
}).catch(err => {
  next({ status: 500, message: err.message })
})
