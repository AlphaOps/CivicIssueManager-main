import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  full_name: string;
  role: 'citizen' | 'admin';
  created_at: Date;
}

const userSchema = new Schema<IUser>({
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
  full_name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['citizen', 'admin'],
    default: 'citizen',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
