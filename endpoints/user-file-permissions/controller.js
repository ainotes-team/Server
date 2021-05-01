const UserFilePermission = require('../../models/user-file-permission')
const Files = require('../../models/file')
const config = require('../../config')

// TODO: methods
exports.list = (req, res, next) => {
  UserFilePermission.find({ user: req.__userId }).then(ufp => {
    return res.status(200).json(ufp)
  }).catch(err => {
    next({ status: 500, message: err.message })
  })
}

exports.get = (req, res, next) => {
  UserFilePermission.find({ file: req.params.fileId }).then(ufp => {
    if (ufp.user.toString() === req.__userId) {
      return res.status(200).json(ufp)
    } else {
      return res.status(403)
    }
  }).catch(err => {
    next({ status: 500, message: err.message })
  })
}

exports.create = async (req, res, next) => {
  const adminUsf = await UserFilePermission.findOne({ userPermission: 2, file: req.body.file })

  if (!adminUsf) {
    return res.status(403).json({ status: 403, message: "File does not exist." })
  }

  const fileAdmin = adminUsf.user.toString();
  const reqUser = req.body.user.toString();
  const reqFile = req.body.file.toString();
  const reqUserPermission = req.body.userPermission.toString();
  const existingPermission = await UserFilePermission.findOne({ file: reqFile, user: reqUser })

  if (reqUserPermission === "2") {
    console.log("There can only be one admin for each file.")
    return res.status(403).json({ status: 403, message: "Forbidden: There can only be one admin for each file." })
  }

  if (fileAdmin !== req.__userId || reqUserPermission > 1) {
    return res.status(403).json({ status: 403, message: "Forbidden: Only admin is permitted to create file permissions."})
  }

  if (fileAdmin === reqUser) {
    console.log("Admin is not allowed to degrade himself.")
    return res.status(403).json({ status: 403, message: "Forbidden: Admin is not allowed to degrade himself." })
  }

  if (existingPermission) {
    if (existingPermission.userPermission.toString() !== reqUserPermission) {
      existingPermission.userPermission = reqUserPermission;
      existingPermission.save();

      console.log("Permission updated.")

      return res.status(200).json({ status: 200, message: "Permission updated." })
    } else {
      console.log("Permission does already exist.")

      return res.status(409).json({ status: 409, message: "Conflict: Permission does already exist." })
    }
  }

  UserFilePermission.create(req.body).then(async ufp => {
    const fileModel = await Files.findOne({_id: ufp.file});
    fileModel.userFilePermissions.push(ufp._id);
    fileModel.save();

    ufp.accepted = false;
    await ufp.save()

    return res.status(200).json(ufp)
  }).catch(err => {
    next({ status: 500, message: err.message })
  })
}

exports.accept = async (req, res, next) => {
  UserFilePermission.findOne({ _id: req.params.permissionId }).then(async ufp => {
    if (ufp.user.toString() === req.__userId) {
      ufp.accepted = true;
      await ufp.save()
      return res.status(200)
    } else {
      return res.status(403).json({ status: 403, message: "Only permission user is allowed to accept the user file permission" })
    }
  }).catch(err => {
    next({ status: 500, message: err.message })
  })
}

exports.delete = async (req, res, next) => {
  const userPermissionId = req.params.permissionId;
  const ufp = await UserFilePermission.findOne({ _id: userPermissionId })

  if (!ufp) return res.status(404).json({ status: 404, message: "Permission not found." })

  const adminUsf = await UserFilePermission.findOne({ userPermission: 2, file: ufp.file })
  const fileAdmin = adminUsf.user.toString();

  if (fileAdmin !== req.__userId.toString() && ufp.user.toString() !== req.__userId.toString()) {
    return res.status(403).json({ status: 403, message: "Forbidden: Only file admin and permission user are permitted to delete file permissions." })
  }

  UserFilePermission.deleteOne({ _id: userPermissionId }).then(async (s) => {
    if (s.deletedCount === 0) {
      return res.status(404).send()
    }

    const file = await Files.findOne({ _id: ufp.file })
    file.userFilePermissions.remove(userPermissionId)

    if (file.userFilePermissions.length === 0) {
      await Files.deleteOne({ _id: file._id })
    } else {
      file.save()
    }

    return res.status(200).send()
  }).catch(err => {
    next({ status: 500, message: err.message })
  })
}
