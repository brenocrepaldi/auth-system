import { validationResult } from 'express-validator';

export const Validate = (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = errors.array().map((err) => err.msg);

			return res.status(422).json({
				status: 'failed',
				errors: error,
				message: 'Validation errors occurred.',
			});
		}
	} catch (error) {
		return res.status(500).json({
			status: 'failed',
			errors: error,
			message: 'Validation errors occurred.',
		});
	} finally {
		next();
	}
};
