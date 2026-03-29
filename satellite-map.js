document.addEventListener('DOMContentLoaded', () => {
    console.log('satellite-map: DOMContentLoaded');

    // Ensure the map container exists before initializing Leaflet
    const mapContainer = document.getElementById('satelliteMap');
    if (!mapContainer) {
        console.warn("satellite-map: element with id 'satelliteMap' not found; skipping map initialization.");
        return;
    }
    // Basic Leaflet map setup
    const map = L.map('satelliteMap', { worldCopyJump: true }).setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Sample TLEs (public domain example TLEs - replace/update as needed)
    const satellites = [
        {
            name: 'ISS (ZARYA)',
            tle1: '1 25544U 98067A   24071.74756944  .00019707  00000+0  29915-3 0  9998',
            tle2: '2 25544  51.6441 221.1636 0005859  89.4666  32.2016 15.50423915382555',
            color: '#ffcc00'
        },
        {
            name: 'NOAA 15',
            tle1: '1 25338U 98030A   24071.52881944  .00000080  00000+0  60610-4 0  9997',
            tle2: '2 25338  98.7350  75.2741 0010929  85.0208 275.2709 14.25939584709621',
            color: '#00aaff'
        }
    ];

    const markers = new Map();
    const stationsLayer = L.layerGroup().addTo(map);
    const centersLayer = L.layerGroup().addTo(map);
    const satellitesLayer = L.layerGroup();
    const inactiveLayer = L.layerGroup();

    function deg(rad) { return rad * 180 / Math.PI; }

    function updatePositions() {
        console.log('satellite-map: updatePositions');
        const now = new Date();
        const gmst = satellite.gstime(now);

        satellites.forEach(sat => {
            try {
                const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
                const eci = satellite.propagate(satrec, now);
                if (!eci.position) return; // skip if propagation failed
                const geodetic = satellite.eciToGeodetic(eci.position, gmst);
                const lat = deg(geodetic.latitude);
                const lon = deg(geodetic.longitude);
                const height = geodetic.height; // km

                let marker = markers.get(sat.name);
                if (!marker) {
                    const circle = L.circleMarker([lat, lon], {
                        radius: 7,
                        color: sat.color,
                        fillColor: sat.color,
                        fillOpacity: 0.9
                    }).addTo(map);
                    circle.bindPopup(`<strong>${sat.name}</strong><br>Altitud: ${height.toFixed(1)} km`);
                    markers.set(sat.name, circle);
                    marker = circle;
                } else {
                    marker.setLatLng([lat, lon]);
                    marker.setPopupContent(`<strong>${sat.name}</strong><br>Altitud: ${height.toFixed(1)} km`);
                }
                console.log(`satellite ${sat.name} -> lat ${lat.toFixed(3)} lon ${lon.toFixed(3)} h ${height.toFixed(1)}`);
            } catch (err) {
                console.warn('sat update error', sat.name, err);
            }
        });
    }

    // --- Static stations and NASA centers ---
    const spaceStations = [
        { name: 'ISS (ZARYA)', lat: 0, lon: 0 }, // initial pos updated by TLE
        { name: 'Tiangong (China)', lat: 31.0, lon: 120.0 }
    ];

    const nasaCenters = [
        { name: 'Kennedy Space Center', lat: 28.5729, lon: -80.6490 },
        { name: 'Johnson Space Center', lat: 29.5597, lon: -95.0900 },
        { name: 'Ames Research Center', lat: 37.4056, lon: -122.0796 },
        { name: 'Goddard Space Flight Center', lat: 39.0000, lon: -76.8390 },
        { name: 'Jet Propulsion Laboratory (JPL)', lat: 34.2000, lon: -118.1719 },
        { name: 'Marshall Space Flight Center', lat: 34.7304, lon: -86.5861 },
        { name: 'Stennis Space Center', lat: 30.3622, lon: -89.6002 },
        { name: 'Langley Research Center', lat: 37.0861, lon: -76.3819 }
    ];

    // Simple SVG icons as data URLs
    const satSvg = encodeURI(`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g fill='none' stroke='%23123456' stroke-width='1.2'><path d='M2 12l6-6 8 8-6 6z' fill='%23ffffff' stroke='%23000'/></g></svg>`);
    const centerSvg = encodeURI(`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'><circle cx='12' cy='12' r='8' fill='%2300aaff' stroke='%23000' stroke-width='1'/></svg>`);

    const satIcon = L.icon({ iconUrl: satSvg, iconSize: [20, 20], iconAnchor: [10, 10] });
    const centerIcon = L.icon({ iconUrl: centerSvg, iconSize: [18, 18], iconAnchor: [9, 9] });

    // Add NASA centers markers
    nasaCenters.forEach(c => {
        L.marker([c.lat, c.lon], { icon: centerIcon }).bindPopup(`<strong>${c.name}</strong>`).addTo(centersLayer);
    });

    // Add stations placeholders (will be moved/updated by updatePositions)
    spaceStations.forEach(s => {
        const m = L.marker([s.lat, s.lon], { icon: centerIcon }).bindPopup(`<strong>${s.name}</strong>`).addTo(stationsLayer);
        markers.set(s.name, m);
    });

    // --- TLE fetching & parsing helpers ---
    async function fetchTLE(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const text = await res.text();
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            const list = [];
            for (let i = 0; i < lines.length; i += 3) {
                const name = lines[i] || 'unknown';
                const tle1 = lines[i+1] || '';
                const tle2 = lines[i+2] || '';
                if (tle1.startsWith('1 ') && tle2.startsWith('2 ')) {
                    list.push({ name, tle1, tle2 });
                }
            }
            return list;
        } catch (err) {
            console.warn('fetchTLE error', url, err);
            return [];
        }
    }

    let activeSatellites = [];
    let inactiveSet = new Set();

    async function loadSatelliteLists() {
        // Celestrak lists (may be adjusted if needed)
        const activeUrl = 'https://celestrak.org/NORAD/elements/active.txt';
        const decayedUrl = 'https://celestrak.org/NORAD/elements/decayed.txt';
        const stationsUrl = 'https://celestrak.org/NORAD/elements/stations.txt';

        const [activeList, decayedList, stationsList] = await Promise.all([
            fetchTLE(activeUrl),
            fetchTLE(decayedUrl),
            fetchTLE(stationsUrl)
        ]);

        inactiveSet = new Set(decayedList.map(s => s.name));

        // Merge stations into satellites list to ensure they're tracked
        const merged = activeList.concat(stationsList.filter(s => !inactiveSet.has(s.name)));
        // Limit to first 800 to avoid browser overload
        activeSatellites = merged.slice(0, 800);

        console.log('loaded satellites', activeSatellites.length, 'inactive count', inactiveSet.size);
    }

    function renderSatelliteMarkers() {
        satellitesLayer.clearLayers();
        inactiveLayer.clearLayers();

        activeSatellites.forEach(sat => {
            try {
                const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
                const eci = satellite.propagate(satrec, new Date());
                if (!eci.position) return;
                const geodetic = satellite.eciToGeodetic(eci.position, satellite.gstime(new Date()));
                const lat = deg(geodetic.latitude);
                const lon = deg(geodetic.longitude);
                const isInactive = inactiveSet.has(sat.name);
                if (isInactive) {
                    const dot = L.circleMarker([lat, lon], { radius: 4, color: '#ff0000', fillOpacity: 0.9 });
                    dot.bindPopup(`<strong>${sat.name}</strong> (inactivo)`);
                    inactiveLayer.addLayer(dot);
                } else {
                    const m = L.marker([lat, lon], { icon: satIcon });
                    m.bindPopup(`<strong>${sat.name}</strong>`);
                    satellitesLayer.addLayer(m);
                }
            } catch (err) {
                // ignore single sat errors
            }
        });
    }

    // Visibility rules based on zoom
    function updateVisibility() {
        const z = map.getZoom();
        // If zoomed out (small map), show many satellites; if zoomed in, show stations and centers
        if (z <= 3) {
            if (!map.hasLayer(satellitesLayer)) map.addLayer(satellitesLayer);
            if (map.hasLayer(inactiveLayer)) map.addLayer(inactiveLayer);
            if (map.hasLayer(stationsLayer)) map.removeLayer(stationsLayer);
            if (map.hasLayer(centersLayer)) map.removeLayer(centersLayer);
        } else {
            if (map.hasLayer(satellitesLayer)) map.removeLayer(satellitesLayer);
            if (map.hasLayer(inactiveLayer)) map.removeLayer(inactiveLayer);
            if (!map.hasLayer(stationsLayer)) map.addLayer(stationsLayer);
            if (!map.hasLayer(centersLayer)) map.addLayer(centersLayer);
        }
    }

    map.on('zoomend', () => {
        console.log('map zoom', map.getZoom());
        updateVisibility();
    });

    // Initial load of remote lists and first render
    loadSatelliteLists().then(() => {
        renderSatelliteMarkers();
        updateVisibility();
    });

    // Also update satellite positions periodically
    setInterval(() => {
        renderSatelliteMarkers();
    }, 5000);

    // Initial update and start timer
    updatePositions();
    let intervalId = setInterval(updatePositions, 5000);

    // Auto-update control
    const autoCheckbox = document.getElementById('autoUpdate');
    if (autoCheckbox) {
        autoCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                intervalId = setInterval(updatePositions, 5000);
            } else {
                clearInterval(intervalId);
            }
        });
    }

    // Fit map to first marker when available
    const observer = new MutationObserver(() => {
        if (markers.size > 0) {
            const group = Array.from(markers.values()).map(m => m.getLatLng());
            const bounds = L.latLngBounds(group);
            map.fitBounds(bounds.pad(0.5));
            observer.disconnect();
        }
    });
    observer.observe(document.getElementById('satelliteMap'), { childList: true, subtree: true });
});
