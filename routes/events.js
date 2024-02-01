const express = require("express");
const router = express.Router();
const events = require("../controller/events");
const multer = require("../multer");



router.get("/", events.getAll);
router.get("/:id", events.getOne);
router.post("/add", multer.upload.single('imageEvent'), events.add);
router.put("/:id", multer.upload.single('imageEvent'), events.modify)
router.delete('/:id', events.remove);

module.exports = router;
