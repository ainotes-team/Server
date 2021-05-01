const express = require('express')
const authentication = require('../../middleware/authentication')
const controller = require('./controller')

const router = express.Router()

router.post('/', authentication, controller.create)
router.get('/:componentId', authentication, controller.getById)
router.put('/:componentId', authentication, controller.updateById)

module.exports = router;
