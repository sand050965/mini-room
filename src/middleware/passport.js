/** @format */

const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = (passport) => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: "/auth/google/callback",
				scope: ["profile", "email"],
			},
			async (accessToken, refreshToken, profile, done) => {
				done(null, profile);
			}
		)
	);
};
