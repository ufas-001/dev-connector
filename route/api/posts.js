/** @format */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Posts Works" }));

module.exports = router;
