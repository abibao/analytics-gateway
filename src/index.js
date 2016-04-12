'use strict'

const feathers = require('feathers')
const bodyParser = require('body-parser')
const handler = require('feathers-errors/handler')

const r = require('rethinkdbdash')({
  port: 29015,
  host: 'place-with-no-firewall.com',
})
const service = require('feathers-rethinkdb')

// A Feathers app is the same as an Express app
const app = feathers()

// Parse HTTP JSON bodies
app.use(bodyParser.json());
// Parse URL-encoded params
app.use(bodyParser.urlencoded({ extended: true }));

// Register a nicer error handler than the default Express one
app.use(handler())

// Start the server
app.listen(8080, '0.0.0.0', function () {
  console.log(app);
})
