const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

// Middleware to check if user is owner/admin
const requireAdmin = async (req, res, next) => {
  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.userId]);
    
    if (!user || user.role !== 'owner') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

// ============================================
// SYSTEM SETTINGS
// ============================================

// Get system settings
router.get('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await db.get('SELECT * FROM system_settings WHERE id = 1');
    res.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update system settings
router.put('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      accessMode, // 'public', 'private', 'invite_only', 'request_only'
      allowRegistration,
      requireEmailVerification,
      maintenanceMode,
      product1Enabled,
      product2Enabled,
      product3Enabled,
      maxUsersPerTier
    } = req.body;

    await db.run(
      `UPDATE system_settings 
       SET access_mode = ?, allow_registration = ?, require_email_verification = ?,
           maintenance_mode = ?, product1_enabled = ?, product2_enabled = ?, 
           product3_enabled = ?, max_users_per_tier = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [accessMode, allowRegistration, requireEmailVerification, maintenanceMode,
       product1Enabled, product2Enabled, product3Enabled, JSON.stringify(maxUsersPerTier)]
    );

    // Log activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, details) VALUES (?, ?, ?, ?)',
      [req.user.userId, 'settings_updated', 'system', JSON.stringify(req.body)]
    );

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, tier, search, page = 1, limit = 50 } = req.query;
    
    let query = 'SELECT id, email, role, subscription_tier, status, created_at, last_login, trial_ends_at FROM users WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (tier) {
      query += ' AND subscription_tier = ?';
      params.push(tier);
    }

    if (search) {
      query += ' AND email LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const users = await db.query(query, params);

    // Get total count
    const countResult = await db.get('SELECT COUNT(*) as total FROM users');

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, email, role, subscription_tier, status, created_at, last_login, trial_ends_at, metadata FROM users WHERE id = ?',
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's activity
    const activity = await db.query(
      'SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.params.id]
    );

    // Get user's stats
    const nicheCount = await db.get('SELECT COUNT(*) as count FROM niches WHERE user_id = ?', [req.params.id]);
    const campaignCount = await db.get('SELECT COUNT(*) as count FROM campaigns WHERE user_id = ?', [req.params.id]);

    res.json({
      user: {
        ...user,
        metadata: user.metadata ? JSON.parse(user.metadata) : null
      },
      stats: {
        niches: nicheCount.count,
        campaigns: campaignCount.count
      },
      recentActivity: activity
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { subscriptionTier, status, role, metadata } = req.body;

    await db.run(
      `UPDATE users 
       SET subscription_tier = ?, status = ?, role = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [subscriptionTier, status, role, JSON.stringify(metadata), req.params.id]
    );

    // Log activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'user_updated', 'user', req.params.id, JSON.stringify(req.body)]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Prevent deleting owner account
    const user = await db.get('SELECT role FROM users WHERE id = ?', [req.params.id]);
    if (user.role === 'owner') {
      return res.status(403).json({ error: 'Cannot delete owner account' });
    }

    // Delete user's data
    await db.run('DELETE FROM niches WHERE user_id = ?', [req.params.id]);
    await db.run('DELETE FROM campaigns WHERE user_id = ?', [req.params.id]);
    await db.run('DELETE FROM integrations WHERE user_id = ?', [req.params.id]);
    await db.run('DELETE FROM activity_log WHERE user_id = ?', [req.params.id]);
    await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ============================================
// ACCESS REQUESTS
// ============================================

// Get pending access requests
router.get('/access-requests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const requests = await db.query(
      `SELECT * FROM access_requests 
       WHERE status = 'pending' 
       ORDER BY created_at DESC`
    );

    res.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Approve access request
router.post('/access-requests/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const request = await db.get('SELECT * FROM access_requests WHERE id = ?', [req.params.id]);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update request status
    await db.run(
      'UPDATE access_requests SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['approved', req.user.userId, req.params.id]
    );

    // Update user status
    await db.run(
      'UPDATE users SET status = ? WHERE email = ?',
      ['active', request.email]
    );

    // Log activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'access_approved', 'access_request', req.params.id, JSON.stringify({ email: request.email })]
    );

    res.json({ message: 'Access request approved' });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

// Reject access request
router.post('/access-requests/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    await db.run(
      'UPDATE access_requests SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, rejection_reason = ? WHERE id = ?',
      ['rejected', req.user.userId, reason, req.params.id]
    );

    res.json({ message: 'Access request rejected' });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

// ============================================
// INVITATIONS
// ============================================

// Get all invitations
router.get('/invitations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const invitations = await db.query(
      'SELECT * FROM invitations ORDER BY created_at DESC'
    );

    res.json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
});

