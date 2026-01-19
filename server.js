// Configuración del servidor Node.js para la app de búsqueda espacial
// Este archivo es opcional si quieres un servidor backend

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Variables de API
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Rutas de búsqueda

// Búsqueda general con Google
app.get('/api/search/google', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter required' });
        }

        const query = `${q} space satellites missions`;
        
        if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
            return res.json({
                message: 'Configure Google API keys for full functionality',
                mockResults: generateMockResults(q)
            });
        }

        const url = `https://www.googleapis.com/customsearch/v1`;
        const response = await axios.get(url, {
            params: {
                key: GOOGLE_API_KEY,
                cx: GOOGLE_SEARCH_ENGINE_ID,
                q: query
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Google Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Búsqueda en NASA
app.get('/api/search/nasa', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter required' });
        }

        const url = 'https://images-api.nasa.gov/search';
        const response = await axios.get(url, {
            params: {
                q: q,
                media_type: 'image'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('NASA Search error:', error);
        res.status(500).json({ error: 'NASA search failed' });
    }
});

// Búsqueda de SpaceX
app.get('/api/search/spacex', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Query parameter required' });
        }

        // SpaceX API pública
        const response = await axios.get('https://api.spacexdata.com/v4/launches', {
            params: { limit: 10 }
        });

        // Filtrar por término de búsqueda
        const filtered = response.data.filter(launch =>
            launch.name.toLowerCase().includes(q.toLowerCase())
        );

        res.json(filtered);
    } catch (error) {
        console.error('SpaceX Search error:', error);
        res.status(500).json({ error: 'SpaceX search failed' });
    }
});

// Búsqueda integrada (múltiples fuentes)
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter required' });
        }

        // Ejecutar búsquedas en paralelo
        const [googleResults, nasaResults, spaceXResults] = await Promise.all([
            searchGoogle(q),
            searchNASA(q),
            searchSpaceX(q)
        ]);

        res.json({
            google: googleResults,
            nasa: nasaResults,
            spacex: spaceXResults
        });
    } catch (error) {
        console.error('Combined search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Historial de búsquedas (si usas una BD)
app.post('/api/search-history', async (req, res) => {
    try {
        const { query } = req.body;
        // Aquí podrías guardar en BD
        res.json({ success: true, message: 'Search saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save search' });
    }
});

// Funciones auxiliares

async function searchGoogle(query) {
    try {
        if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
            return generateMockResults(query);
        }

        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: GOOGLE_API_KEY,
                cx: GOOGLE_SEARCH_ENGINE_ID,
                q: `${query} space`
            }
        });

        return response.data.items || [];
    } catch (error) {
        console.error('Google search error:', error);
        return [];
    }
}

async function searchNASA(query) {
    try {
        const response = await axios.get('https://images-api.nasa.gov/search', {
            params: {
                q: query,
                media_type: 'image'
            }
        });

        return response.data.collection.items || [];
    } catch (error) {
        console.error('NASA search error:', error);
        return [];
    }
}

async function searchSpaceX(query) {
    try {
        const response = await axios.get('https://api.spacexdata.com/v4/launches');
        
        return response.data
            .filter(launch => launch.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
    } catch (error) {
        console.error('SpaceX search error:', error);
        return [];
    }
}

function generateMockResults(query) {
    return [
        {
            title: `${query} - Información espacial`,
            snippet: `Resultados sobre ${query} en contexto de exploración espacial`,
            link: `https://www.google.com/search?q=${encodeURIComponent(query + ' space')}`
        }
    ];
}

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Space Explorer server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}`);
});

module.exports = app;
