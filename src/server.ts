import express from 'express';

import { env } from './env';
import { connectDB } from './db';

import userRoutes from './routes/user-routes';

const app = express();

// Middleware to use routes
app.use(express.json());

// Routes
app.use('/user', userRoutes);

// Database connection
connectDB()
	.then(() => {
		app.listen({ port: env.PORT }, () => {
			console.log('Server running...');
		});
	})
	.catch((error) => {
		console.error(
			'Failed to start the server due to database connection issues',
			error
		);
		process.exit(1); // Ends process in case of critical error
	});
