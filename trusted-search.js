function normalizeTrustedQuery(query) {
    return (query || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function queryIncludesAny(normalizedQuery, terms) {
    return terms.some(term => normalizedQuery.includes(term));
}

function formatTrustedSources(sources) {
    return sources.map(source => `• ${source.name}: ${source.url}`).join('\n');
}

function buildTrustedResult(title, query, body, sources, extra) {
    const primarySource = sources[0] || { name: 'NASA', url: 'https://www.nasa.gov/' };
    const description = [
        body,
        '',
        '📚 FUENTES OFICIALES RECOMENDADAS:',
        formatTrustedSources(sources)
    ].join('\n');

    return {
        title: `📚 ${title}`,
        description,
        url: primarySource.url,
        source: `📚 Base temática verificada - ${primarySource.name}`,
        type: 'trusted',
        importance: 'critical',
        query,
        data: extra || {}
    };
}

function buildAcademicResult(query, normalizedQuery) {
    const officialSiteMatches = [];

    if (normalizedQuery.includes('site:nasa.gov')) {
        officialSiteMatches.push({ name: 'NASA Search', url: `https://www.nasa.gov/search/?q=${encodeURIComponent(query)}` });
    }
    if (normalizedQuery.includes('site:esa.int')) {
        officialSiteMatches.push({ name: 'ESA Search', url: `https://www.esa.int/content/search?SearchText=${encodeURIComponent(query.replace(/site:esa\.int/gi, '').trim())}` });
    }
    if (normalizedQuery.includes('site:noaa.gov')) {
        officialSiteMatches.push({ name: 'NOAA Search', url: `https://www.noaa.gov/search?search_api_fulltext=${encodeURIComponent(query.replace(/site:noaa\.gov/gi, '').trim())}` });
    }
    if (normalizedQuery.includes('site:europa.eu')) {
        officialSiteMatches.push({ name: 'Copernicus / EU Search', url: `https://www.copernicus.eu/en/search/site/${encodeURIComponent(query.replace(/site:europa\.eu/gi, '').trim())}` });
    }

    const sources = officialSiteMatches.length > 0 ? officialSiteMatches : [
        { name: 'arXiv', url: `https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all&source=header` },
        { name: 'NASA Technical Reports Server', url: `https://ntrs.nasa.gov/search?q=${encodeURIComponent(query)}` },
        { name: 'ESA Library', url: `https://www.esa.int/content/search?SearchText=${encodeURIComponent(query)}` },
        { name: 'UNOOSA', url: 'https://www.unoosa.org/' }
    ];

    const body = [
        `Consulta académica detectada para "${query}". Esta búsqueda se enruta a repositorios fiables y literatura técnica en lugar de depender solo de resultados generalistas.`,
        '• Usa arXiv para preprints y revisiones técnicas recientes.',
        '• Usa NASA NTRS, ESA y UNOOSA para documentación institucional y estándares.',
        '• Para mitigación de basura espacial, prioriza IADC, NASA ODPO, ESA Space Debris Office y directrices ONU.',
        '• Si la consulta incluye filetype:pdf o site:, conviene abrir directamente el portal oficial correspondiente.'
    ].join('\n');

    return buildTrustedResult('Ruta académica y documental fiable', query, body, sources, {
        tipo: 'Búsqueda académica',
        prioridad: 'Repositorios oficiales y literatura técnica'
    });
}

function buildTrustedSearchResult(query) {
    const normalizedQuery = normalizeTrustedQuery(query);

    if (!normalizedQuery) {
        return null;
    }

    const academicTerms = [
        'review paper', 'scientific article', 'research paper', 'pdf', 'filetype:pdf',
        'site:nasa.gov', 'site:esa.int', 'site:noaa.gov', 'site:europa.eu', 'scholar.google.com',
        'guidelines', 'environment report', 'risk models', 'end of life disposal',
        'traffic management', 'scientific', 'article', 'paper', 'space debris environment report',
        'active debris removal review', 'kessler syndrome scientific article', 'low earth orbit congestion',
        'orbital traffic management', 'satellite collision risk', 'debris mitigation guidelines'
    ];

    if (queryIncludesAny(normalizedQuery, academicTerms)) {
        return buildAcademicResult(query, normalizedQuery);
    }

    if (queryIncludesAny(normalizedQuery, ['agujero negro', 'agujeros negros', 'horizonte de sucesos', 'horizonte de eventos', 'schwarzschild', 'singularidad'])) {
        const body = [
            `La consulta "${query}" trata sobre agujeros negros, uno de los fenómenos más extremos de la relatividad general.`,
            '• Un agujero negro es una región donde la gravedad es tan intensa que ni la luz puede escapar una vez cruzado el horizonte de sucesos.',
            '• Los agujeros negros estelares nacen del colapso de estrellas masivas; los supermasivos residen en centros galácticos.',
            '• Se detectan por acreción, lentes gravitatorias, dinámica orbital y ondas gravitacionales.',
            '• Las fuentes más fiables son NASA, ESA, ESO y publicaciones observacionales como EHT y LIGO/Virgo/KAGRA.'
        ].join('\n');

        return buildTrustedResult('Agujeros negros y relatividad extrema', query, body, [
            { name: 'NASA Black Holes', url: 'https://science.nasa.gov/universe/black-holes/' },
            { name: 'ESA Science', url: 'https://sci.esa.int/' },
            { name: 'ESO', url: 'https://www.eso.org/' },
            { name: 'Event Horizon Telescope', url: 'https://eventhorizontelescope.org/' }
        ], {
            campo: 'Astrofísica relativista',
            conceptos: 'Horizonte de sucesos, singularidad, acreción'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['starlink', 'mega constelaciones', 'constelacion de satelites', 'constelaciones de satelites'])) {
        const body = [
            `La consulta "${query}" se centra en Starlink o mega constelaciones de satélites LEO.`,
            '• Starlink usa miles de satélites en órbita baja para ofrecer internet con menor latencia que GEO.',
            '• El beneficio principal es conectividad global; el coste sistémico está en congestión orbital, brillo satelital e impacto astronómico.',
            '• El análisis fiable debe contrastar documentación de operador, reguladores y literatura astronómica.',
            '• Los temas críticos son evitación de colisiones, desorbitado al final de vida y contaminación del cielo nocturno.'
        ].join('\n');

        return buildTrustedResult('Starlink y mega constelaciones LEO', query, body, [
            { name: 'Starlink', url: 'https://www.starlink.com/' },
            { name: 'FCC', url: 'https://www.fcc.gov/' },
            { name: 'ESA Space Debris', url: 'https://www.esa.int/Safety_Security/Space_Debris' },
            { name: 'IAU CPS', url: 'https://cps.iau.org/' }
        ], {
            orbita: 'LEO',
            foco: 'Internet satelital, congestión orbital y astronomía'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['gps', 'galileo', 'glonass', 'beidou', 'gnss'])) {
        const body = [
            `La consulta "${query}" entra en sistemas GNSS.`,
            '• GPS, Galileo, GLONASS y BeiDou son constelaciones de navegación y sincronización temporal.',
            '• La posición se estima midiendo tiempos de propagación desde múltiples satélites y resolviendo trilateración.',
            '• Los errores vienen de geometría satelital, atmósfera, rebotes de señal y calidad del receptor.',
            '• Galileo es el sistema civil europeo; GPS sigue siendo referencia global por adopción masiva.'
        ].join('\n');

        return buildTrustedResult('GPS, Galileo y navegación GNSS', query, body, [
            { name: 'GPS.gov', url: 'https://www.gps.gov/' },
            { name: 'Galileo', url: 'https://www.gsc-europa.eu/' },
            { name: 'ESA Navigation', url: 'https://www.esa.int/Applications/Navigation' },
            { name: 'UNOOSA GNSS', url: 'https://www.unoosa.org/' }
        ], {
            uso: 'Posición, navegación y tiempo',
            sistemas: 'GPS, Galileo, GLONASS, BeiDou'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['kessler', 'sindrome de kessler'])) {
        const body = [
            `La consulta "${query}" trata sobre el síndrome de Kessler.`,
            '• Es un escenario en el que la densidad de objetos en órbita provoca colisiones en cascada y crea aún más fragmentos.',
            '• El mayor riesgo está en regiones congestionadas de LEO, donde operan muchas constelaciones y satélites de observación.',
            '• No es solo un concepto teórico: guía políticas de mitigación, diseño al final de vida y maniobras preventivas.',
            '• NASA, ESA e IADC son las referencias principales para entender el riesgo y las medidas de mitigación.'
        ].join('\n');

        return buildTrustedResult('Síndrome de Kessler y cascadas de colisión', query, body, [
            { name: 'NASA Orbital Debris', url: 'https://orbitaldebris.jsc.nasa.gov/' },
            { name: 'ESA Space Debris', url: 'https://www.esa.int/Safety_Security/Space_Debris' },
            { name: 'IADC', url: 'https://www.iadc-home.org/' },
            { name: 'UNOOSA', url: 'https://www.unoosa.org/' }
        ], {
            riesgo: 'Colisiones en cascada',
            region: 'LEO congestionada'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['derecho espacial', 'tratado del espacio exterior', 'tratados sobre el espacio exterior', 'responsabilidad por danos', 'responsabilidad por daños', 'gobernanza del espacio'])) {
        const body = [
            `La consulta "${query}" se refiere a derecho espacial internacional.`,
            '• El marco base incluye el Tratado del Espacio Exterior de 1967 y el Convenio sobre Responsabilidad por Daños causados por Objetos Espaciales.',
            '• Aunque operen empresas privadas, los Estados mantienen responsabilidad internacional por objetos lanzados bajo su jurisdicción.',
            '• Las directrices modernas se enfocan en sostenibilidad, mitigación de basura espacial y conducta responsable en órbita.',
            '• Para precisión jurídica, la referencia principal es UNOOSA y la documentación de la ONU sobre space law.'
        ].join('\n');

        return buildTrustedResult('Derecho espacial internacional', query, body, [
            { name: 'UNOOSA Space Law', url: 'https://www.unoosa.org/oosa/en/ourwork/spacelaw/index.html' },
            { name: 'UN Treaties', url: 'https://www.unoosa.org/oosa/en/ourwork/spacelaw/treaties.html' },
            { name: 'UN Long-term Sustainability', url: 'https://www.unoosa.org/oosa/en/ourwork/topics/longterm-sustainability-of-outer-space-activities.html' },
            { name: 'IADC', url: 'https://www.iadc-home.org/' }
        ], {
            base_juridica: 'Tratados ONU + responsabilidad internacional',
            foco: 'Gobernanza y sostenibilidad orbital'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['basura espacial', 'desechos espaciales', 'space debris', 'orbital debris', 'space junk', 'kessler', 'chatarra espacial', 'colision espacial', 'colisiones en el espacio', 'restos de cohetes'])) {
        const body = [
            `La consulta "${query}" pertenece al área de basura espacial y seguridad orbital. La información fiable sobre este tema debe apoyarse en NASA Orbital Debris Program Office, ESA Space Debris Office, UNOOSA e IADC.`,
            '• La basura espacial incluye satélites inactivos, etapas de cohetes y fragmentos de colisión o explosión.',
            '• El mayor riesgo está en LEO, donde la densidad de objetos, constelaciones y fragmentos es mucho mayor.',
            '• El síndrome de Kessler describe una cascada de colisiones capaz de degradar regiones orbitales útiles.',
            '• La mitigación incluye diseño al final de vida, pasivación, maniobras de evitación y retirada activa.'
        ].join('\n');

        return buildTrustedResult('Basura espacial y riesgo orbital', query, body, [
            { name: 'NASA Orbital Debris Program Office', url: 'https://orbitaldebris.jsc.nasa.gov/' },
            { name: 'ESA Space Debris Office', url: 'https://www.esa.int/Safety_Security/Space_Debris' },
            { name: 'UNOOSA Space Law / Sustainability', url: 'https://www.unoosa.org/' },
            { name: 'IADC', url: 'https://www.iadc-home.org/' }
        ], {
            region_orbital: 'LEO y zonas congestionadas',
            fiabilidad: 'Fuentes institucionales'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['seguimiento', 'space situational awareness', 'ssa', 'surveillance', 'tracking', 'norad', 'objeto en orbita', 'objetos en orbita', 'satelite pasa sobre mi casa', 'mapas de basura espacial', 'reentradas'])) {
        const body = [
            `La consulta "${query}" se refiere a seguimiento espacial y vigilancia orbital. El marco fiable aquí es SSA/SST: observación por radar, telescopios, catálogos y análisis de conjunciones.`,
            '• NORAD / Space-Track, ESA SST y redes nacionales mantienen catálogos de objetos orbitando la Tierra.',
            '• Los radares detectan objetos pequeños en LEO y los telescopios son clave para GEO y órbitas altas.',
            '• El seguimiento en tiempo real combina efemérides, TLE y modelos de propagación orbital.',
            '• Las alertas de conjunción ayudan a evitar colisiones con satélites activos y estaciones espaciales.'
        ].join('\n');

        return buildTrustedResult('Seguimiento espacial y SSA', query, body, [
            { name: 'Space-Track', url: 'https://www.space-track.org/' },
            { name: 'ESA Space Safety / SST', url: 'https://www.esa.int/Safety_Security/Space_Safety' },
            { name: 'CelesTrak', url: 'https://celestrak.org/' },
            { name: 'NASA', url: 'https://www.nasa.gov/' }
        ], {
            sistema: 'SSA / SST',
            uso: 'Prevención de colisiones y seguimiento orbital'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['limpiar', 'active debris removal', 'adr', 'clearspace', 'removedebris', 'redes para capturar', 'arpones', 'laser', 'laseres', 'remolcadores espaciales', 'velas de arrastre', 'desorbitado controlado', 'mitigacion de basura espacial', 'prevencion de colisiones'])) {
        const body = [
            `La consulta "${query}" trata sobre mitigación y retirada activa de desechos espaciales. Este es uno de los campos más importantes de sostenibilidad espacial actual.`,
            '• Las técnicas estudiadas incluyen redes, arpones, brazos robóticos, velas de arrastre, acoplamiento y remolcadores.',
            '• RemoveDEBRIS validó demostraciones clave para ADR y ClearSpace es una misión emblemática de retirada activa.',
            '• La opción más eficaz a corto plazo suele ser prevenir: pasivar, desorbitar o trasladar a órbita cementerio al final de vida.',
            '• La viabilidad depende de coste, responsabilidad legal, identificación del propietario y riesgo operacional.'
        ].join('\n');

        return buildTrustedResult('Soluciones de limpieza y mitigación orbital', query, body, [
            { name: 'ESA ClearSpace', url: 'https://www.esa.int/Safety_Security/Space_Safety/ClearSpace-1' },
            { name: 'RemoveDEBRIS', url: 'https://www.surrey.ac.uk/surrey-space-centre/missions/removedebris' },
            { name: 'NASA Orbital Debris', url: 'https://orbitaldebris.jsc.nasa.gov/' },
            { name: 'IADC Guidelines', url: 'https://www.iadc-home.org/' }
        ], {
            enfoque: 'Mitigación + ADR',
            estado: 'Tecnologías en desarrollo y demostración'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['legislacion', 'derecho espacial', 'tratados', 'onu', 'responsable', 'regulacion', 'regulacion de satelites', 'normas de desorbitado', 'sostenibilidad espacial normativa', 'gobernanza del espacio', 'militarizacion del espacio'])) {
        const body = [
            `La consulta "${query}" entra en derecho espacial y gobernanza. La referencia base es el Tratado del Espacio Exterior de 1967 y el marco de responsabilidad internacional posterior.`,
            '• Los Estados siguen siendo responsables internacionalmente por los objetos espaciales lanzados bajo su jurisdicción.',
            '• El Convenio de Responsabilidad regula daños causados por objetos espaciales.',
            '• Las directrices ONU e IADC orientan mitigación de desechos y sostenibilidad a largo plazo.',
            '• El gran reto actual es adaptar el marco legal al crecimiento de constelaciones privadas y tráfico orbital.'
        ].join('\n');

        return buildTrustedResult('Derecho espacial, regulación y sostenibilidad', query, body, [
            { name: 'UNOOSA Space Law', url: 'https://www.unoosa.org/oosa/en/ourwork/spacelaw/index.html' },
            { name: 'UN Long-term Sustainability Guidelines', url: 'https://www.unoosa.org/oosa/en/ourwork/topics/longterm-sustainability-of-outer-space-activities.html' },
            { name: 'IADC', url: 'https://www.iadc-home.org/' },
            { name: 'ESA Space Safety', url: 'https://www.esa.int/Safety_Security/Space_Safety' }
        ], {
            marco: 'Tratados ONU + convenios + directrices técnicas',
            foco: 'Responsabilidad, mitigación y sostenibilidad'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['economia espacial', 'industria de satelites', 'mercado global', 'coste de lanzamiento', 'negocio de las constelaciones', 'impacto economico', 'seguro de satelites', 'inversiones', 'new space', 'geopolitica de los satelites', 'vida diaria'])) {
        const body = [
            `La consulta "${query}" pertenece a economía espacial y estrategia. El mercado espacial moderno integra lanzadores, satélites, servicios downstream y análisis de datos.`,
            '• Los satélites sostienen navegación, meteorología, telecomunicaciones, sincronización temporal y observación terrestre.',
            '• El modelo New Space ha reducido costes y acelerado innovación con actores privados y constelaciones masivas.',
            '• El riesgo estratégico aumenta con dependencia digital, congestión orbital y vulnerabilidad de infraestructuras críticas.',
            '• La basura espacial ya tiene impacto económico directo en seguros, maniobras evasivas y diseño de misiones.'
        ].join('\n');

        return buildTrustedResult('Economía espacial e impacto estratégico', query, body, [
            { name: 'ESA Economics', url: 'https://www.esa.int/' },
            { name: 'OECD Space Economy', url: 'https://www.oecd.org/' },
            { name: 'NASA', url: 'https://www.nasa.gov/' },
            { name: 'UNOOSA', url: 'https://www.unoosa.org/' }
        ], {
            sector: 'Space economy',
            dependencia: 'Infraestructura crítica global'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['gps', 'galileo', 'glonass', 'beidou', 'navegacion global', 'precision del gps', 'errores del gps', 'sincronizacion del tiempo', 'navegacion aerea', 'navegacion maritima'])) {
        const body = [
            `La consulta "${query}" se relaciona con navegación por satélite y GNSS. GPS, Galileo, GLONASS y BeiDou son constelaciones globales de posicionamiento, navegación y tiempo.`,
            '• La posición se obtiene midiendo tiempos de llegada de señales desde varios satélites y resolviendo trilateración.',
            '• La precisión depende de reloj, geometría satelital, ionosfera, multipath y correcciones disponibles.',
            '• GNSS no solo sirve para navegación: sincroniza redes eléctricas, telecomunicaciones, banca y transporte.',
            '• Galileo aporta cobertura civil europea, GLONASS es ruso y BeiDou es chino; todos complementan resiliencia multiconstelación.'
        ].join('\n');

        return buildTrustedResult('Navegación por satélite y GNSS', query, body, [
            { name: 'GPS.gov', url: 'https://www.gps.gov/' },
            { name: 'Galileo GNSS', url: 'https://www.gsc-europa.eu/' },
            { name: 'ESA Navigation', url: 'https://www.esa.int/Applications/Navigation' },
            { name: 'UNOOSA GNSS', url: 'https://www.unoosa.org/' }
        ], {
            constelaciones: 'GPS, Galileo, GLONASS, BeiDou',
            aplicaciones: 'Navegación, tiempo y sincronización'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['observacion terrestre', 'teledeteccion', 'sentinel', 'copernicus', 'landsat', 'cartografia', 'agricultura', 'cambio climatico', 'incendios forestales', 'huracanes', 'sensores opticos', 'radar', 'vigilancia del mar', 'contaminacion desde satelite'])) {
        const body = [
            `La consulta "${query}" corresponde a observación de la Tierra y teledetección. Aquí las referencias más fiables son Copernicus/ESA, Landsat/NASA-USGS y NOAA para monitorización ambiental.`,
            '• Los sensores ópticos capturan información espectral; el radar SAR observa incluso con nubes o de noche.',
            '• Sentinel y Landsat son pilares para agricultura, clima, cartografía, incendios, océanos y vigilancia ambiental.',
            '• La observación satelital convierte imágenes repetidas en series temporales útiles para detectar cambios.',
            '• Para información técnica y datasets, Copernicus, ESA, NASA Earthdata, USGS y NOAA son fuentes preferentes.'
        ].join('\n');

        return buildTrustedResult('Observación de la Tierra y teledetección', query, body, [
            { name: 'Copernicus', url: 'https://www.copernicus.eu/' },
            { name: 'ESA Sentinel', url: 'https://sentinels.copernicus.eu/' },
            { name: 'NASA Earthdata', url: 'https://www.earthdata.nasa.gov/' },
            { name: 'USGS Landsat', url: 'https://www.usgs.gov/landsat-missions' },
            { name: 'NOAA Satellites', url: 'https://www.nesdis.noaa.gov/' }
        ], {
            misiones: 'Sentinel, Landsat, NOAA',
            sensores: 'Óptico, térmico y radar'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['comunicacion', 'internet por satelite', 'television', 'telefonia', 'constelaciones', 'starlink', 'oneweb', 'kuiper', 'latencia', 'cobertura global', 'mega constelaciones'])) {
        const body = [
            `La consulta "${query}" trata sobre satélites de comunicaciones. Este ámbito combina arquitectura orbital, enlaces de radio, estaciones terrestres y gestión de capacidad.`,
            '• GEO ofrece gran cobertura con pocos satélites, pero introduce latencia mayor.',
            '• LEO reduce latencia y mejora internet satelital, a costa de necesitar constelaciones mucho más densas.',
            '• Starlink, OneWeb y Kuiper representan el giro hacia redes distribuidas de baja órbita.',
            '• La fiabilidad se verifica mejor en documentación de operadores, ITU y agencias regulatorias.'
        ].join('\n');

        return buildTrustedResult('Satélites de comunicaciones y constelaciones', query, body, [
            { name: 'ITU', url: 'https://www.itu.int/' },
            { name: 'SpaceX Starlink', url: 'https://www.starlink.com/' },
            { name: 'OneWeb', url: 'https://www.oneweb.net/' },
            { name: 'Amazon Project Kuiper', url: 'https://www.aboutamazon.com/what-we-do/devices-services/project-kuiper' }
        ], {
            orbitas: 'LEO y GEO',
            servicio: 'Internet, TV, telefonía y backhaul'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['orbita', 'leo', 'meo', 'geo', 'geoestacionaria', 'heliosincrona', 'polar', 'transferencia orbital', 'maniobras orbitales', 'reentrada atmosferica', 'decaimiento orbital', 'velocidad orbital'])) {
        const body = [
            `La consulta "${query}" se refiere a órbitas y mecánica orbital aplicada. La clasificación básica distingue LEO, MEO, GEO, polar y heliosíncrona según altitud e inclinación.`,
            '• LEO es ideal para observación terrestre y baja latencia; GEO domina telecomunicaciones y meteorología persistente.',
            '• Las maniobras orbitales usan impulsos de velocidad para cambiar energía, altura o plano orbital.',
            '• El arrastre atmosférico afecta más a LEO y explica buena parte del decaimiento orbital.',
            '• La referencia técnica fiable suele estar en NASA, ESA, manuales de dinámica orbital y cursos introductorios de astrodinámica.'
        ].join('\n');

        return buildTrustedResult('Órbitas espaciales y dinámica orbital', query, body, [
            { name: 'NASA Basics of Space Flight', url: 'https://solarsystem.nasa.gov/basics/' },
            { name: 'ESA Learn About Orbits', url: 'https://www.esa.int/' },
            { name: 'NOAA Satellite Orbits', url: 'https://www.nesdis.noaa.gov/' },
            { name: 'JPL Education', url: 'https://www.jpl.nasa.gov/edu/' }
        ], {
            niveles: 'LEO / MEO / GEO',
            clave: 'Velocidad, energía e inclinación'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['satelite', 'cubesat', 'nanosatelite', 'mini satelite', 'mini satelites', 'partes de un satelite', 'como funciona un satelite', 'para que sirven los satelites', 'paises con mas satelites', 'satelites activos'])) {
        const body = [
            `La consulta "${query}" entra en fundamentos de satélites artificiales. Un satélite combina plataforma, carga útil, energía, comunicaciones, control térmico y control de actitud.`,
            '• Los satélites pueden ser de comunicaciones, navegación, meteorología, observación, ciencia o defensa.',
            '• Su vida útil depende de combustible, degradación de componentes, radiación, misión y órbita.',
            '• Cubesats y nanosatélites han reducido barreras de entrada para universidades y startups.',
            '• Las fuentes más fiables sobre arquitectura satelital son NASA, ESA, operadores y material de ingeniería espacial.'
        ].join('\n');

        return buildTrustedResult('Satélites artificiales: tipos, funciones y diseño', query, body, [
            { name: 'NASA', url: 'https://www.nasa.gov/' },
            { name: 'ESA', url: 'https://www.esa.int/' },
            { name: 'NOAA Satellites', url: 'https://www.nesdis.noaa.gov/' },
            { name: 'USGS', url: 'https://www.usgs.gov/' }
        ], {
            clases: 'Comunicaciones, navegación, observación, meteorología',
            escala: 'Desde cubesats hasta plataformas geoestacionarias'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['fisica orbital', 'mecanica orbital', 'perturbaciones orbitales', 'arrastre atmosferico', 'radiacion espacial', 'blindaje', 'materiales', 'propulsion satelital', 'paneles solares', 'control termico', 'bandas satelitales', 'componentes espaciales', 'fallos tipicos'])) {
        const body = [
            `La consulta "${query}" es técnica y se sitúa en ingeniería de sistemas espaciales. Aquí importan la física orbital, entorno espacial y diseño de subsistemas.`,
            '• Las perturbaciones orbitales incluyen achatamiento terrestre, arrastre, presión solar y terceros cuerpos.',
            '• Los satélites requieren potencia, control térmico, telecomando, estructura, software y tolerancia a fallos.',
            '• La radiación espacial condiciona blindaje, selección de componentes y fiabilidad de electrónica.',
            '• Para explicaciones fiables, conviene cruzar documentación de NASA, ESA, ECSS y material universitario serio.'
        ].join('\n');

        return buildTrustedResult('Ingeniería y física de satélites', query, body, [
            { name: 'NASA Technical Reports', url: 'https://ntrs.nasa.gov/' },
            { name: 'ESA Engineering', url: 'https://www.esa.int/' },
            { name: 'ECSS', url: 'https://ecss.nl/' },
            { name: 'JPL', url: 'https://www.jpl.nasa.gov/' }
        ], {
            disciplina: 'Astrodinámica e ingeniería espacial',
            foco: 'Subsistemas, entorno y operación'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['trabajo sobre', 'introduccion a', 'resumen sobre', 'causas y consecuencias', 'ventajas y desventajas', 'importancia de los satelites', 'presentacion sobre', 'preguntas de investigacion', 'hipotesis', 'conclusiones', 'tema para exposicion'])) {
        const body = [
            `La consulta "${query}" parece escolar o de exposición. Para estos casos conviene estructurar la respuesta en definición, tipos, aplicaciones, riesgos y conclusión apoyada en fuentes oficiales.`,
            '• Introducción: qué es el tema y por qué importa hoy.',
            '• Desarrollo: datos verificables, ejemplos reales y comparación de ventajas y riesgos.',
            '• Conclusión: impacto social, económico, ambiental o científico.',
            '• Cita siempre NASA, ESA, NOAA, UNOOSA o Copernicus para evitar información dudosa.'
        ].join('\n');

        return buildTrustedResult('Enfoque escolar y de exposición', query, body, [
            { name: 'NASA STEM', url: 'https://www.nasa.gov/stem/' },
            { name: 'ESA Education', url: 'https://www.esa.int/Education' },
            { name: 'NOAA Education', url: 'https://www.noaa.gov/education' },
            { name: 'Copernicus', url: 'https://www.copernicus.eu/' }
        ], {
            formato: 'Introducción, desarrollo y conclusión',
            uso: 'Trabajo escolar o presentación'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['deberian limitarse', 'mega constelaciones son un problema', 'quien debe pagar', 'espacio demasiado saturado', 'riesgos eticos', 'sostenibilidad', 'merece la pena', 'vigilancia global', 'impacto astronomico', 'contaminacion luminica'])) {
        const body = [
            `La consulta "${query}" es de debate o reflexión. La respuesta fiable aquí debe equilibrar beneficios tecnológicos, sostenibilidad orbital, astronomía, regulación y acceso equitativo al espacio.`,
            '• A favor: conectividad global, servicios críticos, observación ambiental y desarrollo económico.',
            '• En contra: congestión orbital, basura espacial, interferencia astronómica, dependencia de actores privados y vigilancia masiva.',
            '• El debate serio exige separar hechos técnicos de opiniones y apoyarse en ESA, NASA, ITU, UNOOSA y literatura científica.',
            '• Una conclusión razonable suele pasar por regulación más fuerte, transparencia operativa y diseño sostenible.'
        ].join('\n');

        return buildTrustedResult('Debate sobre sostenibilidad y uso del espacio', query, body, [
            { name: 'UNOOSA', url: 'https://www.unoosa.org/' },
            { name: 'ESA Space Safety', url: 'https://www.esa.int/Safety_Security/Space_Safety' },
            { name: 'NASA', url: 'https://www.nasa.gov/' },
            { name: 'ITU', url: 'https://www.itu.int/' }
        ], {
            tipo: 'Debate informado',
            criterio: 'Hechos técnicos + implicaciones éticas y regulatorias'
        });
    }

    if (queryIncludesAny(normalizedQuery, ['espacio exterior', 'universo', 'galaxia', 'sistema solar', 'nebulosa', 'agujero negro', 'ano luz', 'anio luz', 'distancias en el espacio', 'exploracion espacial', 'carrera espacial', 'colonizacion de marte', 'estaciones espaciales', 'astronautas', 'marte'])) {
        const body = [
            `La consulta "${query}" entra en fundamentos del espacio y exploración espacial. La información fiable aquí debe apoyarse en NASA, ESA y observatorios científicos oficiales.`,
            '• El universo incluye galaxias, estrellas, nebulosas, sistemas planetarios y estructuras a gran escala.',
            '• Un sistema solar es un conjunto de cuerpos alrededor de una estrella; una galaxia contiene miles de millones de estrellas.',
            '• Las distancias astronómicas se expresan con unidades como UA, año luz o parsec según la escala.',
            '• La exploración espacial moderna combina ciencia, ingeniería, observación remota y presencia humana en órbita.'
        ].join('\n');

        return buildTrustedResult('Fundamentos del espacio y exploración', query, body, [
            { name: 'NASA Science', url: 'https://science.nasa.gov/' },
            { name: 'ESA Science', url: 'https://sci.esa.int/' },
            { name: 'HubbleSite', url: 'https://hubblesite.org/' },
            { name: 'JWST', url: 'https://www.jwst.nasa.gov/' }
        ], {
            nivel: 'Divulgación científica fiable',
            cobertura: 'Universo, sistema solar y exploración'
        });
    }

    return null;
}
