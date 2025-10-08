import mongoose, { Document, Schema } from 'mongoose';

export interface IIssue extends Document {
  user_id: string;
  user_name: string;
  title: string;
  description: string;
  category: 'infrastructure' | 'sanitation' | 'safety' | 'environment' | 'utilities' | 'transportation' | 'other';
  location: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  photo_urls: string[];
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
}

const issueSchema = new Schema<IIssue>({
  user_id: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['infrastructure', 'sanitation', 'safety', 'environment', 'utilities', 'transportation', 'other'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  photo_urls: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  resolved_at: {
    type: Date,
  },
});

issueSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

export const Issue = mongoose.model<IIssue>('Issue', issueSchema);
