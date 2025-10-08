const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all niches for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const niches = await db.query(
      'SELECT * FROM niches WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json({
      niches: niches.map(n => ({
        ...n,
        data: n.data ? JSON.parse(n.data) : null
      }))
    });
  } catch (error) {
    console.error('Error fetching niches:', error);
    res.status(500).json({ error: 'Failed to fetch niches' });
  }
});

// Get single niche
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const niche = await db.get(
      'SELECT * FROM niches WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (!niche) {
      return res.status(404).json({ error: 'Niche not found' });
    }

    res.json({
      niche: {
        ...niche,
        data: niche.data ? JSON.parse(niche.data) : null
      }
    });
  } catch (error) {
    console.error('Error fetching niche:', error);
    res.status(500).json({ error: 'Failed to fetch niche' });
  }
});

// Create/Import niche (from TrendScout)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, category, opportunityScore, commission, roiWeek1, difficulty, cpcEstimate, competitionLevel, data, source } = req.body;

    const result = await db.run(
      `INSERT INTO niches (user_id, name, category, opportunity_score, commission, roi_week1, difficulty, cpc_estimate, competition_level, data, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.userId, name, category, opportunityScore, commission, roiWeek1, difficulty, cpcEstimate, competitionLevel, JSON.stringify(data), source || 'manual']
    );

    // Log activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'niche_created', 'niche', result.id, JSON.stringify({ name, source })]
    );

    res.status(201).json({
      message: 'Niche created successfully',
      nicheId: result.id
    });
  } catch (error) {
    console.error('Error creating niche:', error);
    res.status(500).json({ error: 'Failed to create niche' });
  }
});

// Export niche to CampaignMaster (Product 2)
router.post('/:id/export', authenticateToken, async (req, res) => {
  try {
    const niche = await db.get(
      'SELECT * FROM niches WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (!niche) {
      return res.status(404).json({ error: 'Niche not found' });
    }

    // Log export activity
    await db.run(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, 'niche_exported', 'niche', niche.id, JSON.stringify({ name: niche.name, destination: 'campaignmaster' })]
    );

    res.json({
      message: 'Niche exported successfully',
      niche: {
        ...niche,
        data: niche.data ? JSON.parse(niche.data) : null
      }
    });
  } catch (error) {
    console.error('Error exporting niche:', error);
    res.status(500).json({ error: 'Failed to export niche' });
  }
});

// Update niche
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, category, opportunityScore, commission, roiWeek1, difficulty, cpcEstimate, competitionLevel, data } = req.body;

    const result = await db.run(
      `UPDATE niches 
       SET name = ?, category = ?, opportunity_score = ?, commission = ?, roi_week1 = ?, 
           difficulty = ?, cpc_estimate = ?, competition_level = ?, data = ?
       WHERE id = ? AND user_id = ?`,
      [name, category, opportunityScore, commission, roiWeek1, difficulty, cpcEstimate, competitionLevel, JSON.stringify(data), req.params.id, req.user.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Niche not found' });
    }

    res.json({ message: 'Niche updated successfully' });
  } catch (error) {
    console.error('Error updating niche:', error);
    res.status(500).json({ error: 'Failed to update niche' });
  }
});

// Delete niche
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.run(
      'DELETE FROM niches WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Niche not found' });
    }

    res.json({ message: 'Niche deleted successfully' });
  } catch (error) {
    console.error('Error deleting niche:', error);
    res.status(500).json({ error: 'Failed to delete niche' });
  }
});

module.exports = router;
