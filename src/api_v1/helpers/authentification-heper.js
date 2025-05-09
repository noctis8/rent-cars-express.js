import * as carsInRent from "../services/rented-car-services.js";
import * as clientsQueris from "../services/client-services.js";
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

export function createJWTTokens(user) {
    const accessToken = jwt.sign({ user_id: user.user_id, email: user.email  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
    const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "15d" });
    return { accessToken, refreshToken };
}

export function decodeJWT(token) {
    return jwt.decode(token, { complete: true }).payload;
}

export function setCookie(req, res, name, val, options = {}) {
    res.cookie(name, val, {
        sameSite: 'none',
        httpOnly: true,
        secure: false,
        ...options
    });
}

export const refreshTokens = async function (req, res, user) {
    try {
        let { accessToken, refreshToken } = createJWTTokens(user);
        console.log("in helper !!!!!!!!!!!!refresh token:", refreshToken)
        console.log("in helper !!!!!!!!!!!!access token:", accessToken)
        // res.clearCookie("access_token");
        console.log("coookie deleted???", req.cookies.access_token);
        // setCookie(req, res, "access_token", accessToken);
        await clientsQueris.refreshRefreshTokenDB(user.email, refreshToken);
        // this return should be commented : (anddd the setCookie should be uncommented)
        return accessToken;
    } catch (err) {
        console.log(err);
    }
}

