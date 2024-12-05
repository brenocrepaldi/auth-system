import User from '../models/user-model';
import { dbCollections } from '../db';
import bcrypt from 'bcrypt';

/**
 * @route POST src/auth/register
 * @desc Registers a user
 * @access Public
 */
export async function Register(req, res) {
	// get required variables from request body
	// using es6 object destructing
	const { first_name, last_name, email, password } = req.body;

	try {
		// create an instance of a user
		const newUser = new User({
			first_name,
			last_name,
			email,
			password,
		});

		// Check if user already exists
		try {
			const existingUser = await dbCollections.users.findOne({
				email: newUser.email,
			});

			if (existingUser)
				return res.status(400).json({
					status: 'failed',
					data: [],
					message:
						'It seems you already have an account, please log in instead.',
				});
		} catch (error) {
			return res.status(500).json({
				status: 'failed',
				data: [],
				message: 'Error fetching user: ' + error,
			});
		}

		try {
			const savedUser = await newUser.save(); // save new user into the database

			res.status(200).json({
				status: 'success',
				data: [savedUser],
				message:
					'Thank you for registering with us. Your account has been successfully created.',
			});
		} catch (err) {
			res.status(500).json({
				status: 'error',
				message: 'Error: ' + err,
			});
		}

		// const { role, ...user_data } = savedUser;

		// res.status(200).json({
		// 	status: 'success',
		// 	data: [savedUser],
		// 	message:
		// 		'Thank you for registering with us. Your account has been successfully created.',
		// });
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
