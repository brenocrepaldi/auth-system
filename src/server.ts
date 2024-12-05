import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { connectDB } from './db';
import { env } from './env';

import userRoutes from './routes/user-routes';

// Creates server
const server = express();

// Configures Header information
server.use(cors()); // Allow request from any source (restrict in production)
server.disable('x-powered-by'); // Reduce fingerprinting.
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// Configures user routes
server.use('/user', userRoutes);

connectDB()
	.catch((err) => console.error(err))
	.then(() => {
		server.listen(env.PORT, () => {
			console.log(`Server running on http://localhost:${env.PORT}`);
		});
	})
	.catch((err) => console.error(err));
