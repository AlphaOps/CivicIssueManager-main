import express from 'express';
import { z } from 'zod';
import { Issue } from '../models/Issue.js';
import { Notification } from '../models/Notification.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

const createIssueSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.enum(['infrastructure', 'sanitation', 'safety', 'environment', 'utilities', 'transportation', 'other']),
  location: z.string().min(3),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  photo_urls: z.array(z.string().url()).default([]),
});

const updateStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
});

// Get all issues with filters
router.get('/', async (req, res) => {
  try {
    const { category, status, priority, search } = req.query;

    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const issues = await Issue.find(filter).sort({ created_at: -1 });
    res.json(issues);
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get single issue
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
});

// Create issue (authenticated)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = createIssueSchema.parse(req.body);

    const issue = new Issue({
      ...data,
      user_id: req.user!.id,
      user_name: req.body.user_name || req.user!.email,
      status: 'open',
    });

    await issue.save();
    res.status(201).json(issue);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create issue error:', error);
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// Update issue status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = updateStatusSchema.parse(req.body);

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const oldStatus = issue.status;
    issue.status = status;
    issue.updated_at = new Date();

    if (status === 'resolved' && !issue.resolved_at) {
      issue.resolved_at = new Date();
    }

    await issue.save();

    // Create notification
    const notification = new Notification({
      user_id: issue.user_id,
      issue_id: issue._id,
      type: 'status_change',
      message: `Issue "${issue.title}" status changed from ${oldStatus} to ${status}`,
    });
    await notification.save();

    res.json(issue);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Delete issue (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({ error: 'Failed to delete issue' });
  }
});

export default router;
