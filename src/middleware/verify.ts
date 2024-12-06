import jwt from 'jsonwebtoken';
import { env } from '../env';
import User from '../models/user-model';
import Blacklist from '../models/blacklist';

export async function Verify(req, res, next) {
	try {
		// get the session cookie from request header
		const authHeader = req.headers['cookie'];

		// if there is no cookie from request header, send an unauthorized response.
		if (!authHeader) return res.sendStatus(401);

		// if there is, split the cookie string to get the actual jwt
		const cookie = authHeader.split('=')[1];
		const accessToken = cookie.split(';')[0];

		// checks if that token is blacklisted
		const checkIfTokenIsBlacklisted = await Blacklist.findOne({
			token: accessToken,
		});

		// if true, send an unathorized message, asking for a re-authentication.
		if (checkIfTokenIsBlacklisted)
			return res
				.status(401)
				.json({ message: 'This session has expired. Please login' });

		// if token has not been blacklisted, verify with jwt to see if it has been tampered with or not
		// this checks the integrity of the accessToken
		jwt.verify(cookie, env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
			if (err) {
				// if token has been altered or has expired, return an unauthorized error
				return res
					.status(401)
					.json({ message: 'This session has expired. Please login' });
			}

			// get user id from the decoded token
			const { id } = decoded;

			// find user by that `id`
			const user = await User.findById(id);

			// return user object without the password
			const { password, ...data } = user.toObject();

			// put the data object into req.user
			req.user = data;

			next();
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			data: [],
			message: 'Internal Server Error',
		});
	}
}

export function VerifyRole(req, res, next) {
	try {
		const user = req.user; // we have access to the user object from the request
		const { role } = user; // extract the user role

		// check if user has no advance privileges
		// return an unathorized response
		if (role !== '0x88') {
			return res.status(401).json({
				status: 'failed',
				message: 'You are not authorized to view this page.',
			});
		}

		next(); // continue to the next middleware or function
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			data: [],
			message: 'Internal Server Error',
		});
	}
}
