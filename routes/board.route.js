const express = require('express')

const { controller } = require('../controllers')
const { isAuth } = require('../middleware/auth.middleware')

const app = express()
const router = express.Router()

router.post('/', isAuth, controller.addBoard)
router.get('/', isAuth, controller.getBoard)
router.get('/:id', controller.getBoardById)


exports.boardRoute = app.use('/board', router)