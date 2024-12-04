import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { env } from './env';
import { connectDB } from './db';
import userRoutes from './routes/user-routes';

const server = express();

// HEADER information
server.use(cors());
server.disable('x-powered-by'); // Reduce fingerprinting
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// Middleware to use routes
server.use(express.json());

// Routes
server.use('/user', userRoutes);
server.get('/', (req, res) => {
	try {
		res.status(200).json({
			status: 'success',
			data: [],
			message: 'homepage',
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			message: 'Internal Server Error',
		});
	}
});

// Database connection
connectDB()
	.then(() => {
		server.listen({ port: env.PORT }, () => {
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
