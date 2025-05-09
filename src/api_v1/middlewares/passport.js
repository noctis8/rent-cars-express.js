import LocalStrategy from 'passport-local';
import passport from 'passport';
import { userByEmail } from "../services/client-services.js";
import { validPassword, hashPassword } from "../helpers/login-helper.js";


const verifyCallback = async (email, password, done) => {
    console.log("in verify PASSPORT");
    const user = await userByEmail(email);
    console.log("user", user)
    if (!user) {
        return done(null, false, { message: 'Incorrect email' });
    }

    const isMatch = await validPassword(password, user);
    console.log("is match ???????", isMatch);
    if (isMatch) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'Incorrect password.' });
    }
}

const localStrategy = new LocalStrategy({ usernameField: 'email' }, verifyCallback);
passport.use(localStrategy);


export default passport;