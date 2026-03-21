const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

// Render को Environment Variable बाट तान्छ, छैन भने hardcoded प्रयोग गर्छ
const API_TOKEN = process.env.COC_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImYyYTY3Y2I4LTM2NTMtNGJkNi04ZGY0LTA1OWIwMmQ0ZGVjOSIsImlhdCI6MTc3NDA4MzcxNywic3ViIjoiZGV2ZWxvcGVyL2EwNzk3ZTZhLTVkZWEtZTUwZC02NTZkLTkyZTdlMmVlOGNlYyIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjAuMC4wLjAiXSwidHlwZSI6ImNsaWVudCJ9XX0.K-OHrLylUeKL9LWNQoOPsH8h_n9EWMJz5VLKgZ4iNSMf44oW3XpoeaFLIW6Akf7nOj2L5novcYR7J7RVQpiI0g';
const PROXY_URL = 'https://cocproxy.com/v1';

app.get('/api/player/:tag', async (req, res) => {
    const rawTag = req.params.tag.toUpperCase().replace(/#/g, '');
    const playerTag = encodeURIComponent('#' + rawTag);
    const url = `${PROXY_URL}/players/${playerTag}`;
    
    console.log(`Searching for Player: ${rawTag}`);

    try {
        const response = await fetch(url, { 
            headers: { 
                'Authorization': `Bearer ${API_TOKEN}`, 
                'Accept': 'application/json' 
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`API Error: ${response.status}`, data); // Render Logs मा देखिन्छ
            return res.status(response.status).json({ 
                error: 'API rejected the request', 
                status: response.status,
                details: data 
            });
        }

        res.json(data);
    } catch (error) { 
        console.error('Fetch Crash:', error.message);
        res.status(500).json({ error: 'Proxy connection failed', message: error.message }); 
    }
});

// Clan Search API (यसलाई पनि त्यसरी नै मिलाइएको छ)
app.get('/api/clan/:tag', async (req, res) => {
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
        if (!response.ok) return res.status(response.status).json(data);
        res.json(data);
    } catch (error) { 
        res.status(500).json({ error: 'Proxy connection failed' }); 
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});