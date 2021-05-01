const express = require('express')
const authentication = require('../../middleware/authentication')
const controller = require('./controller')

const router = express.Router()

// TODO: routes
router.post('/', authentication, controller.create)
router.get('/:fileId', authentication, controller.getById)
router.put('/:fileId', authentication, controller.updateById)
router.get('/:fileId/changed', authentication, controller.getChangesFromTimestamp)
router.get('/:fileId/components', authentication, controller.getComponents)
router.get('/:fileId/permissions', authentication, controller.getPermissions)

module.exports = router;
