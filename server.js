const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve built React app

// Path to CSV file - Railway persistent storage
const CSV_FILE_PATH = path.join(__dirname, 'public', 'members.csv');

// In-memory storage for member updates
let memberUpdates = {};

// Railway persistent storage path
const UPDATES_FILE_PATH = path.join(__dirname, 'member-updates.json');

async function loadMemberUpdates() {
  try {
    const data = await fs.readFile(UPDATES_FILE_PATH, 'utf8');
    memberUpdates = JSON.parse(data);
    console.log('✅ Member updates loaded successfully');
  } catch (error) {
    console.log('📝 No existing member updates file, starting fresh');
    memberUpdates = {};
  }
}

async function saveMemberUpdates() {
  try {
    await fs.writeFile(UPDATES_FILE_PATH, JSON.stringify(memberUpdates, null, 2));
    console.log('💾 Member updates saved successfully');
  } catch (error) {
    console.error('Error saving member updates:', error);
  }
}

// API endpoint to get all members with their updated roles/tiers
app.get('/api/members', async (req, res) => {
  try {
    const members = [];
    const fileContent = await fs.readFile(CSV_FILE_PATH, 'utf8');
    const lines = fileContent.split('\n');
    
    // Skip header line
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
            tier: memberUpdate?.tier || 1
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

// API endpoint to update a member's role and tier
app.post('/api/members/:memberName', async (req, res) => {
  try {
    const { memberName } = req.params;
    const { role, tier } = req.body;
    
    // Validate input
    const validRoles = ['tank', 'dps', 'support', 'healer', 'villager', 'bsquad'];
    const validTiers = [1, 2, 3, 4];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }
    
    // Update member data
    memberUpdates[memberName] = { role, tier };
    
    // Save to persistent storage
    await saveMemberUpdates();
    
    res.json({ 
      success: true, 
      message: `Updated ${memberName} to ${role} tier ${tier}` 
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// API endpoint to get member statistics
app.get('/api/members/stats', async (req, res) => {
  try {
    const roleStats = {
      tank: 0,
      dps: 0,
      support: 0,
      healer: 0,
      villager: 0,
      bsquad: 0
    };
    
    const tierStats = { 1: 0, 2: 0, 3: 0, 4: 0 };
    
    // Read CSV and apply updates
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

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Initialize and start server
async function startServer() {
  await loadMemberUpdates();
  
  app.listen(PORT, () => {
    console.log(`🚀 Maharlika Regear System Server running on port ${PORT}`);
    console.log(`🌐 Frontend: ${process.env.RAILWAY_STATIC_URL || `http://localhost:${PORT}`}`);
    console.log(`📡 API: ${process.env.RAILWAY_STATIC_URL || `http://localhost:${PORT}`}/api/members`);
    console.log(`💾 Data persistence: ${UPDATES_FILE_PATH}`);
  });
}

startServer().catch(console.error);
