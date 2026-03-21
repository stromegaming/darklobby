const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

// Render को दुवै सम्भावित नामहरू चेक गर्छ
const API_TOKEN = process.env.COC_API_TOKEN || process.env.SUPERCELL_API_TOKEN;
const PROXY_URL = 'https://cocproxy.com/v1';

app.get('/api/player/:tag', async (req, res) => {
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const playerTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/players/${playerTag}`;
    
    if (!API_TOKEN) {
        console.error("❌ ERROR: No API Token found in Render environment variables!");
        return res.status(500).json({ error: "Server has no API Token configured" });
    }

    try {
        const response = await fetch(url, { 
            headers: { 
                'Authorization': `Bearer ${API_TOKEN}`, 
                'Accept': 'application/json' 
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ Supercell API Rejected (Status: ${response.status})`);
            console.error("Details:", JSON.stringify(data));
            return res.status(response.status).json({ 
                error: "Proxy rejected your token/request", 
                status: response.status,
                details: data 
            });
        }

        res.json(data);
    } catch (error) { 
        console.error('💥 Crash Error:', error.message);
        res.status(500).json({ error: 'Proxy connection failed', message: error.message }); 
    }
});

// Clan Search API
app.get('/api/clan/:tag', async (req, res) => {
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const clanTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/clans/${clanTag}`;
    
    try {
        const response = await fetch(url, { 
            headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' }
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});