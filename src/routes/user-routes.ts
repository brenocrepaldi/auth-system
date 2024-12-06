import express from 'express';
import { check } from 'express-validator';
import { Register } from '../controllers/register';
import { Validate } from '../middleware/validate';
import { Login } from '../controllers/login';
import { Verify, VerifyRole } from '../middleware/verify';

const router = express.Router();

// home route
router.get('/', (req, res) => {
	try {
		res.status(200).json({
			status: 'success',
			data: [],
			message: 'Welcome to the Auth API homepage!',
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			message: 'Internal Server Error',
		});
	}
});

// home route logged in
router.get('/', Verify, (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'Welcome to the your Dashboard!',
	});
});

// Register route == POST request
router.post(
	'/register',
	check('email')
		.isEmail()
		.withMessage('Enter a valid email address')
		.normalizeEmail(),
	check('first_name')
		.not()
		.isEmpty()
		.withMessage('You first name is required')
		.trim()
		.escape(),
	check('last_name')
		.not()
		.isEmpty()
		.withMessage('You last name is required')
		.trim()
		.escape(),
	check('password')
		.notEmpty()
		.isLength({ min: 8 })
		.withMessage('Must be at least 8 chars long'),
	Validate,
	Register
);

// Login route == POST request
router.post(
	'/login',
	check('email')
		.isEmail()
		.withMessage('Enter a valid email address')
		.normalizeEmail(),
	check('password').not().isEmpty(),
	Validate,
	Login
);

// Route that only admin user can access
router.get('/admin', Verify, VerifyRole, (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'Welcome to the Admin portal!',
	});
});

export default router;
