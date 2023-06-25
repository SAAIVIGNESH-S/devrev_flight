const Credentials = require("../models/credentials_model");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Credentials.findOne({ email: email });
    if (user) {
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = new Credentials({
      email: email,
      password: password,
      role: "user",
    });
    await newUser.save();

    res.status(201).json({ message: "User added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = signup;
