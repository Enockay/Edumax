const express = require('express');
const systemLogin = require("../../public/models/systemLogin");
const login = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

login.post('/login', async (req, res) => {
  const key = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';
  const { username, password } = req.body;
  console.log(req.body);
  const user = await systemLogin.findOne({ username });
  
  if (!user || !(await user.matchPassword(password))) {
    return res.status(204).json({ success: false, message: 'Invalid Credentials' });
  }

  const { _id, fullName } = user;
  const token = jwt.sign({ id: _id, fullName }, key, { expiresIn: "1hr" });
  res.status(200).json({ success: true, message: `successfully authenticated admin ${fullName}`, token: token });
});

login.post("/register", async (req, res) => {
  const { fullName, password, username, uniqueId } = req.body;
  try {
    const newUser = new systemLogin({
      fullName: fullName,
      password: password,
      username: username,
      uniqueId: uniqueId
    });
    await newUser.save();
    res.status(200).json({ message: "new user Added to the system", newUser });
  } catch (error) {
    res.status(400).json({ message: "Error occurred while adding new admin" });
  }
});

module.exports = login;
