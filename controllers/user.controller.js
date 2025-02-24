import { USER_MODEL } from "../models/user.model.js";
import { SALTROUNDS } from "../config.js";
import bcryptjs from "bcryptjs";
import { USER_TOKEN } from "../tokens/user.token.js";

const register = async (req, res) => {
  try {
    const { email, username, password, institution, icon_url } = req.body;

    // Check if the required fields are present
    if (!email || !username || !password) {
      return res.status(400).json({
        ok: false,
        message: "The email, username and password are required",
      });
    }

    // Check if the email is already in use
    const emailExists = await USER_MODEL.findOneByEmail(email);
    if (emailExists) {
      return res.status(400).json({
        ok: false,
        message: "The email is already in use",
      });
    }

    // Check if the username is already in use
    const usernameExists = await USER_MODEL.findOneByUsername(username);
    if (usernameExists) {
      return res.status(400).json({
        ok: false,
        message: "The username is already in use",
      });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(parseInt(SALTROUNDS));
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create the user
    const Newuser = await USER_MODEL.createProfile({
      email,
      username,
      password: hashedPassword,
      institution,
      icon_url,
    });

    const token = USER_TOKEN.generateToken(Newuser);

    return res.status(201).json({
      ok: true,
      message: "User registered successfully",
      tk: token,
    });
  } catch (err) {
    console.error("An error ocurred user.controller.js", err);
    return res.status(500).json({
      ok: false,
      message: "An error ocurred while trying to register the user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the required fields are present
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "The email and password are required",
      });
    }

    // Check if the user exists
    const user = await USER_MODEL.findOneByEmail(email);
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "The email or password is incorrect",
      });
    }

    // Check if the password is correct
    const validPassword = await bcryptjs.compare(
      password,
      user.hashed_password
    );

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: "The password is incorrect",
      });
    }

    const token = USER_TOKEN.generateToken(user);

    return res.status(200).json({
      ok: true,
      message: "User logged in successfully",
      tk: token,
    });
  } catch (err) {
    console.error("An error ocurred user.controller.js", err);
    return res.status(500).json({
      ok: false,
      message: "An error ocurred while trying to login the user",
    });
  }
};

const profile = async (req, res) => {
  try {
    const email = req.email;
    const idUser = req.idUser;

    const user = await USER_MODEL.informationByEmail(email);
    const bottles_week = await USER_MODEL.getWeeklyBottles(idUser);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "User profile information",
      information: user,
      bottles_week: bottles_week,
    });
  } catch (err) {
    console.error("An error ocurred user.controller.js", err);
    return res.status(500).json({
      ok: false,
      message: "An error ocurred while trying to get the user profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const idUser = req.idUser;
    const { username, institution, icon_url, email, password } = req.body;

    // Check if the required fields are present
    if (!username || !institution || !icon_url || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "The username, institution, icon_url, email and password are required",
      });
    }


    // Check if the username is already in use
    const usernameExists = await USER_MODEL.findOneByUsername(username);
    if (usernameExists) {
      return res.status(400).json({
        ok: false,
        message: "The username is already in use",
      });
    }

    const hashed_password = await bcryptjs.hash(password, parseInt(SALTROUNDS));

    const user = await USER_MODEL.updateProfile(idUser, {
      username,
      institution,
      icon_url,
      email,
      password: hashed_password,
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "User profile updated successfully",
      information: user,
    });
  } catch (err) {
    console.error("An error ocurred user.controller.js", err);
    return res.status(500).json({
      ok: false,
      message: "An error ocurred while trying to update the user profile",
    });
  }
};

const updateBottles = async (req, res) => {
  try {
    const idUser = req.idUser;
    const { bottles } = req.body;

    // Check if the required fields are present
    if (!bottles) {
      return res.status(400).json({
        ok: false,
        message: "The bottles are required",
      });
    }

    const user = await USER_MODEL.updateBottlesAndWeeklyStats(idUser, bottles);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "User bottles updated successfully",
      information: user,
    });
  } catch (err) {
    console.error("An error ocurred user.controller.js", err);
    return res.status(500).json({
      ok: false,
      message: "An error ocurred while trying to update the user bottles",
    });
  }
};

const scoreboard = async (req, res) => {
  try {
    const users = await USER_MODEL.scoreBoardWeekly();

    return res.status(200).json({
      ok: true,
      message: "Scoreboard information",
      information: users,
    });
  } catch (err) {
    console.error("An error ocurred user.controller.js", err);
    return res.status(500).json({
      ok: false,
      message: "An error ocurred while trying to get the scoreboard information",
    });
  }
}



export const USER_CONTROLLER = {
  register,
  login,
  profile,
  updateProfile,
  updateBottles,
  scoreboard
};
