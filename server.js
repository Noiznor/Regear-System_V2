const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------- Middleware ----------------
app.use(cors({
  origin: "https://maharlika-regear-system.vercel.app", // frontend on Vercel
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.static('dist')); // Serve built frontend

// ---------------- File paths ----------------
const CSV_FILE_PATH = path.join(__dirname, 'public', 'members.csv');
const UPDATES_FILE_PATH = path.join(__dirname, 'member-updates.json');

// ---------------- In-memory updates ----------------
let memberUpdates = {};

async function loadMemberUpdates() {
  try {
    const data = await fs.readFile(UPDATES_FILE_PATH, 'utf8');
    memberUpdates = JSON.parse(data);
  } catch {
    console.log('No existing member updates file, starting fresh');
    memberUpdates = {};
  }
}

async function saveMemberUpdates() {
  try {
    await fs.writeFile(UPDATES_FILE_PATH, JSON.stringify(memberUpdates, null, 2));
  } catch (error) {
    console.error('Error saving member updates:', error);
  }
}

// ---------------- API Routes ----------------

// Get all members
app.get('/api/members', async (req, res) => {
  try {
    const members = [];
    const fileContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
    const lines = fileContent.split('\n');

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.includes('#NAME?')) {
        const values = line.split(',');
        if (values.length >= 3 && values[0]) {
          const memberName = values[0].trim();
          const memberUpdate = memberUpdates[memberName];

          members.push({
            name: memberName,
            id: values[1].trim(),
            guildName: values[2].trim(),
            role: memberUpdate?.role || 'villager',
            tier: memberUpdate?.tier || 1,
          });
        }
      }
    }

    res.json(members);
  } catch (error) {
    console.error('Error reading members:', error);
    res.status(500).json({ error: 'Failed to load members' });
  }
});

// Update member (POST)
app.post('/api/members/:memberName', async (req, res) => {
  return updateMemberHandler(req, res);
});

// Update member (PUT) → matches your frontend
app.put('/api/members/:memberName', async (req, res) => {
  return updateMemberHandler(req, res);
});

// Shared update handler
async function updateMemberHandler(req, res) {
  try {
    const { memberName } = req.params;
    const { role, tier } = req.body;

    const validRoles = ['tank', 'dps', 'support', 'healer', 'villager', 'bsquad'];
    const validTiers = [1, 2, 3, 4];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    memberUpdates[memberName] = { role, tier };
    await saveMemberUpdates();

    res.json({ success: true, message: `Updated ${memberName} to ${role} tier ${tier}` });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
}

// Stats endpoint
app.get('/api/members/stats', async (req, res) => {
  try {
    const roleStats = { tank: 0, dps: 0, support: 0, healer: 0, villager: 0, bsquad: 0 };
    const tierStats = { 1: 0, 2: 0, 3: 0, 4: 0 };

    const fileContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
    const lines = fileContent.split('\n');

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.includes('#NAME?')) {
        const values = line.split(',');
        if (values.length >= 3 && values[0]) {
          const memberName = values[0].trim();
          const memberUpdate = memberUpdates[memberName];

          const role = memberUpdate?.role || 'villager';
          const tier = memberUpdate?.tier || 1;

          roleStats[role]++;
          tierStats[tier]++;
        }
      }
    }

    res.json({ roleStats, tierStats });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ---------------- Start server ----------------
async function startServer() {
  await loadMemberUpdates();
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/members`);
  });
}

startServer().catch(console.error);
