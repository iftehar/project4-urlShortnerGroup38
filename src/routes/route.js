const express = require('express');
const router = express.Router();
const UrlController = require("../controller/Urlcontroller");


router.post("/url/shorten", UrlController.Url)


















module.exports = router;