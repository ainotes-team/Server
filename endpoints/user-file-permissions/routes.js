const express = require('express')
const authentication = require('../../middleware/authentication')
const controller = require('./controller')

const router = express.Router()

// TODO: routes
router.get('/', authentication, controller.list)
router.get('/:fileId', authentication, controller.get)
router.post('/', authentication, controller.create)
router.put('/:permissionId', authentication, controller.accept)
router.delete('/:permissionId', authentication, controller.delete)

module.exports = router;
