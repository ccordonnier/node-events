const express = require("express");
const router = express.Router();
const user = require("../controller/users");
const multer = require("../multer");

router.get("/", user.getAll);
router.get("/:id", user.getOne);
router.post("/add", multer.upload.single('avatar'), user.add);
router.put("/:id", multer.upload.single('avatar'), user.modify)
router.delete('/:id', user.remove);

module.exports = router;