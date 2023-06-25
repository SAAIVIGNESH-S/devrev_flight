require('dotenv').config()
const Credentials = require("../models/credentials_model");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const user = await Credentials.findOne(
      { email: email, password: password },
      { role: 1, _id: 0 }
      );
      
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const token = jwt.sign({ email: email, role: user["role"] }, process.env.TOKEN_SECRET.toString(), { expiresIn: '86400s' });

    res.status(200).json({role :user["role"] , token:token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = login;
