import jwt from "jsonwebtoken";
import { SECRET_WORD } from "../config.js";

export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "The token is required",
    });
  }

  try {
    token = token.split(" ")[1];
    const { email, idUser } = jwt.verify(token, SECRET_WORD);
    req.email = email;
    req.idUser = idUser;
    next();
  } catch (err) {
    console.error("An error ocurred jwt.middlewares.js", err);
    return res.status(400).json({
      ok: false,
      message: "Invalid token",
    });
  }

};
