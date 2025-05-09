import express from "express";
import env from "dotenv";
import passport from "passport";
import flash from "connect-flash";
import session from 'express-session';
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();



const firebaseConfig = {
    apiKey: "AIzaSyDpzvM3lh5PrSuxecJReAcAiuAQpiJCC9k",
    authDomain: "car-rental-project-334a8.firebaseapp.com",
    projectId: "car-rental-project-334a8",
    storageBucket: "car-rental-project-334a8.appspot.com",
    messagingSenderId: "326694983808",
    appId: "1:326694983808:web:4c6a5d27533a2ccae8ae65",
    measurementId: "G-NSJXDXDDE7"
};

// Import the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';                // These functions are used to interact with Cloud Storage for Firebase. 


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);


// function retrive image
export default async function getImageURL(imageName) {
    const storageRef = ref(storage, `https://firebasestorage.googleapis.com/v0/b/car-rental-project-334a8.appspot.com/o/${imageName}`);      // get this path from firebase console
    try {
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Failed to retrieve image URL:', error);
        return null; 
    }
}

app.use(cors({
    credentials: true,
    origin: "http://localhost:5555",
    methods: ["GET", "POST"]
}));
app.use(cookieParser());
app.use(session({ 
        secret: process.env.SESSION_SECRET_KEY,
        resave: false, 
        saveUninitialized: false,
        secure: true,
        cookie: { 
            maxAge: 100000,
            path: "/",
            secure: true,
            sameSite: "none"
        }
    }
));
env.config();
const PORT = process.env.PORT_NUMBER;


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import errorHandler from "./middlewares/ErrorHandler-middleware.js";
import notFoundPage from "./middlewares/notFound-middleware.js";

// getting routes
import websiteRoute from "./routes/website-routes.js";
app.use("/", websiteRoute);
import apiRoute from "./routes/API-routes.js";
app.use("/api/v1", apiRoute);


app.use(errorHandler);
app.use(notFoundPage);

app.listen(PORT, () => {
    console.log("server listening on port " + PORT);
});