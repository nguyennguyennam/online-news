import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as FacebookStrategy } from "passport-facebook";
import bcrypt from "bcryptjs";
import userModel from "../model/user.model.js";

// Chiến lược Local (Email & Password)
passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const user = await userModel.findOne({ email });
                if (!user) {
                    return done(null, false, { message: "Invalid email or password." });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: "Invalid email or password." });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Chiến lược Facebook
passport.use(
    new FacebookStrategy(
        {
            clientID: "FACEBOOK_APP_ID", // Thay bằng Facebook App ID
            clientSecret: "FACEBOOK_APP_SECRET", // Thay bằng Facebook App Secret
            callbackURL: "http://localhost:3000/api/users/facebook/callback",
            profileFields: ["id", "emails", "name"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0].value;

                let user = await userModel.findOne({ email });

                if (!user) {
                    user = await userModel.create({
                        name: `${profile.name.givenName} ${profile.name.familyName}`,
                        email: email || "",
                        role: "subscriber",
                        facebookId: profile.id,
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize User
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
