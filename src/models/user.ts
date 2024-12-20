import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Model } from 'mongoose';
import { env } from '../env';

// Refreh Token Interface
interface IRefreshToken {
	token: string;
	createdAt?: Date;
}

// User Interface
interface IUser extends Document {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	role: string;
	refresh_tokens: IRefreshToken[];
	generateAccessJWT(): string;
	generateRefreshJWT(): string;
}

// Define the schema
const UserSchema = new mongoose.Schema<IUser>(
	{
		first_name: {
			type: String,
			required: [true, 'Firstname is required'],
			maxlength: 25,
		},
		last_name: {
			type: String,
			required: [true, 'Lastname is required'],
			maxlength: 25,
		},
		email: {
			type: String,
			required: [true, 'E-mail is required'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			select: false,
			minlength: 8,
			maxlength: 75, // limit to handle bcrypt hash
		},
		role: {
			type: String,
			required: true,
			default: '0x01', // usual user == 0x01 // admin == 0x88
		},
		refresh_tokens: [
			{
				token: {
					type: String,
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now,
					expires: 7 * 24 * 60 * 60 * 1000, // 7d
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

// Pre-save middleware for hashing password
UserSchema.pre('save', function (next) {
	const user = this;

	if (!user.isModified('password')) return next();

	// Verifica se a senha já parece ser uma hash do bcrypt
	const bcryptRegex = /^\$2[aby]?\$.{56}$/; // Formato típico de uma hash do bcrypt
	if (bcryptRegex.test(user.password)) {
		return next(); // A senha já está encriptada, não precisa fazer nada
	}

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
	const accessToken = jwt.sign(payload, env.SECRET_ACCESS_TOKEN, {
		expiresIn: '20m',
	});

	return accessToken;
};

// Method to auto gererate refresh JWT when logged in
UserSchema.methods.generateRefreshJWT = function () {
	const payload = { id: this._id };
	const refreshToken = jwt.sign(payload, env.SECRET_REFRESH_TOKEN, {
		expiresIn: '7d',
	});

	return refreshToken;
};

const User: Model<IUser> = mongoose.model<IUser>('users', UserSchema);
export default User;
