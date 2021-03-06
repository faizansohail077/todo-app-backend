const mongoose = require('mongoose')
const { db } = require('../config/db')

mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
    .then(() => {
        console.log('database connected')
    })
    .catch(err => {
        console.log(err.message)
    })