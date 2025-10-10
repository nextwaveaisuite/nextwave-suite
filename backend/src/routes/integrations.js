const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all integrations for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const integrations = await db.query(
      'SELECT id, platform, status, created_at, updated_at FROM integrations WHERE user_id = ?',
      [req.user.userId]
    );

    res.json({ integrations });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

// Connect ClickBank
router.post('/clickbank/connect', authenticateToken, async (req, res) => {
  try {
    const { apiKey, accountNickname } = req.body;

    if (!apiKey || !accountNickname) {
      return res.status(400).json({ error: 'API key and account nickname required' });
    }

    // Check if already connected
    const existing = await db.get(
      'SELECT id FROM integrations WHERE user_id = ? AND platform = ?',
      [req.user.userId, 'clickbank']
    );

    if (existing) {
      // Update existing
      await db.run(
        'UPDATE integrations SET api_key = ?, data = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [apiKey, JSON.stringify({ accountNickname }), 'active', existing.id]
      );
    } else {
      // Create new
      await db.run(
        'INSERT INTO integrations (user_id, platform, api_key, data, status) VALUES (?, ?, ?, ?, ?)',
        [req.user.userId, 'clickbank', apiKey, JSON.stringify({ accountNickname }), 'active']
      );
    }

    res.json({ message: 'ClickBank connected successfully' });
  } catch (error) {
    console.error('Error connecting ClickBank:', error);
    res.status(500).json({ error: 'Failed to connect ClickBank' });
  }
});

// Connect Bing Ads
router.post('/bing/connect', authenticateToken, async (req, res) => {
  try {
    const { apiKey, customerId, accountId } = req.body;

    if (!apiKey || !customerId) {
      return res.status(400).json({ error: 'API key and customer ID required' });
    }

    // Check if already connected
    const existing = await db.get(
      'SELECT id FROM integrations WHERE user_id = ? AND platform = ?',
      [req.user.userId, 'bing_ads']
    );

    if (existing) {
      // Update existing
      await db.run(
        'UPDATE integrations SET api_key = ?, data = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [apiKey, JSON.stringify({ customerId, accountId }), 'active', existing.id]
      );
    } else {
      // Create new
      await db.run(
        'INSERT INTO integrations (user_id, platform, api_key, data, status) VALUES (?, ?, ?, ?, ?)',
        [req.user.userId, 'bing_ads', apiKey, JSON.stringify({ customerId, accountId }), 'active']
      );
    }

    res.json({ message: 'Bing Ads connected successfully' });
  } catch (error) {
    console.error('Error connecting Bing Ads:', error);
    res.status(500).json({ error: 'Failed to connect Bing Ads' });
  }
});

// Connect Facebook Ads
router.post('/facebook/connect', authenticateToken, async (req, res) => {
  try {
    const { accessToken, adAccountId } = req.body;

    if (!accessToken || !adAccountId) {
      return res.status(400).json({ error: 'Access token and ad account ID required' });
    }

    // Check if already connected
    const existing = await db.get(
      'SELECT id FROM integrations WHERE user_id = ? AND platform = ?',
      [req.user.userId, 'facebook_ads']
    );

    if (existing) {
      await db.run(
        'UPDATE integrations SET access_token = ?, data = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [accessToken, JSON.stringify({ adAccountId }), 'active', existing.id]
      );
    } else {
      await db.run(
        'INSERT INTO integrations (user_id, platform, access_token, data, status) VALUES (?, ?, ?, ?, ?)',
        [req.user.userId, 'facebook_ads', accessToken, JSON.stringify({ adAccountId }), 'active']
      );
    }

    res.json({ message: 'Facebook Ads connected successfully' });
  } catch (error) {
    console.error('Error connecting Facebook Ads:', error);
    res.status(500).json({ error: 'Failed to connect Facebook Ads' });
  }
});

// Connect Google Ads
router.post('/google/connect', authenticateToken, async (req, res) => {
  try {
    const { clientId, clientSecret, refreshToken, customerId } = req.body;

    if (!clientId || !clientSecret || !refreshToken || !customerId) {
      return res.status(400).json({ error: 'All credentials required' });
    }

    // Check if already connected
    const existing = await db.get(
      'SELECT id FROM integrations WHERE user_id = ? AND platform = ?',
      [req.user.userId, 'google_ads']
    );

    if (existing) {
      await db.run(
        'UPDATE integrations SET api_key = ?, api_secret = ?, refresh_token = ?, data = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [clientId, clientSecret, refreshToken, JSON.stringify({ customerId }), 'active', existing.id]
      );
    } else {
      await db.run(
        'INSERT INTO integrations (user_id, platform, api_key, api_secret, refresh_token, data, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.user.userId, 'google_ads', clientId, clientSecret, refreshToken, JSON.stringify({ customerId }), 'active']
      );
    }

    res.json({ message: 'Google Ads connected successfully' });
  } catch (error) {
    console.error('Error connecting Google Ads:', error);
    res.status(500).json({ error: 'Failed to connect Google Ads' });
  }
});

// Disconnect integration
router.delete('/:platform', authenticateToken, async (req, res) => {
  try {
    const result = await db.run(
      'UPDATE integrations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND platform = ?',
      ['disconnected', req.user.userId, req.params.platform]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    res.json({ message: `${req.params.platform} disconnected successfully` });
  } catch (error) {
    console.error('Error disconnecting integration:', error);
    res.status(500).json({ error: 'Failed to disconnect integration' });
  }
});

// Test integration connection
router.get('/:platform/test', authenticateToken, async (req, res) => {
  try {
    const integration = await db.get(
      'SELECT * FROM integrations WHERE user_id = ? AND platform = ? AND status = ?',
      [req.user.userId, req.params.platform, 'active']
    );

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found or not active' });
    }

    // Here you would test the actual API connection
    // For now, just return success
    res.json({ 
      message: 'Integration is active',
      platform: req.params.platform,
      status: 'connected'
    });
  } catch (error) {
    console.error('Error testing integration:', error);
    res.status(500).json({ error: 'Failed to test integration' });
  }
});

module.exports = router;
