import { dbService } from '../services/database.js';

// GET /api/categories
export async function getCategories(req, res) {
  try {
    const { status = 'active' } = req.query;
    const categories = await dbService.getCategories({ status });
    return res.json({ categories });
  } catch (err) {
    console.error('[Error getCategories]:', err);
    return res.status(500).json({ error: 'Failed to retrieve categories' });
  }
}
