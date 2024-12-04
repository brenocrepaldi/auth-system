import { env } from '../env';

const { MongoClient } = require('mongodb');

const uri = env.URI;

export const client = new MongoClient(uri);

export const db = client.db('auth-system');

export const dbCollections = {
	user: db.collection('user'),
};

export async function connectDB() {
	try {
		await client.connect(); // Connects to the cluster
		console.log('Connected to database');
		return client;
	} catch (error) {
		console.error('Failed to connect to MongoDB', error);
		throw error;
	}
}
