import { Router } from 'express';
import { check } from 'express-validator';
import { Register } from '../controllers/auth';
import { dbCollections } from '../db/index';
import { Validate } from '../middleware/validate';

const router = Router();

// Get all users
router.get('/', async (req, res) => {
	try {
		const courses = await dbCollections.users.find().toArray();
		res.status(200).json(courses);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch courses', details: error.message });
	}
});

// Register new user
router.post(
	'/register',
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
	check('email')
		.isEmail()
		.withMessage('Enter a valid email address')
		.normalizeEmail(),
	check('password')
		.notEmpty()
		.isLength({ min: 8 })
		.withMessage('Must be at least 8 chars long'),
	Validate,
	Register
);

export default router;
