const multer  = require('multer')
const User = require('../../models/user')
const config = require('../../config')
const Image = require('../../models/image')
const Component = require('../../models/component')
const UserFilePermission = require('../../models/user-file-permission')
const File = require('../../models/file')

const storage =  {
    dest: 'uploads/'
}
const multerUpload = multer(storage);

exports.upload = (req, res, next) => {
  multerUpload.single('file') (req, res, async () => {
    if (!req.file) {
      return next({ status: 400, message: 'Please provide a file.' })
    }

    const fileId = req.body.component;

    if (!fileId) {
      Image.create({ path: req.file.path, file: fileId }).then(image => {
        return res.status(200).json({ _id: image._id })
      })
    } else {
      const fileModel = await File.findOne({ _id: fileId });

      if (!fileModel) {
        return res.status(403).json({ status: 403, message: "Forbidden: File does not exist." })
      }

      const permittedUsers = [];
      for (const id of fileModel.userFilePermissions) {
        const permission = await UserFilePermission.findOne({ _id: id });

        if (permission.userPermission >= 1) {
          permittedUsers.push(permission.user.toString())
        }
      }

      const isPermitted = permittedUsers.includes(req.__userId)

      if (isPermitted) {
        Image.countDocuments({ component: fileId }, function (err, count) {
          if(count > 0) {
            return res.status(404).json({ status: 404, message: 'Component image does already exist.' })
          } else {
            Image.create({ path: req.file.path, component: fileId }).then(image => {
              return res.status(200).json({ _id: image._id })
            })
          }
        });
      } else {
        return res.status(403).json({ status: 403, message: "Forbidden: No write access." })
      }
    }
  });
}

exports.download = (req, res, next) => {
  Image.findOne({ _id: req.params.imageId }).then(async image => {
    if (!image.file) {
      res.status(200).download(image.path)
    } else {
      console.log('Image Component Content')

      if (!req.__userId) {
        return res.status(401).json({ status: 401, message: "Unauthorized." })
      }

      const fileModel = await File.findOne({ _id: image.file });

      if (!fileModel) {
        return res.status(403).json({ status: 403, message: "Forbidden: File does not exist." })
      }

      const permittedUsers = [];
      for (const id of fileModel.userFilePermissions) {
        const permission = await UserFilePermission.findOne({ _id: id });

        if (permission.userPermission >= 0) {
          permittedUsers.push(permission.user.toString())
        }
      }

      const isPermitted = permittedUsers.includes(req.__userId)

      if (isPermitted) {
        res.status(200).download(image.path)
      } else {
        return res.status(403).json({ status: 403, message: "Forbidden: No read access." })
      }
    }
  }).catch(err => {
    next({ status: 500, message: err.message })
  });
}

exports.downloadProfilePicture = async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.userId });
  if (!user) {
    return next({ status: 404, message: "User not found" });
  }

  const imageId = user.profilePicture;

  Image.findOne({ _id: imageId }).then(image => {
    return res.status(200).download(image.path)
  }).catch(err => {
    next({ status: 500, message: err.message })
  });
}

exports.uploadProfilePicture = (req, res, next) => {
  const userId = req.__userId
  console.log(userId)
  multerUpload.single('file') (req, res, () => {
    if (!req.file) {
      next({ status: 400, message: 'Please provide a file.' })
    }
    Image.create({ path: req.file.path }).then(async image => {
      const user = await User.findOne({ _id: userId });
      if (user) {
        user.profilePicture = image._id
        await user.save()
        return res.status(200).json({ status: 200, message: "Sucess" })
      }
    })
  });
}