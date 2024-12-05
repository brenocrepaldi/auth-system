import User from '../models/user-model';

/**
 * @route POST user/register
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
			const existingUser = await User.findOne({
				email: newUser.email,
			});

			if (existingUser)
				return res.status(400).json({
					status: 'failed',
					data: [],
					message: 'User already has an account',
				});
		} catch (error) {
			return res.status(500).json({
				status: 'failed',
				data: [],
				message: 'Error fetching user: ' + error,
			});
		}

		try {
			// save new user into the database
			const savedUser = (await newUser.save()).toObject();
			const { password, role, ...user_data } = savedUser;

			res.status(200).json({
				status: 'success',
				data: [user_data],
				message: 'User registered',
			});
		} catch (err) {
			res.status(500).json({
				status: 'error',
				message: 'Error: ' + err,
			});
		}
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
