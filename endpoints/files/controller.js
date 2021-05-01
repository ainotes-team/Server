const UserFilePermission = require('../../models/user-file-permission')
const File = require('../../models/file')
const Component = require('../../models/component')
const config = require('../../config')

// TODO: methods
exports.create = (req, res, next) => File.create(req.body).then(async fileModel => {
  // creating userFilePermission => creator is admin
  const ufp = await UserFilePermission.create({
    user: req.__userId,
    file: fileModel._id,
    userPermission: 2,
    accepted: true
  });

  // updating fileModel with userFilePermission._id & updating database
  fileModel.userFilePermissions.push(ufp._id)
  fileModel.save()

  return res.status(200).json(fileModel)
}).catch(err => {
  next({ status: 500, message: err.message })
})

exports.getById = (req, res, next) => File.findOne({ _id: req.params.fileId }).then(async fileModel => {
  if (!fileModel) return next({ status: 404, message: "File not found." });

  const permittedUsers = [];

  for (const id of fileModel.userFilePermissions) {
    permittedUsers.push((await UserFilePermission.findOne({ _id: id })).user.toString())
  }

  const isPermitted = permittedUsers.includes(req.__userId)

  if (isPermitted) {
    return res.status(200).json(fileModel)
  } else {
    return res.status(403).json({ status: 403, message: "Forbidden: No read access." })
  }
}).catch(err => {
  next({ status: 500, message: err.message })
})

exports.updateById = async (req, res, next) => {
  const fileModel = await File.findOne({ _id: req.params.fileId });
  if (!fileModel) return next({ status: 404, message: "File not found." });

  const permittedUsers = [];
  for (const id of fileModel.userFilePermissions) {
    const permission = await UserFilePermission.findOne({ _id: id });

    // give all users permission with write access (userPermission >= 1)
    if (permission.userPermission >= 1) {
      permittedUsers.push(permission.user.toString())
    }
  }

  const isPermitted = permittedUsers.includes(req.__userId)

  if (isPermitted) {
    File.updateOne({ _id: req.params.fileId }, req.body, (err, f) => {
      if (err) return next({ status: 500, message: err.message })
      return res.status(200).send();
    }).catch(err => {
      next({ status: 500, message: err.message })
    })
  } else {
    return res.status(403).json({ status: 403, message: "Forbidden: No write access." })
  }
}

exports.getChangesFromTimestamp = async (req, res, next) => {
  const timestamp = req.body.timestamp;

  const changedComponents = await Component.find({
    fileId: req.params.fileId
  }).where('lastUpdated').gt(timestamp);

  return res.status(200).json(changedComponents)
}

exports.getComponents = async (req, res, next) => 
{  const components = await Component.find({
    fileId: req.params.fileId
  })

  if (!components) return res.status(404)

  return res.status(200).json(components)
}

exports.getPermissions = async (req, res, next) => {
  const ufps = await UserFilePermission.find({
    file: req.params.fileId
  })

  if (!ufps) return res.status(404)

  return res.status(200).json(ufps)
}