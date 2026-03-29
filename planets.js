// planets.js — interactive planet panel + topocentric calculations (uses astronomy-engine if available)
document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.id = 'planetPanel';
    container.innerHTML = `
        <div class="results-header"><h2>Planetas — Posición aparente desde tu ubicación</h2></div>
        <div id="planetControls" style="padding:10px; color:var(--text-light);">
            <button id="btnLocate">Usar mi ubicación</button>
            <span id="locStatus" style="margin-left:10px"></span>
        </div>
        <div id="planetList" style="padding:10px;"></div>
        <canvas id="skyCanvas" width="600" height="300" style="width:100%; border-radius:8px; background:rgba(0,0,0,0.6); display:block; margin-top:10px;"></canvas>
    `;
    const main = document.querySelector('main');
    main.appendChild(container);

    const planets = [
        { id: 'mercury', name: 'Mercurio', discovered: 'Antiguo', discoverer: 'Antiguo', distance_au: 0.387 },
        { id: 'venus', name: 'Venus', discovered: 'Antiguo', discoverer: 'Antiguo', distance_au: 0.723 },
        { id: 'earth', name: 'Tierra', discovered: 'N/A', discoverer: 'N/A', distance_au: 0 },
        { id: 'mars', name: 'Marte', discovered: 'Antiguo', discoverer: 'Antiguo', distance_au: 1.524 },
        { id: 'jupiter', name: 'Júpiter', discovered: 'Antiguo', discoverer: 'Antiguo', distance_au: 5.203 },
        { id: 'saturn', name: 'Saturno', discovered: 'Antiguo', discoverer: 'Antiguo', distance_au: 9.537 },
        { id: 'uranus', name: 'Urano', discovered: '1781', discoverer: 'William Herschel', distance_au: 19.191 },
        { id: 'neptune', name: 'Neptuno', discovered: '1846', discoverer: 'Urbain Le Verrier / Johann Galle', distance_au: 30.07 }
    ];

    function auToLightYears(au){ return au / 63241.077; }

    const listDiv = document.getElementById('planetList');
    planets.forEach(p => {
        const el = document.createElement('div');
        el.className = 'result-item';
        el.innerHTML = `<h3>${p.name}</h3>
            <div class="result-data"><div><strong>Descubrimiento:</strong> ${p.discovered}</div>
            <div><strong>Descubrió:</strong> ${p.discoverer}</div>
            <div><strong>Distancia media (años-luz):</strong> ${auToLightYears(p.distance_au).toExponential(3)}</div>
            <div id="pos-${p.id}"><strong>Posición aparente:</strong> —</div></div>`;
        listDiv.appendChild(el);
    });

    const btnLocate = document.getElementById('btnLocate');
    const locStatus = document.getElementById('locStatus');
    const skyCanvas = document.getElementById('skyCanvas');
    const ctx = skyCanvas.getContext('2d');

    async function computePositions(lat, lon) {
        locStatus.textContent = `Ubicación: ${lat.toFixed(3)}, ${lon.toFixed(3)}`;
        try {
            if (typeof Astronomy === 'undefined') throw new Error('astronomy-engine no disponible');
            const now = new Date();
            planets.forEach(p => {
                try {
                    // Use Astronomy.Position for planet (works in astronomy-engine v2+)
                    const body = p.name.toUpperCase();
                    const eph = Astronomy.Equator(body, now, { observer: { lat, lon, height: 0 }, epoch: 'date' });
                    const hor = Astronomy.Horizon(eph.ra, eph.dec, lat, lon, now, 'normal');
                    const az = hor.azimuth; // degrees
                    const alt = hor.altitude; // degrees
                    const posDiv = document.getElementById('pos-'+p.id);
                    if (posDiv) posDiv.innerHTML = `<strong>Posición aparente:</strong> Az ${az.toFixed(1)}°, Alt ${alt.toFixed(1)}°`;
                } catch (err) {
                    console.warn('planet pos error', p.name, err);
                }
            });

            // draw simple sky: azimuth around circle, altitude radius
            ctx.clearRect(0,0,skyCanvas.width, skyCanvas.height);
            const cx = skyCanvas.width/2, cy = skyCanvas.height*0.9, radius = Math.min(skyCanvas.width/2, skyCanvas.height*0.8);
            // horizon line
            ctx.strokeStyle = '#444'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, radius, Math.PI, 2*Math.PI); ctx.stroke();
            planets.forEach(p => {
                try {
                    const eph = Astronomy.Equator(p.name.toUpperCase(), now, { observer: { lat, lon, height: 0 }, epoch: 'date' });
                    const hor = Astronomy.Horizon(eph.ra, eph.dec, lat, lon, now, 'normal');
                    const az = hor.azimuth * Math.PI/180;
                    const alt = Math.max(-90, Math.min(90, hor.altitude));
                    const r = radius * (1 - (alt+90)/180); // map altitude -90..90 to radius
                    const x = cx + r * Math.sin(az);
                    const y = cy - r * Math.cos(az);
                    ctx.fillStyle = '#ffcc00'; ctx.beginPath(); ctx.arc(x,y,6,0,2*Math.PI); ctx.fill();
                    ctx.fillStyle = '#fff'; ctx.fillText(p.name, x+8, y+4);
                } catch (err) {
                    // ignore draw errors
                }
            });
        } catch (err) {
            locStatus.textContent = 'No se puede calcular pos. con astronomy-engine.';
            console.warn(err);
        }
    }

    btnLocate.addEventListener('click', () => {
        if (!navigator.geolocation) { locStatus.textContent = 'Geolocalización no soportada'; return; }
        locStatus.textContent = 'Solicitando ubicación...';
        navigator.geolocation.getCurrentPosition((pos) => {
            computePositions(pos.coords.latitude, pos.coords.longitude);
        }, (err) => { locStatus.textContent = 'Permiso denegado o error de ubicación'; console.warn(err); }, { enableHighAccuracy: true });
    });
});
