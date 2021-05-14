const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../service/service.js");

const certainPath = path.join(__dirname, "../key/jwt-key.txt");
const privateKey = fs.readFileSync(certainPath, {
  encoding: "utf8",
  flag: "r",
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const response = db.collection().user.find(
      (user) =>
        user.username === username &&
        user.password === password &&
        !user.loggedIn
    );
  if (response === undefined) {
    res.send("Incorrect credentials or client is already logged in");
  } else {
    const token = createToken(response);
    if (token === undefined) {
      res.send("An error occured, try again");
    }
    db.update(username);
    res.send({ userToken: token });
  }
});

router.post("/verify", (req, res) => {
  const { token } = req.body;
  const response = verifyToken(token);

  if (response === undefined) {
    res.send({ verified: false });
  }
  const verified = db.collection().user.some(
    (user) =>
      user.username === response.user.username &&
      user.password === response.user.password
  );
  res.send({ verified });
});

function createToken(user) {
  try {
    return jwt.sign({ user }, privateKey, { expiresIn: "24h" });
  } catch (err) {
    console.error(err);
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, privateKey);
  } catch (err) {
    console.error(err);
  }
}

module.exports = router;
