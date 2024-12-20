import jwt from 'jsonwebtoken';
import { env } from '../env';
import User from '../models/user';


/**
 * @route POST user/refresh
 * @desc Refresh user token
 * @access Public
 */
export async function Refresh(req, res) {
	try {
		const { refresh_token } = req.cookies;
		if (!refresh_token) return res.sendStatus(401); // No refresh token.

		// Verify the refresh_token
		jwt.verify(
			refresh_token,
			env.SECRET_REFRESH_TOKEN,
			async (err, decoded) => {
				if (err)
					return res.status(403).json({ message: 'Invalid refresh token' });

				const { id } = decoded;

				// Fetch the user from the database
				const user = await User.findById(id);
				if (!user) return res.status(404).json({ message: 'User not found' });

				const newAccessToken = user.generateAccessJWT()

				// Send the new access_token in the cookie
				res.cookie('access_token', newAccessToken, {
					httpOnly: true,
					secure: true,
					maxAge: 20 * 60 * 1000, // 20m
				});

				return res.json({ message: 'Token refreshed' });
			}
		);
	} catch (err) {
		console.error('Error in RefreshToken:', err.message);
		res.status(500).json({
			status: 'error',
			code: 500,
			message: 'Internal Server Error',
		});
	}
}
