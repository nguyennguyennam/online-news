import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import bcrypt from "bcryptjs";
import userModel from "../model/user.model.js";

const GMAIL_ID=process.env.GMAIL_ID;
const GMAIL_SECRET=process.env.GMAIL_SECRET;

// Local Strategy (Email & Password)
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
    },
  ),
);

// Google Strategy (New addition)
passport.use(
  new GoogleStrategy(
    {
      clientID: GMAIL_ID, // Google Client ID
      clientSecret: GMAIL_SECRET, // Google Client Secret
      callbackURL: "http://localhost:3000/auth/google/callback", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0].value;

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            fullName: profile.displayName,
            email: email || "",
            clearance: 1,
            password: 123456,
            subscription: new Date(),
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
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
