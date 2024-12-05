import mongoose from 'mongoose';
import { env } from '../env';

// Connect with database
export async function connectDB() {
	try {
		// Set up mongoose's promise to use global promise
		mongoose.Promise = global.Promise;
		mongoose.set('strictQuery', false);

		await mongoose.connect(env.URI);
		console.log('Connected to database');
	} catch (error) {
		console.error('Database connection error:', error);
	}
}