// Create invitation
router.post('/invitations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, subscriptionTier, expiresInDays, message } = req.body;

    // Generate invitation code
    const code = crypto.randomBytes(16).toString('hex');
    
    // Calculate expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 7));

    const result = await db.run(
      `INSERT INTO invitations (email, code, subscription_tier, expires_at, message, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, code, subscriptionTier, expiresAt.toISOString(), message, req.user.userId]
    );

    // Log activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'invitation_created', 'invitation', result.id, JSON.stringify({ email, tier: subscriptionTier })]
    );

    res.status(201).json({
      message: 'Invitation created successfully',
      invitationId: result.id,
      code,
      inviteUrl: `${process.env.FRONTEND_URL}/register?invite=${code}`
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ error: 'Failed to create invitation' });
  }
});

// Revoke invitation
router.delete('/invitations/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.run(
      'UPDATE invitations SET status = ? WHERE id = ?',
      ['revoked', req.params.id]
    );

    res.json({ message: 'Invitation revoked successfully' });
  } catch (error) {
    console.error('Error revoking invitation:', error);
    res.status(500).json({ error: 'Failed to revoke invitation' });
  }
});

// ============================================
// ANALYTICS & STATS
// ============================================

// Get dashboard stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // User stats
    const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
    const activeUsers = await db.get('SELECT COUNT(*) as count FROM users WHERE status = ?', ['active']);
    const pendingRequests = await db.get('SELECT COUNT(*) as count FROM access_requests WHERE status = ?', ['pending']);
    
    // Content stats
    const totalNiches = await db.get('SELECT COUNT(*) as count FROM niches');
    const totalCampaigns = await db.get('SELECT COUNT(*) as count FROM campaigns');
    const activeCampaigns = await db.get('SELECT COUNT(*) as count FROM campaigns WHERE status = ?', ['active']);
    
    // Revenue stats (if applicable)
    const totalRevenue = await db.get('SELECT SUM(revenue) as total FROM campaigns');
    
    // Recent activity
    const recentActivity = await db.query(
      'SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 20'
    );

    // User growth (last 30 days)
    const userGrowth = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM users 
       WHERE created_at >= date('now', '-30 days')
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );

    // Subscription distribution
    const subscriptionDist = await db.query(
      'SELECT subscription_tier, COUNT(*) as count FROM users GROUP BY subscription_tier'
    );

    res.json({
      stats: {
        users: {
          total: totalUsers.count,
          active: activeUsers.count,
          pendingRequests: pendingRequests.count
        },
        content: {
          niches: totalNiches.count,
          campaigns: totalCampaigns.count,
          activeCampaigns: activeCampaigns.count
        },
        revenue: {
          total: totalRevenue.total || 0
        }
      },
      recentActivity,
      userGrowth,
      subscriptionDist
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get activity log
router.get('/activity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 100, userId, action } = req.query;
    
    let query = 'SELECT * FROM activity_log WHERE 1=1';
    const params = [];

    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    if (action) {
      query += ' AND action = ?';
      params.push(action);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const activity = await db.query(query, params);

    res.json({ activity });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// ============================================
// PRODUCT CONTROLS
// ============================================

// Get product settings
router.get('/products/:productId/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await db.get(
      'SELECT * FROM product_settings WHERE product_id = ?',
      [req.params.productId]
    );

    res.json({ settings });
  } catch (error) {
    console.error('Error fetching product settings:', error);
    res.status(500).json({ error: 'Failed to fetch product settings' });
  }
});

// Update product settings
router.put('/products/:productId/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { enabled, accessMode, features, limits } = req.body;

    await db.run(
      `UPDATE product_settings 
       SET enabled = ?, access_mode = ?, features = ?, limits = ?, updated_at = CURRENT_TIMESTAMP
       WHERE product_id = ?`,
      [enabled, accessMode, JSON.stringify(features), JSON.stringify(limits), req.params.productId]
    );

    res.json({ message: 'Product settings updated successfully' });
  } catch (error) {
    console.error('Error updating product settings:', error);
    res.status(500).json({ error: 'Failed to update product settings' });
  }
});

module.exports = router;
