import express from 'express';
import { z } from 'zod';
import { Comment } from '../models/Comment.js';
import { Issue } from '../models/Issue.js';
import { Notification } from '../models/Notification.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

const createCommentSchema = z.object({
  content: z.string().min(1),
});

// Get comments for an issue
router.get('/issue/:issueId', async (req, res) => {
  try {
    const comments = await Comment.find({ issue_id: req.params.issueId }).sort({ created_at: 1 });
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create comment (authenticated)
router.post('/issue/:issueId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { content } = createCommentSchema.parse(req.body);

    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const comment = new Comment({
      issue_id: req.params.issueId,
      user_id: req.user!.id,
      user_name: req.body.user_name || req.user!.email,
      content,
      is_official: req.user!.role === 'admin',
    });

    await comment.save();

    // Create notification for issue owner if commenter is different
    if (issue.user_id !== req.user!.id) {
      const notification = new Notification({
        user_id: issue.user_id,
        issue_id: issue._id,
        type: 'comment',
        message: `${comment.user_name} commented on your issue "${issue.title}"`,
      });
      await notification.save();
    }

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

export default router;
