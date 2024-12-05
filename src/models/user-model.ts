import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Model } from 'mongoose';
import { env } from '../env';

// User interface
interface IUser extends Document {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	role: string;
	generateAccessJWT(): string;
}

// Define the schema
const UserSchema = new mongoose.Schema<IUser>(
	{
		first_name: {
			type: String,
			required: [true, 'Your firstname is required'],
			maxlength: 25,
		},
		last_name: {
			type: String,
			required: [true, 'Your lastname is required'],
			maxlength: 25,
		},
		email: {
			type: String,
			required: [true, 'Your email is required'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Your password is required'],
			select: false,
			maxlength: 25,
		},
		role: {
			type: String,
			required: true,
			default: '0x01',
		},
	},
	{
		timestamps: true,
	}
);

// Pre-save middleware for hashing password
UserSchema.pre('save', function (next) {
	const user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Method to auto gererate JWT when logged in
UserSchema.methods.generateAccessJWT = function () {
	const payload = { id: this._id };

	return jwt.sign(payload, env.SECRET_ACCESS_TOKEN, {
		expiresIn: '20m',
	});
};

const User: Model<IUser> = mongoose.model<IUser>('users', UserSchema);
export default User;
