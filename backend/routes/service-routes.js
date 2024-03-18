const express = require("express");
const multer = require("multer");

const router = express.Router();

// const sendMail = require("../controllers/nodeMailer.js");
const { uploadImageToAWS } = require("../controllers/service-controllers");

// router.post("/sendMail", sendMail);

// upload image to aws
const storage = multer.memoryStorage({});

const upload = multer({
  storage: storage,
});

router.post("/upload", upload.single("file"), uploadImageToAWS);

module.exports = router;
