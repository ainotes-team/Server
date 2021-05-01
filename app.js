const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./config')
const mongodb = require('./datasource/mongodb')

const logger = require('./middleware/logger');

const directories = require('./endpoints/directories/routes');
const files = require('./endpoints/files/routes');
const images = require('./endpoints/images/routes');
const userFilePermissions = require('./endpoints/user-file-permissions/routes');
const users = require('./endpoints/users/routes');
const components = require('./endpoints/components/routes')

const app = express();

// middleware: logger
app.use(logger);

// middleware: body parser
app.use(bodyParser.json({limit: '100MB'}));
app.use(bodyParser.urlencoded({extended: true}));

// endpoints
app.use('/directories', directories);
app.use('/files', files);
app.use('/images', images);
app.use('/user-file-permissions', userFilePermissions);
app.use('/users', users);
app.use('/components', components)

// handle next(error) calls
app.use((info, req, res, next) => {
  const { status, message } = info
  console.error(JSON.stringify(info, null, 2))
  res.status(status).send(message)
})

// start listening
start = async () => {
  await mongodb.connect()
  console.log('Connected to database')
  app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`)
  })
}
start()
