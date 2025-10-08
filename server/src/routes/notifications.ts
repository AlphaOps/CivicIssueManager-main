import express, { Response } from 'express';
import { Notification } from '../models/Notification.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ user_id: req.user!.id }).sort({ created_at: -1 });
    res.json(notifications);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user!.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all as read
router.patch('/read-all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany({ user_id: req.user!.id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

export default router;
