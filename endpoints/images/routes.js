const express = require('express')
const authentication = require('../../middleware/authentication')
const controller = require('./controller')

const router = express.Router()

router.post('/', authentication, controller.upload)
router.get('/:imageId', authentication, controller.download)
router.post('/profilepicture', authentication, controller.uploadProfilePicture)
router.get('/profilepicture/:userId', controller.downloadProfilePicture)

module.exports = router;
