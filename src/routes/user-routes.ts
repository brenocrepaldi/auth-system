import { Router } from 'express';
import { dbCollections } from '../db/index';

const router = Router();

// Get all users
router.get('/', async (req, res) => {
	try {
		const courses = await dbCollections.user.find().toArray();
		res.status(200).json(courses);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch courses', details: error.message });
	}
});

export default router;
