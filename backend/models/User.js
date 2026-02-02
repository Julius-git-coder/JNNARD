import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String, // URL from Cloudinary
            default: '',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String, // 4-digit code
        },
        otpExpires: {
            type: Date,
        },
        role: {
            type: String,
            enum: ['admin', 'worker'],
            default: 'worker',
        },
        workerProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
