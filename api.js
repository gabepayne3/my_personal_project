const db = require("./db/connection.js")
const express = require("express")
const app = express()
const getApi = require("./controllers/api.controllers")
app.use(express.json());
app.get("/api", getApi)

module.exports = app
