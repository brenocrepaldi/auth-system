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

		const { access_token, refresh_token } = req.cookies;

		// Verify if tokens are available
		if (!access_token && !refresh_token) {
			return res.status(400).json({ message: 'No tokens found for logout' });
		}

		// Check if that token is blacklisted
		const isTokenBlacklisted = await Blacklist.findOne({ token: access_token }); 

		// if true, send a no content response.
		if (isTokenBlacklisted) return res.sendStatus(204);

		// otherwise blacklist token
		const newBlacklist = new Blacklist({
			token: access_token,
		});
		await newBlacklist.save();

		// Also clear request cookie on client
		res.setHeader('Clear-Site-Data', '"cookies"');

		// Clear access_token from cookies
		res.clearCookie('access_token', {
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
			path: '/',
		});

		// Clear refresh_token from cookies
		res.clearCookie('refresh_token', {
			httpOnly: true, // Ensures the cookie is not accessible via JavaScript on the client-side
			secure: true, // Only send the cookie over HTTPS (ensure your site uses HTTPS)
			sameSite: 'Strict', // Restricts the cookie to be sent only for same-site requests (or 'Lax' for more leniency)
			path: '/', // Ensures the cookie is cleared across the entire site
		});

		res.status(200).json({
			message: 'User logged out.',
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			message: 'Internal Server Error',
		});
	}
	res.end();
}
