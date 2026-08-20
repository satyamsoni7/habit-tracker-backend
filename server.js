const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function filePath(id) {
  // only allow simple ids like "A" or "B" — prevents writing outside the data folder
  const safe = String(id).replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safe) throw new Error('invalid id');
  return path.join(DATA_DIR, `tracker-${safe}.json`);
}

// Health check
app.get('/', (req, res) => {
  res.send('Habit tracker backend is running. Use /api/tracker/:id to read or save data.');
});

// Get saved data for a tracker (A or B)
app.get('/api/tracker/:id', (req, res) => {
  try {
    const fp = filePath(req.params.id);
    if (!fs.existsSync(fp)) return res.status(404).json({ error: 'not found' });
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || 'could not read data' });
  }
});

// Save data for a tracker (A or B) — overwrites with the latest full state
app.post('/api/tracker/:id', (req, res) => {
  try {
    const fp = filePath(req.params.id);
    fs.writeFileSync(fp, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (e) {
    res.status(400).json({ error: e.message || 'could not save data' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Habit tracker backend listening on port ${PORT}`);
});
