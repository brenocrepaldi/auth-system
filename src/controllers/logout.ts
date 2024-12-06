import Blacklist from '../models/blacklist';

/**
 * @route POST user/logout
 * @desc Logout user
 * @access Public
 */
export async function Logout(req, res) {
	try {
		const authHeader = req.headers['cookie']; // get the session cookie from request header
		if (!authHeader) return res.sendStatus(204); // No content
		const cookie = authHeader.split('=')[1]; // If there is, split the cookie string to get the actual jwt token
		const accessToken = cookie.split(';')[0];
		const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted

		// if true, send a no content response.
		if (checkIfBlacklisted) return res.sendStatus(204);

		// otherwise blacklist token
		const newBlacklist = new Blacklist({
			token: accessToken,
		});
		await newBlacklist.save();

		// Also clear request cookie on client
		res.setHeader('Clear-Site-Data', '"cookies"');

		res.status(200).json({
			message: 'You are logged out!',
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			message: 'Internal Server Error',
		});
	}
	res.end();
}
