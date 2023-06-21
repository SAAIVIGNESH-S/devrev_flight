const Credentials = require("../models/credentials_model");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Credentials.findOne(
      { email: email, password: password },
      { role: 1, _id: 0 }
    );

    if (!user) {
      return res.status(404).json({ message: "Unauthorized" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = login;
