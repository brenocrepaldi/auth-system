import bcrypt from 'bcrypt';
import User from '../models/user';

// Max number of refresh_tokens
const MAX_TOKENS = 5;

/**
 * @route POST user/login
 * @desc logs in a user
 * @access Public
 */
export async function Login(req, res) {
	try {
		// Get variables for the login process
		const { email } = req.body;

		// Check if user exists
		const user = await User.findOne({ email: email }).select('+password');

		if (!user)
			return res.status(401).json({
				status: 'failed',
				data: [],
				message:
					'Invalid email or password. Please try again with the correct credentials.',
			});

		// Validates password
		const isPasswordValid = await bcrypt.compare(
			`${req.body.password}`,
			user.password
		);

		// if not valid, return unathorized response
		if (!isPasswordValid)
			return res.status(401).json({
				status: 'failed',
				data: [],
				message:
					'Invalid email or password. Please try again with the correct credentials.',
			});

		// generates session token for user
		const token = user.generateAccessJWT();
		// set the token to response header, so that the client sends it back on each subsequent request
		res.cookie('access_token', token, {
			maxAge: 20 * 60 * 1000, // would expire in 20minutes
			httpOnly: true, // The cookie is only accessible by the web server
			secure: true,
			sameSite: 'None',
		});

		// generates refresh token
		const refreshToken = user.generateRefreshJWT();
		// set the refresh token to response header
		res.cookie('refresh_token', refreshToken, {
			maxAge: 7 * 24 * 60 * 60 * 1000, // would expire in 7days
			httpOnly: true, // The cookie is only accessible by the web server
			secure: true,
			sameSite: 'None',
		});

		// Check if the refresh token already exists
		const tokenExists = user.refresh_tokens.some(
			(t) => t.token === refreshToken
		);

		if (!tokenExists) {
			// Add the new refresh token to the list if not already present
			user.refresh_tokens.push({ token: refreshToken });

			// Ensure the number of tokens does not exceed the limit
			if (user.refresh_tokens.length > MAX_TOKENS) {
				user.refresh_tokens.shift(); // Remove the oldest token
			}
		}

		// Save the updated user data
		await user.save();

		res.status(200).json({
			status: 'success',
			message: 'User logged in.',
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			data: [],
			message: 'Internal Server Error',
		});
	}
	res.end();
}
