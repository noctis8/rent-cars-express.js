import express from "express";
import * as websitePagesContoller from "../controllers/website-controller.js";

const router = express.Router();

router
.get("/", websitePagesContoller.getHomePage)
.get("/cars", websitePagesContoller.geAllCarsPage)
.get("/cars/filtered", websitePagesContoller.geFilteredCarsPage)
.get("/login", websitePagesContoller.getLoginPage)
.get("/car/:id", websitePagesContoller.getSpecificCar)
.post("/car/:id", websitePagesContoller.requestRentCar)

export default router;
