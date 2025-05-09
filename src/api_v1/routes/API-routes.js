import express from "express";
import * as apiController from "../controllers/API-controller.js";
import passport from  "../middlewares/passport.js";
import loginLimiter from "../middlewares/login-limiter.js";

const router = express.Router();

router
.get("/cars/all", apiController.allCars)
.post("/cars/filtered", apiController.allAvailableCarsFiltred)
.post("/car/specific", apiController.carCharacteristics)
.post("/cars/brands", apiController.brandsAvailable)
.post("/cars/types", apiController.typesAvailable)
.get("/count", apiController.countClientsAndCarsNB)
.get("/cars/top-three", apiController.newstThreeCars)
.get("/auth/is-authorized", apiController.checkAuthorization )
.post("/auth/refresh", apiController.refreshTokensRoute)
.get("/login/error-message", apiController.getErrorLoginMsg)
.post("/login", loginLimiter, 
    passport.authenticate("local", {
        // failureRedirect: '/login',
        failureFlash: true,
        session: false 
    }),
    apiController.createJWTloginRoute     // this will not works if a fail in logion happen
)
.post("/car/rent", apiController.rentCarRoute)
export default router;
