// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './.env' })

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

// Get environment variables
const PORT = process.env.PORT || 3000

let connectionString
if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === undefined
) {
  connectionString = process.env.ATLAS_URI_DEV
}

if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.ATLAS_URI_PROD
}

const app = express()

app.use(bodyParser.json())
app.use(cors())

// API router
app.use(require('./routes/router'))

app.use((req, res, next) => {
  const error = new Error('Route Not Found')
  error.status = 404
  next(error)
})

// Global error handling
app.use(function (err, _req, res, next) {
  res.status(500).send(err.message)
})

// Perform a database connection when the server starts
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => {
    // Start the Express server
    app.listen(PORT, () => {
      console.log('info', `Server is running on port: ${PORT}`)
    })
  })
  .catch((error) => {
    console.log('error', `Database connection failed: ${error}`)
    process.exit(1)
  })
