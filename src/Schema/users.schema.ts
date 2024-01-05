import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    googleid: { type: String },
    otp : { type: String },
    refreshToken: { type: String },
    tasks: { type: Array , ref: 'Task' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
    FacebookAccessToken: { type: String },
    provider: { type: String }
});