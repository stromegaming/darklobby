const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

// 1. CORS enable garne
app.use(cors());

// 2. API Token (Step 1 ma banako Naya Token yaha halnuhos)
const API_TOKEN = process.env.COC_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImYyYTY3Y2I4LTM2NTMtNGJkNi04ZGY0LTA1OWIwMmQ0ZGVjOSIsImlhdCI6MTc3NDA4MzcxNywic3ViIjoiZGV2ZWxvcGVyL2EwNzk3ZTZhLTVkZWEtZTUwZC02NTZkLTkyZTdlMmVlOGNlYyIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjAuMC4wLjAiXSwidHlwZSI6ImNsaWVudCJ9XX0.K-OHrLylUeKL9LWNQoOPsH8h_n9EWMJz5VLKgZ4iNSMf44oW3XpoeaFLIW6Akf7nOj2L5novcYR7J7RVQpiI0g'; 

// --- PERMANENT PROXY URL ---
const PROXY_URL = 'https://cocproxy.com/v1'; 
// ---------------------------

// Clan Search API
app.get('/api/clan/:tag', async (req, res) => {
    // Tag fix: # lai encoding milayera pathaune
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const clanTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/clans/${clanTag}`;
    
    try {
        const response = await fetch(url, { 
            headers: { 
                'Authorization': `Bearer ${API_TOKEN}`, 
                'Accept': 'application/json' 
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) { 
        res.status(500).json({ error: 'Proxy connection failed' }); 
    }
});

// Player Search API
app.get('/api/player/:tag', async (req, res) => {
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const playerTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/players/${playerTag}`;
    
    try {
        const response = await fetch(url, { 
            headers: { 
                'Authorization': `Bearer ${API_TOKEN}`, 
                'Accept': 'application/json' 
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) { 
        res.status(500).json({ error: 'Proxy connection failed' }); 
    }
});

// 3. Render ko lagi dynamic PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running with PERMANENT PROXY on port ${PORT}`);
});