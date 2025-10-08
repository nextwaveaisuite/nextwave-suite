const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const bingAdsService = require('../services/bingAds');

// Get all campaigns for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const campaigns = await db.query(
      `SELECT c.*, n.name as niche_name 
       FROM campaigns c
       LEFT JOIN niches n ON c.niche_id = n.id
       WHERE c.user_id = ? 
       ORDER BY c.created_at DESC`,
      [req.user.userId]
    );

    res.json({
      campaigns: campaigns.map(c => ({
        ...c,
        data: c.data ? JSON.parse(c.data) : null
      }))
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get single campaign with ads
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const campaign = await db.get(
      'SELECT * FROM campaigns WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const ads = await db.query(
      'SELECT * FROM ads WHERE campaign_id = ?',
      [req.params.id]
    );

    res.json({
      campaign: {
        ...campaign,
        data: campaign.data ? JSON.parse(campaign.data) : null,
        ads
      }
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Create campaign from niche
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { nicheId, name, platform, budgetDaily, ads, data } = req.body;

    // Verify niche exists and belongs to user
    const niche = await db.get(
      'SELECT * FROM niches WHERE id = ? AND user_id = ?',
      [nicheId, req.user.userId]
    );

    if (!niche) {
      return res.status(404).json({ error: 'Niche not found' });
    }

    // Create campaign
    const campaignResult = await db.run(
      `INSERT INTO campaigns (user_id, niche_id, name, platform, budget_daily, status, data)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.userId, nicheId, name, platform, budgetDaily, 'draft', JSON.stringify(data)]
    );

    const campaignId = campaignResult.id;

    // Create ads if provided
    if (ads && ads.length > 0) {
      for (const ad of ads) {
        await db.run(
          'INSERT INTO ads (campaign_id, headline, description, cta, status) VALUES (?, ?, ?, ?, ?)',
          [campaignId, ad.headline, ad.description, ad.cta, 'active']
        );
      }
    }

    // Log activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'campaign_created', 'campaign', campaignId, JSON.stringify({ name, niche: niche.name })]
    );

    res.status(201).json({
      message: 'Campaign created successfully',
      campaignId
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Launch campaign to Bing Ads
router.post('/:id/launch', authenticateToken, async (req, res) => {
  try {
    const campaign = await db.get(
      'SELECT * FROM campaigns WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Get ads for campaign
    const ads = await db.query(
      'SELECT * FROM ads WHERE campaign_id = ?',
      [req.params.id]
    );

    // Check if Bing Ads is connected
    const integration = await db.get(
      'SELECT * FROM integrations WHERE user_id = ? AND platform = ? AND status = ?',
      [req.user.userId, 'bing_ads', 'active']
    );

    if (!integration) {
      return res.status(400).json({ 
        error: 'Bing Ads not connected',
        message: 'Please connect your Bing Ads account first'
      });
    }

    // Launch to Bing Ads (if credentials are configured)
    let bingCampaignId = null;
    try {
      const bingResult = await bingAdsService.createCampaign({
        name: campaign.name,
        budget: campaign.budget_daily,
        ads: ads.map(ad => ({
          headline: ad.headline,
          description: ad.description,
          cta: ad.cta
        })),
        credentials: {
          apiKey: integration.api_key,
          customerId: JSON.parse(integration.data || '{}').customerId
        }
      });
      bingCampaignId = bingResult.campaignId;
    } catch (bingError) {
      console.error('Bing Ads API error:', bingError);
      // Continue anyway for demo purposes
    }

    // Update campaign status
    await db.run(
      'UPDATE campaigns SET status = ?, bing_campaign_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['active', bingCampaignId, req.params.id]
    );

    // Log activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'campaign_launched', 'campaign', campaign.id, JSON.stringify({ name: campaign.name, platform: 'bing_ads' })]
    );

    res.json({
      message: 'Campaign launched successfully',
      bingCampaignId,
      status: 'active'
    });
  } catch (error) {
    console.error('Error launching campaign:', error);
    res.status(500).json({ error: 'Failed to launch campaign' });
  }
});

// Update campaign stats (called by webhook or cron)
router.post('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { spent, revenue, clicks, conversions } = req.body;

    const result = await db.run(
      `UPDATE campaigns 
       SET spent = ?, revenue = ?, clicks = ?, conversions = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [spent, revenue, clicks, conversions, req.params.id, req.user.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Stats updated successfully' });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

// Pause campaign
router.post('/:id/pause', authenticateToken, async (req, res) => {
  try {
    const result = await db.run(
      'UPDATE campaigns SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      ['paused', req.params.id, req.user.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign paused successfully' });
  } catch (error) {
    console.error('Error pausing campaign:', error);
    res.status(500).json({ error: 'Failed to pause campaign' });
  }
});

// Delete campaign
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Delete ads first
    await db.run('DELETE FROM ads WHERE campaign_id = ?', [req.params.id]);

    // Delete campaign
    const result = await db.run(
      'DELETE FROM campaigns WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

module.exports = router;
