// Configuración avanzada de Space Explorer v2.0
// Solo APIs oficiales y verificadas

const CONFIG = {
    // APIs OFICIALES
    apis: {
        // NASA - Agencia espacial estadounidense
        nasa: {
            images: 'https://images-api.nasa.gov/search',
            neo: 'https://api.nasa.gov/neo/rest/v1/feed',
            apod: 'https://api.nasa.gov/planetary/apod',
            earth: 'https://api.nasa.gov/planetary/earth',
            apiKey: 'DEMO_KEY' // Obtén tu clave en api.nasa.gov
        },
        
        // SpaceX - Empresa privada verificada
        spacex: {
            baseUrl: 'https://api.spacexdata.com/v4',
            launches: 'https://api.spacexdata.com/v4/launches',
            rockets: 'https://api.spacexdata.com/v4/rockets',
            capsules: 'https://api.spacexdata.com/v4/capsules'
        },
        
        // Open Notify - Datos públicos ISS
        openNotify: {
            iss: 'http://api.open-notify.org/iss-now.json',
            astronauts: 'http://api.open-notify.org/astros.json',
            passes: 'http://api.open-notify.org/iss-pass.json'
        },
        
        // ESA - Agencia Espacial Europea
        esa: 'https://api.esa.int'
    },

    // Categorías de búsqueda especializadas
    searchCategories: {
        realtime: {
            name: '📡 Datos en Tiempo Real',
            keywords: ['iss', 'estación', 'astronauta', 'órbita', 'ahora', 'vivo'],
            description: 'Información actualizada en tiempo real'
        },
        missions: {
            name: '🚀 Misiones Espaciales',
            keywords: ['misión', 'lanzamiento', 'cohete', 'spacex', 'nasa', 'esa'],
            description: 'Información sobre misiones actuales y futuras'
        },
        satellites: {
            name: '🛰️ Satélites',
            keywords: ['satélite', 'órbita', 'comunicación', 'gps', 'observación'],
            description: 'Datos sobre satélites en órbita'
        },
        exploration: {
            name: '🪐 Exploración',
            keywords: ['marte', 'luna', 'exploración', 'rover', 'planeta', 'sonda'],
            description: 'Misiones de exploración planetaria'
        },
        history: {
            name: '📚 Historia',
            keywords: ['apolo', 'historia', 'descubrimiento', 'hito', 'primero'],
            description: 'Eventos históricos de la exploración espacial'
        }
    },

    // Palabras clave para filtrar búsquedas confiables
    trustedKeywords: [
        'nasa.gov',
        'esa.int',
        'spacex.com',
        'isro.gov.in',
        'cnsa.gov.cn',
        'roscosmos.ru',
        'jaxa.jp',
        'api.open-notify.org',
        'images-api.nasa.gov'
    ],

    // Opciones de búsqueda
    searchOptions: {
        maxResults: 10,
        timeout: 30000,
        sortBy: 'importance', // importance, date, relevance
        filterUnreliable: true, // Eliminar fuentes no verificadas
    },

    // Datos específicos por categoría
    specificData: {
        iss: {
            name: 'Estación Espacial Internacional',
            altitude: '408 km',
            speed: '28,000 km/h',
            orbitPeriod: '90 minutos',
            crew: '7 astronautas (típico)',
            liveTracker: 'https://www.isslive.com'
        },
        hubble: {
            name: 'Telescopio Espacial Hubble',
            altitude: '559 km',
            speed: '7,500 m/s',
            operatingFor: '34 años (desde 1990)',
            discoveries: 'Miles de galaxias, nebulosas, supernovas'
        },
        mars: {
            rovers: ['Perseverance', 'Curiosity'],
            activeRovers: ['Perseverance (2021-actual)', 'Zhurong (China 2021-actual)'],
            pastMissions: ['Spirit', 'Opportunity', 'Sojourner'],
            futureGoals: 'Colonización humana (2040s-2050s)'
        }
    },

    // Configuración de UI
    ui: {
        theme: 'dark-space',
        language: 'es',
        resultsPerPage: 10,
        autoRefresh: true,
        refreshInterval: 30000 // 30 segundos
    },

    // Fuentes de noticias verificadas
    news_sources: [
        'NASA News',
        'ESA News',
        'SpaceX',
        'Spaceflight Now',
        'The Space Review',
        'JAXA'
    ]
};

// Función para obtener configuración
function getConfig(section) {
    return section ? CONFIG[section] : CONFIG;
}

// Función para validar fuente confiable
function isTrustedSource(url) {
    return CONFIG.trustedKeywords.some(keyword => url.includes(keyword));
}

// Exportar para uso en otras partes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
