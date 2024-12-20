import express from 'express';
import { check } from 'express-validator';
import { Register } from '../controllers/register';
import { Validate } from '../middleware/validate';
import { Login } from '../controllers/login';
import { Verify, VerifyRole } from '../middleware/verify';
import { Logout } from '../controllers/logout';
import { Refresh } from '../middleware/refresh';

const router = express.Router();

// Home route - only logged in users can access
router.get('/', Verify, (req, res) => {
	try {
		res.status(200).json({
			status: 'success',
			message: 'Home route.',
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			message: 'Internal Server Error',
		});
	}
});

// Register route == POST request
router.post(
	'/register',
	check('email')
		.isEmail()
		.withMessage('Valid email address needed')
		.normalizeEmail(),
	check('name')
		.not()
		.isEmpty()
		.withMessage('Name is required')
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
		.withMessage('Valid email address needed')
		.normalizeEmail(),
	check('password').not().isEmpty(),
	Validate,
	Login
);

// Logout route == GET request
router.get('/logout', Logout);

// Route that only admin user can access == GET request
router.get('/admin', Verify, VerifyRole, (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'Admin route.',
	});
});

// Refresh Token route == POST request
router.post('/refresh', Refresh);

export default router;
