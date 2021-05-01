const UserFilePermission = require('../../models/user-file-permission')
const Component = require('../../models/component')
const File = require('../../models/file')
const config = require('../../config')

exports.create = async (req, res, next) => {
    const fileModel = await File.findOne({ _id: req.body.fileId });

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
        try {
            delete req.body._id;
            const component = await Component.create(req.body);
            await component.save()
            return res.status(200).json(component)
        } catch (e) {
            return res.status(500).json({ status: 500, message: "Internal server error." })
        }
    } else {
        return res.status(403).json({ status: 403, message: "Forbidden: No write access." })
    }
}

exports.getById = async (req, res, next) => {
    Component.findOne({ _id: req.params.componentId }).then(async component => {
        const fileModel = await File.findOne({ _id: component.fileId });

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
            return res.status(200).json(component)
        } else {
            return res.status(403).json({ status: 403, message: "Forbidden: No read access." })
        }
    }).catch(err => {
        next({ status: 500, message: err.message })
    })
}

exports.updateById = (req, res, next) => {
    Component.findOne({ _id: req.params.componentId }).then(async component => {

        const fileModel = await File.findOne({ _id: component.fileId });

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
            Component.updateOne({ _id: req.params.componentId }, req.body, async (err, f) => {
                if (err) return next({ status: 500, message: err.message })

                await component.save()
                return res.status(200).send();
            }).catch(err => {
                next({ status: 500, message: err.message })
            })
        } else {
            return res.status(403).json({ status: 403, message: "Forbidden: No write access." })
        }
    }).catch(err => {
        next({ status: 500, message: err.message })
    })
}
