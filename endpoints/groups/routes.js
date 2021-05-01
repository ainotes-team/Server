const express = require('express')
const authentication = require('../../middleware/authentication')
const controller = require('./controller')

const router = express.Router()

// TODO: routes
router.post('/', authentication, controller.create)
router.get('/:groupId', authentication, controller.get)
router.put('/:groupId', authentication, controller.update)
router.delete('/:groupId', authentication, controller.delete)

module.exports = router;
