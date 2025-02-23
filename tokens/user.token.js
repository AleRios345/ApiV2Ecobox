import jwt from "jsonwebtoken";
import { SECRET_WORD } from "../config.js";

const generateToken = (user) => {
    const token = jwt.sign(
        {
            email: user.email,
            idUser: user.id,
        },
        SECRET_WORD,
        {
            expiresIn: "1h",
        }
    );

    return token;
};

export const USER_TOKEN = {
  generateToken,
};
