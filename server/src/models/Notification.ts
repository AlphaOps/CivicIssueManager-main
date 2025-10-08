import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user_id: string;
  issue_id: string;
  type: 'status_change' | 'comment' | 'assignment';
  message: string;
  read: boolean;
  created_at: Date;
}

const notificationSchema = new Schema<INotification>({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  issue_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['status_change', 'comment', 'assignment'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
