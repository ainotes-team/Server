const mongoose = require('mongoose')
const config = require('../config')

mongoose.Promise = global.Promise

mongoose.set('runValidators', true);

exports.connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(`${config.mongo.url}/${config.mongo.db}`, { useNewUrlParser: true, useUnifiedTopology: true })

    const connection = mongoose.connection

    connection.on('error', reject)
    connection.once('open', resolve)
  })
}
