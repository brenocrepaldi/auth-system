import bcrypt from 'bcrypt';
import User from '../models/user-model';

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

		let options = {
			maxAge: 20 * 60 * 1000, // would expire in 20minutes
			httpOnly: true, // The cookie is only accessible by the web server
			secure: true,
			sameSite: 'None',
		};

		// generate session token for user
		const token = user.generateAccessJWT();

		// set the token to response header, so that the client sends it back on each subsequent request
		res.cookie('SessionID', token, options);

		res.status(200).json({
			status: 'success',
			message: 'You have successfully logged in.',
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
