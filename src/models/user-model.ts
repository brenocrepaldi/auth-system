import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export type UserType = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	role: string;
};

const UserSchema = new mongoose.Schema(
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

export default mongoose.model('users', UserSchema);
