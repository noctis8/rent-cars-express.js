import * as carsQueris from "../services/car-services.js";
import * as clientsQueris from "../services/client-services.js";
import * as carsInRent from "../services/rented-car-services.js";
import getImageURL from "../server.js"; 
import AppError from "../utils/app-error.js";
import try_catch from "../utils/try-catch.js";
import { createJWTTokens, setCookie, decodeJWT, refreshTokens } from "../helpers/authentification-heper.js";
import jwt from "jsonwebtoken";

export const allCars = try_catch(
    async (req, res) => {
        const allCarsArr = await carsQueris.getAllAvailableCars();
        if (!allCarsArr) throw new AppError("no data found for available cars", 404);

        // to be deleted!!! (na7i el url from the json zeda)        (TO-DO !!!!!!!!!)
        // const url = await getImageURL('tesla_electric_white_1.jpg');
        // console.log("URLLLLLLLLLL", url)
        return res.status(200).json(allCarsArr);
    }
)

export const allAvailableCarsFiltred = try_catch(
    async (req, res) => {
        const { rent_d, return_d, brand, type } = req.body;
        const allCars = await carsQueris.getAllAvailableCarsUserPrefrences(new Date(rent_d), new Date(return_d), brand, type);
        if (!allCars) throw new AppError("no data found for available cars", 404);
        return res.status(200).json(allCars);
    }
)

export const carCharacteristics = try_catch(
    async (req, res) => {
        const { car_id } = req.body;
        console.log(car_id);
        const carData = await carsQueris.getCarObj(car_id);
        if (!carData) throw new AppError("no data found for car characteristics", 404);
        res.status(200).json(carData);
    }
)

export const brandsAvailable = try_catch(
    async (req, res) => {
        const { rent_d, return_d } = req.body;
        const data = await carsQueris.getbrands(new Date(rent_d), new Date(return_d));
        if (!data) throw new AppError("no cars founded for this period of time! change the time period if it possible", 404);
        res.status(200).json(data);
    }
)

export const typesAvailable = try_catch(
    async (req, res) => {
        const { rent_d, return_d, brand } = req.body;
        const data = await carsQueris.getTypes(new Date(rent_d), new Date(return_d), brand);
        if (!data) throw new AppError("no types founded for that model cars ! change the model if it possible", 404);
        res.status(200).json(data);
    }
)

export const countClientsAndCarsNB = try_catch(
    async (req, res) => {
        const carNB = await carsQueris.countAllCars();
        const clientNB = await clientsQueris.countAllClients();
        if (!carNB || !clientNB) throw new AppError("number of clients or cars is not found", 404);
        res.status(200).json({ clientsNB: clientNB, carsNB: carNB });
    }
)

export const newstThreeCars = try_catch(
    async (req, res) => {
        const threeCarsArr = await carsQueris.newstCars();
        if (!threeCarsArr) throw new AppError("newst caes not founded", 404);


        // to be deleted!!! (na7i el url from the json zeda)        (TO-DO !!!!!!!!!)
        // const url = await getImageURL('tesla_electric_white_1.jpg');
        res.status(200).json(threeCarsArr);
    }
)

export const getErrorLoginMsg = try_catch(
    // async (req, res) => {
    //     const errorMsg = req.flash('error');    // Retrieve the failure flash message
    //     return res.status(404).json({ error: errorMsg });
    // }
)

export const createJWTloginRoute = try_catch(
    async (req, res) => {
        const { accessToken, refreshToken } = createJWTTokens(req.user);
        await clientsQueris.refreshRefreshTokenDB(req.user.email, refreshToken);
        // setCookie(req, res, "access_token", accessToken);
        return res.status(200).json({ authorized: true, access_token: accessToken });       // !!! TO-DO must delete this access_token from the json (just uncomment the setCookie part)
    }
)

export const checkAuthorization  = async (req, res) => {
    // const accessToken = req.cookies.access_token;
    const accessToken = req.headers.access_token;           // !!! TO-DO delete this and uncomment above
    console.log(accessToken)
    // console.log("HEADER", req.headers);
    // console.log("acess TOKEN IN COOKIE", accessToken);
    // console.log("COOKIE", req.cookies);
    if (!accessToken) {
        return res.status(403).json({ isAuthorized: false, refreshToken: false, message: "no token provided! user must login" });
    }
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        console.log("!!!! access token", accessToken);
        const user = { user_id: decoded.user_id, email: decoded.email };
        console.log("user in checkAuthorization controller:", user);
        return res.status(200).json({ isAuthorized: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(200).json({ isAuthorized: false, refreshToken: true, message: `Expired token! Refresh required.` });
        }
        return res.status(403).json({ isAuthorized: false, refreshToken: false, message: `invalid token! user must login, error: ${error}` });
    }
}

export const refreshTokensRoute = async (req, res) => {
    console.log("gonna refresh the tokens !!! in contoller")
    // const accessToken = req.cookies.access_token;
    const accessToken = req.body.access_token;           // !!! TO-DO delete this and uncomment above
    console.log("access token in AAAAAAAAAAAAAA", accessToken)
    const decoded = decodeJWT(accessToken);
    if (!decoded) {
        return res.status(401).json({ refreshed: false, message: "Invalid or missing access token" });
    }
    const clientId = decoded.user_id;

    let user;
    try {
        user = await clientsQueris.userById(clientId);
        console.log("!!!!!!???????????", user)
        const refreshTokenFromDB = user.refresh_token;
        const decodedRefreshToken = jwt.verify(refreshTokenFromDB, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = await refreshTokens(req, res, user);
        console.log("the valmue that is gonna be returned !!!", accessToken)
        return res.status(200).json({ refreshed: true, access_token: accessToken });
    } catch (error) {
        return res.status(403).json({ refreshed: false, message: `Invalid or expired refresh token in DB! User must login. Error: ${error.message}` });
    }
}

export const rentCarRoute = try_catch(
    async (req, res) => {
        console.log("GONNE RENT !!!!!")
        const { rent_d, return_d, car_id, access_token } = req.body;            // !!! TO-DO remove the access_token from the req.body


        // const accessToken = req.cookies.access_token;
        const { user_id } = decodeJWT(access_token);
        if (!user_id) {
            throw new AppError("renting request has been failed", 403);
        }
        console.log(user_id);
        await carsInRent.rentCar(car_id, user_id, new Date(rent_d), new Date(return_d));
        res.status(201).json({ message: "Car renting has been successfully completed!" });
    }
)
