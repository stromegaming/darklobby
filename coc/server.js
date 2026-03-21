const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

// Render को दुवै सम्भावित नामहरू चेक गर्छ
const API_TOKEN = process.env.COC_API_TOKEN || process.env.SUPERCELL_API_TOKEN;
const PROXY_URL = 'https://api.clashofclans.com/v1';

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

// Current War API
app.get('/api/clan/:tag/currentwar', async (req, res) => {
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const clanTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/clans/${clanTag}/currentwar`;
    
    try {
        const response = await fetch(url, { 
            headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' }
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// =========================================================================
// NEWLY ADDED ALL POSSIBLE COC API ENDPOINTS (बिना कुनै पुरानो कोड परिवर्तन)
// =========================================================================

// 1. Search Clans
app.get('/api/clans', async (req, res) => {
    const queryString = new URLSearchParams(req.query).toString();
    const url = queryString ? `${PROXY_URL}/clans?${queryString}` : `${PROXY_URL}/clans`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// 2. Clan Members List
app.get('/api/clan/:tag/members', async (req, res) => {
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const clanTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/clans/${clanTag}/members`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// 3. Clan War Log
app.get('/api/clan/:tag/warlog', async (req, res) => {
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const clanTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/clans/${clanTag}/warlog`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// 4. Clan War League Group (CWL)
app.get('/api/clan/:tag/leaguegroup', async (req, res) => {
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const clanTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/clans/${clanTag}/currentwar/leaguegroup`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// 5. Clan Capital Raid Seasons
app.get('/api/clan/:tag/capitalraidseasons', async (req, res) => {
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const clanTag = encodeURIComponent('#' + rawTag);
    const queryString = new URLSearchParams(req.query).toString();
    const url = queryString ? `${PROXY_URL}/clans/${clanTag}/capitalraidseasons?${queryString}` : `${PROXY_URL}/clans/${clanTag}/capitalraidseasons`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// 6. CWL War Details
app.get('/api/clanwarleagues/wars/:warTag', async (req, res) => {
    const rawTag = req.params.warTag.toUpperCase().replace(/#/g, '');
    const warTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/clanwarleagues/wars/${warTag}`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// 7. Gold Pass Season
app.get('/api/goldpass/seasons/current', async (req, res) => {
    const url = `${PROXY_URL}/goldpass/seasons/current`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// 8. Labels (Players / Clans)
app.get('/api/labels/:type', async (req, res) => {
    const type = req.params.type; // expected: 'players' or 'clans'
    const url = `${PROXY_URL}/labels/${type}`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// 9. Locations & Rankings
app.get('/api/locations', async (req, res) => {
    const queryString = new URLSearchParams(req.query).toString();
    const url = queryString ? `${PROXY_URL}/locations?${queryString}` : `${PROXY_URL}/locations`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

app.get('/api/locations/:locationId', async (req, res) => {
    const url = `${PROXY_URL}/locations/${req.params.locationId}`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

app.get('/api/locations/:locationId/rankings/:rankingType', async (req, res) => {
    // rankingType: clans, players, clans-versus, players-versus, capitals
    const { locationId, rankingType } = req.params;
    const queryString = new URLSearchParams(req.query).toString();
    const url = queryString ? `${PROXY_URL}/locations/${locationId}/rankings/${rankingType}?${queryString}` : `${PROXY_URL}/locations/${locationId}/rankings/${rankingType}`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

// 10. Leagues (Standard, War, Capital, Builder Base)
const leagueTypes = ['leagues', 'warleagues', 'capitalleagues', 'builderbaseleagues'];
leagueTypes.forEach(league => {
    app.get(`/api/${league}`, async (req, res) => {
        const queryString = new URLSearchParams(req.query).toString();
        const url = queryString ? `${PROXY_URL}/${league}?${queryString}` : `${PROXY_URL}/${league}`;
        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
            const data = await response.json();
            if (!response.ok) return res.status(response.status).json(data);
            res.json(data);
        } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
    });

    app.get(`/api/${league}/:leagueId`, async (req, res) => {
        const url = `${PROXY_URL}/${league}/${req.params.leagueId}`;
        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
            const data = await response.json();
            if (!response.ok) return res.status(response.status).json(data);
            res.json(data);
        } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
    });
});

// 11. League Seasons (Standard Leagues only)
app.get('/api/leagues/:leagueId/seasons', async (req, res) => {
    const url = `${PROXY_URL}/leagues/${req.params.leagueId}/seasons`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

app.get('/api/leagues/:leagueId/seasons/:seasonId', async (req, res) => {
    const queryString = new URLSearchParams(req.query).toString();
    const url = queryString ? `${PROXY_URL}/leagues/${req.params.leagueId}/seasons/${req.params.seasonId}?${queryString}` : `${PROXY_URL}/leagues/${req.params.leagueId}/seasons/${req.params.seasonId}`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' } });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { res.status(500).json({ error: 'Proxy connection failed' }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});