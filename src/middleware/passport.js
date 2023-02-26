/** @format */

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const StrategyJwt = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const userService = require("../services/userService");
const User = require("../models/User");

require("dotenv").config();

module.exports = (passport) => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: `/auth/google/callback`,
				state: true,
			},
			async (accessToken, refreshToken, profile, done) => {
				const user = {
					googleId: profile.id,
					email: profile.emails[0].value,
					username: profile.displayName,
					avatarImgUrl: profile.photos[0].value,
				};

				try {
					const originUserEmail = await User.findOne({
						email: profile.emails[0].value,
					});

					if (originUserEmail) {
						if (originUserEmail.googleId !== profile.id) {
							await User.updateOne(
								{ email: profile.emails[0].value },
								{
									googleId: profile.id,
									username: profile.displayName,
									avatarImgUrl: profile.photos[0].value,
								}
							);
						}
						done(null, originUserEmail);
					} else {
						const originUserGoogleId = await User.findOne({
							googleId: profile.id,
						});
						if (originUserGoogleId) {
							done(null, originUserGoogleId);
						} else {
							const newUser = await new User(user).save();
							done(null, user);
						}
					}
				} catch (err) {
					console.log(err);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		try {
			const user = userService.getUserByGoogleId({
				googleId: user.googleId,
			});
			done(null, user);
		} catch (err) {
			console.log(err);
			done(err, null);
		}
	});

	passport.use(
		new StrategyJwt(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
				secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
			},
			async (jwtPayload, done) => {
				try {
					const user = await User.findById(jwtPayload._id);
					if (user) {
						return done(null, user);
					}
				} catch (err) {
					return done(err, false);
				}
				return done(null, false);
			}
		)
	);
};
