import try_catch from "../utils/try-catch.js";
import { createJWTTokens, setCookie } from "../helpers/authentification-heper.js";
import { refreshRefreshTokenDB } from "../services/client-services.js";

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getHomePage = try_catch(
    (req, res) => {
        return
    }
)

export const geAllCarsPage = try_catch(
    (req, res) => {
        return
    }
)

export const getLoginPage = try_catch(
    (req, res) => {
        return
    }
)

export const geFilteredCarsPage = try_catch(
    (req, res) => {
        return
    }
)

export const getSpecificCar = try_catch(
    async (req, res) => {
        return
    }
)

export const requestRentCar = try_catch(
    async (req, res) => {
        const { car_id } = req.body;
        // logic of interacting with DB
    }
)
