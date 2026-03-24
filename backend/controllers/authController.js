const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "fallback_secret_key", {
    expiresIn: "30d",
  });
};

/*
---------------------------------------------------
1️⃣ Manual Signup
---------------------------------------------------
*/
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      authProvider: "local"
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        token: generateToken(user._id)
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
2️⃣ Manual Login
---------------------------------------------------
*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (user && user.authProvider === "google") {
      return res.status(400).json({ message: "Please continue with Google for this account" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*
---------------------------------------------------
3️⃣ Google OAuth Login
---------------------------------------------------
*/
exports.googleLogin = async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required from OAuth" });
    }

    let user = await User.findOne({ email });

    // If user doesn't exist, create them
    if (!user) {
      user = new User({
        name: name || "Google User",
        email,
        profileImage: profileImage || "",
        authProvider: "google"
      });
      await user.save();
    }

    res.json({
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        token: generateToken(user._id)
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
