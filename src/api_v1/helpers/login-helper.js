import bcrypt from "bcrypt";
import AppError from "../utils/app-error.js";


export async function validPassword(plainPassword, user) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, user.password);
        return isMatch;
    } catch (err) {
        console.log(err);
        throw new AppError("Error occurred when comparing passwords, details: ", err); // Default status is 500
    }
}


export async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}
