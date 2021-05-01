const express = require('express')
const authentication = require('../../middleware/authentication')
const controller = require('./controller')

const router = express.Router()

router.post('/', controller.register)
router.post('/login', controller.login)

router.get('/me', authentication, controller.getMe)
router.put('/me', authentication, controller.putMe)

router.get('/:userId', authentication, controller.get)
router.get('/find/:email', authentication, controller.find)

router.put('/change', authentication, controller.changePassword)

module.exports = router;
