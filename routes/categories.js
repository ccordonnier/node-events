const express = require("express");
const router = express.Router();
const categories = require("../controller/categories");



router.get("/", categories.getAll);

module.exports = router;
