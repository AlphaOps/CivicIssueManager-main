import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  issue_id: string;
  user_id: string;
  user_name: string;
  content: string;
  is_official: boolean;
  created_at: Date;
}

const commentSchema = new Schema<IComment>({
  issue_id: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  is_official: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
