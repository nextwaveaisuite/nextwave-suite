const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const trendDiscoveryService = require('../services/trendDiscovery');

// Discover new trends (Product 3)
router.get('/discover', authenticateToken, async (req, res) => {
  try {
    const { sources } = req.query; // e.g., 'clickbank,google_trends,reddit'

    // Run discovery across multiple sources
    const discoveries = await trendDiscoveryService.discover(sources ? sources.split(',') : ['all']);

    // Save to database
    for (const trend of discoveries) {
      await db.run(
        `INSERT INTO trends (niche_name, source, trend_score, search_volume, competition_level, data)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [trend.name, trend.source, trend.score, trend.searchVolume, trend.competition, JSON.stringify(trend.data)]
      );
    }

    // Log activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, details) VALUES (?, ?, ?, ?)',
      [req.user.userId, 'trends_discovered', 'trend', JSON.stringify({ count: discoveries.length, sources })]
    );

    res.json({
      message: `Discovered ${discoveries.length} new trends`,
      trends: discoveries
    });
  } catch (error) {
    console.error('Error discovering trends:', error);
    res.status(500).json({ error: 'Failed to discover trends' });
  }
});

// Get recent trends
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, source } = req.query;

    let query = 'SELECT * FROM trends';
    const params = [];

    if (source) {
      query += ' WHERE source = ?';
      params.push(source);
    }

    query += ' ORDER BY discovered_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const trends = await db.query(query, params);

    res.json({
      trends: trends.map(t => ({
        ...t,
        data: t.data ? JSON.parse(t.data) : null
      }))
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Export trend to NicheFinder (Product 1)
router.post('/:id/export', authenticateToken, async (req, res) => {
  try {
    const trend = await db.get('SELECT * FROM trends WHERE id = ?', [req.params.id]);

    if (!trend) {
      return res.status(404).json({ error: 'Trend not found' });
    }

    // Create niche from trend
    const nicheResult = await db.run(
      `INSERT INTO niches (user_id, name, category, opportunity_score, commission, roi_week1, difficulty, cpc_estimate, competition_level, data, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        trend.niche_name,
        'discovered',
        trend.trend_score,
        0, // Will be enriched later
        0, // Will be enriched later
        trend.competition_level,
        0, // Will be enriched later
        trend.competition_level,
        trend.data,
        `trendscout_${trend.source}`
      ]
    );

    // Log activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'trend_exported', 'trend', trend.id, JSON.stringify({ name: trend.niche_name, destination: 'nichefinder' })]
    );

    res.json({
      message: 'Trend exported to NicheFinder successfully',
      nicheId: nicheResult.id
    });
  } catch (error) {
    console.error('Error exporting trend:', error);
    res.status(500).json({ error: 'Failed to export trend' });
  }
});

// Scan ClickBank marketplace
router.get('/scan/clickbank', authenticateToken, async (req, res) => {
  try {
    const products = await trendDiscoveryService.scanClickBank();

    res.json({
      message: `Found ${products.length} trending ClickBank products`,
      products
    });
  } catch (error) {
    console.error('Error scanning ClickBank:', error);
    res.status(500).json({ error: 'Failed to scan ClickBank' });
  }
});

// Scan Google Trends
router.get('/scan/google-trends', authenticateToken, async (req, res) => {
  try {
    const { keywords } = req.query;

    const trends = await trendDiscoveryService.scanGoogleTrends(keywords ? keywords.split(',') : null);

    res.json({
      message: `Found ${trends.length} trending topics`,
      trends
    });
  } catch (error) {
    console.error('Error scanning Google Trends:', error);
    res.status(500).json({ error: 'Failed to scan Google Trends' });
  }
});

// Scan Reddit
router.get('/scan/reddit', authenticateToken, async (req, res) => {
  try {
    const { subreddits } = req.query;

    const discussions = await trendDiscoveryService.scanReddit(subreddits ? subreddits.split(',') : null);

    res.json({
      message: `Found ${discussions.length} trending discussions`,
      discussions
    });
  } catch (error) {
    console.error('Error scanning Reddit:', error);
    res.status(500).json({ error: 'Failed to scan Reddit' });
  }
});

module.exports = router;
