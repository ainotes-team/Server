const express = require('express')
const authentication = require('../../middleware/authentication')
const controller = require('./controller')

const router = express.Router()

// TODO: routes
router.post('/', authentication, controller.create)
router.get('/:directoryId', authentication, controller.getById)
router.put('/:directoryId', authentication, controller.updateById)

module.exports = router;
