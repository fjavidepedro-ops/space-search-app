// solar-system.js — Sun-centered interactive system map (clean, debug-friendly)
(function(){
  'use strict';

  function log(...args){ console.log('[solar-system]', ...args); }
  window.addEventListener('error', e => console.error('[solar-system] error:', e && e.message, e && e.filename, e && e.lineno));
  window.addEventListener('unhandledrejection', e => console.error('[solar-system] unhandledrejection:', e && e.reason));

  function initSolar(){
    log('initSolar');

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'solarSystemPanel';
    panel.innerHTML = `
      <div class="results-header"><h2>Sistema Solar — Vista centrada en el Sol</h2></div>
      <div id="solarControls" style="padding:8px; color:var(--text-light);">
        <button id="fitAll">Fit All</button>
        <button id="zoomOut">-</button>
        <button id="zoomIn">+</button>
        <label style="margin-left:12px;color:var(--text-light)">Velocidad: <input id="simSpeed" type="range" min="1" max="200" value="30"></label>
        <span style="margin-left:8px;color:var(--text-light)" id="speedVal">30 d/s</span>
      </div>
      <div id="solarCanvasWrap"><canvas id="solarCanvas"></canvas></div>
      <div id="planetInfo" class="results-container" style="margin-top:10px; display:none;"></div>
    `;
    const main = document.querySelector('main') || document.body;
    main.appendChild(panel);

    const canvas = document.getElementById('solarCanvas');
    const wrap = document.getElementById('solarCanvasWrap');
    const info = document.getElementById('planetInfo');
    const fitBtn = document.getElementById('fitAll');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const speedSlider = document.getElementById('simSpeed');
    const speedVal = document.getElementById('speedVal');

    // Planets dataset
    const planets = [
      { id:'mercury', name:'Mercurio', a:0.387, period:0.241, color:'#b2b2b2', r:4, imgUrl:'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
          massKg:3.3011e23, meanRadiusKm:2439.7, gravityMs2:3.7, densityKgM3:5427, escapeVelocityKmS:4.25, satellites:[], atmosphere:'Exosfera tenue (Na, K, He, O)',
          official:{ wikipedia:'https://es.wikipedia.org/wiki/Mercurio_(planeta)', nasa:'https://solarsystem.nasa.gov/planets/mercury/overview/' }, info:[] },
        { id:'venus', name:'Venus', a:0.723, period:0.615, color:'#e0c16a', r:6, imgUrl:'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg',
          massKg:4.8675e24, meanRadiusKm:6051.8, gravityMs2:8.87, densityKgM3:5243, escapeVelocityKmS:10.36, satellites:[], atmosphere:'96.5% CO₂, 3.5% N₂; presión ≈92 bar; nubes de H₂SO₄',
          official:{ wikipedia:'https://es.wikipedia.org/wiki/Venus', nasa:'https://solarsystem.nasa.gov/planets/venus/overview/' }, info:[] },
        { id:'earth', name:'Tierra', a:1.000, period:1.000, color:'#2a9df4', r:7, imgUrl:'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
          massKg:5.97237e24, meanRadiusKm:6371.0, gravityMs2:9.807, densityKgM3:5514, escapeVelocityKmS:11.186, satellites:['Luna'], atmosphere:'78% N₂, 21% O₂, 0.93% Ar; presión ≈1 bar',
          official:{ wikipedia:'https://es.wikipedia.org/wiki/Tierra', nasa:'https://solarsystem.nasa.gov/planets/earth/overview/' }, info:[] },
        { id:'mars', name:'Marte', a:1.524, period:1.881, color:'#c1440e', r:6, imgUrl:'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
          massKg:6.4171e23, meanRadiusKm:3389.5, gravityMs2:3.711, densityKgM3:3933, escapeVelocityKmS:5.03, satellites:['Fobos','Deimos'], atmosphere:'≈95.97% CO₂, trazas de N₂ y Ar; presión ≈0.006 bar',
          official:{ wikipedia:'https://es.wikipedia.org/wiki/Marte', nasa:'https://solarsystem.nasa.gov/planets/mars/overview/' }, info:[] },
        { id:'jupiter', name:'Júpiter', a:5.203, period:11.862, color:'#d9a066', r:12, imgUrl:'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
          massKg:1.8982e27, meanRadiusKm:69911, gravityMs2:24.79, densityKgM3:1326, escapeVelocityKmS:59.5, satellites:['Io','Europa','Ganimedes','Calisto'], atmosphere:'Principalmente H₂ (≈89%) y He (≈10%), tormentas y bandas',
          official:{ wikipedia:'https://es.wikipedia.org/wiki/J%C3%BApiter', nasa:'https://solarsystem.nasa.gov/planets/jupiter/overview/' }, info:[] },
        { id:'saturn', name:'Saturno', a:9.537, period:29.457, color:'#f0db9a', r:10, imgUrl:'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
          massKg:5.6834e26, meanRadiusKm:58232, gravityMs2:10.44, densityKgM3:687, escapeVelocityKmS:35.5, satellites:['Titán','Rea','Jápeto'], atmosphere:'H₂ y He; notable sistema de anillos',
          official:{ wikipedia:'https://es.wikipedia.org/wiki/Saturno_(planeta)', nasa:'https://solarsystem.nasa.gov/planets/saturn/overview/' }, info:[] },
        { id:'uranus', name:'Urano', a:19.191, period:84.07, color:'#7fd3e6', r:9, imgUrl:'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
          massKg:8.6810e25, meanRadiusKm:25362, gravityMs2:8.69, densityKgM3:1271, escapeVelocityKmS:21.3, satellites:['Miranda','Ariel','Umbriel','Titania','Oberón'], atmosphere:'H₂, He y CH₄ (metano) — da color azul verdoso',
          official:{ wikipedia:'https://es.wikipedia.org/wiki/Urano', nasa:'https://solarsystem.nasa.gov/planets/uranus/overview/' }, info:[] },
        { id:'neptune', name:'Neptuno', a:30.07, period:164.8, color:'#4062a8', r:9, imgUrl:'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg',
          massKg:1.02413e26, meanRadiusKm:24622, gravityMs2:11.15, densityKgM3:1638, escapeVelocityKmS:23.5, satellites:['Tritón'], atmosphere:'H₂, He, CH₄; vientos extremadamente fuertes',
          official:{ wikipedia:'https://es.wikipedia.org/wiki/Neptuno', nasa:'https://solarsystem.nasa.gov/planets/neptune/overview/' }, info:[] }
    ];

    // Fill simple info (short) — can be expanded later
    planets.forEach(p => {
      const massStr = p.massKg ? `${Number(p.massKg).toExponential(3)} kg` : 'n/d';
      const satStr = (p.satellites && p.satellites.length>0) ? p.satellites.join(', ') : 'Ninguno conocido';
      const diamApproxKm = p.meanRadiusKm ? Math.round(p.meanRadiusKm*2) : (p.r ? Math.round(p.r*1000) : 'n/d');
      const gravity = p.gravityMs2 ? `${p.gravityMs2} m/s²` : 'n/d';
      const density = p.densityKgM3 ? `${p.densityKgM3} kg/m³` : 'n/d';
      const escapeV = p.escapeVelocityKmS ? `${p.escapeVelocityKmS} km/s` : 'n/d';
      const links = p.official ? `<a href="${p.official.nasa}" target="_blank">NASA</a> • <a href="${p.official.wikipedia}" target="_blank">Wikipedia</a>` : `https://es.wikipedia.org/wiki/${encodeURIComponent(p.name)}`;
      const explorationList = p.exploration && p.exploration.length ? p.exploration.join(', ') : 'Varias misiones (ver enlaces)';
      p.info = [
        `${p.name} — ficha técnica detallada.`,
        `Distancia media al Sol: ${p.a} AU`,
        `Periodo orbital (años): ${p.period}`,
        `Radio medio: ${p.meanRadiusKm ? p.meanRadiusKm + ' km' : 'n/d'}`,
        `Diámetro aprox.: ${diamApproxKm} km`,
        `Masa: ${massStr}`,
        `Gravedad superficial: ${gravity}`,
        `Densidad media: ${density}`,
        `Velocidad de escape: ${escapeV}`,
        `Satélites principales: ${satStr}`,
        `Atmósfera: ${p.atmosphere || 'Información no disponible'}`,
        `Exploración: ${explorationList}`,
        `Enlaces oficiales: ${links}`
      ];
    });

    // Visual / simulation state
    let scale = 24; // pixels per AU — initial
    let offsetX = 0, offsetY = 0; // world offset (AU)
    let simStartRealMs = Date.now();
    let simStartYears = (new Date() - new Date('2000-01-01T12:00:00Z')) / (365.25*24*3600*1000);
    let daysPerSecond = parseFloat(speedSlider.value || 30);
    speedVal.textContent = `${daysPerSecond} d/s`;

    // stars
    const stars = []; const STAR_COUNT = 300;
    function generateStars(rangeAU){ stars.length=0; for(let i=0;i<STAR_COUNT;i++){ stars.push({ x:(Math.random()*2-1)*rangeAU, y:(Math.random()*2-1)*rangeAU, depth:0.2+Math.random()*0.8, size: Math.random()<0.03?2:1, bright:0.5+Math.random()*0.5 }); }}

    // canvas sizing
    function resize(){
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight || 520;
      draw();
    }
    window.addEventListener('resize', resize);

    // load sun image
    let sunImg = null;
    (function loadSun(){ const img=new Image(); img.crossOrigin='anonymous'; img.onload=()=>{ sunImg=img; draw(); }; img.onerror=()=>{ log('sun image failed to load'); }; img.src='https://upload.wikimedia.org/wikipedia/commons/9/97/FullSun.jpg'; })();

    // load planet images async
    planets.forEach(p=>{ if(p.imgUrl){ const img=new Image(); img.crossOrigin='anonymous'; img.onload=()=>{ p._img=img; draw(); }; img.onerror=()=>{ log('planet image failed', p.name); }; img.src=p.imgUrl; }});

    function simYears(){ return simStartYears + (Date.now()-simStartRealMs)/1000 * (daysPerSecond/365.25); }

    function draw(){
      if(!canvas.width) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const cx = canvas.width/2, cy = canvas.height/2;

      const maxAU = Math.max(...planets.map(p=>p.a));
      if(stars.length===0) generateStars((maxAU+5));

      // adjust scale if too small/large
      scale = Math.max(6, Math.min(200, scale));

      // draw starfield
      stars.forEach(s=>{
        const sx = cx + (s.x - offsetX) * scale * s.depth;
        const sy = cy + (s.y - offsetY) * scale * s.depth;
        ctx.fillStyle = `rgba(255,255,255,${s.bright})`;
        ctx.beginPath(); ctx.arc(sx, sy, s.size, 0, Math.PI*2); ctx.fill();
      });

      // draw Sun at world coords
      const sunX = cx + (0 - offsetX) * scale;
      const sunY = cy + (0 - offsetY) * scale;
      if(sunImg){ const s = Math.max(28, 28 * Math.min(1, scale/6)); ctx.save(); ctx.beginPath(); ctx.arc(sunX, sunY, s/2, 0, Math.PI*2); ctx.closePath(); ctx.clip(); ctx.drawImage(sunImg, sunX - s/2, sunY - s/2, s, s); ctx.restore(); }
      else { ctx.beginPath(); ctx.fillStyle='#ffdd33'; ctx.arc(sunX, sunY, 14, 0, Math.PI*2); ctx.fill(); }

      // orbits
      ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1;
      planets.forEach(p=>{ ctx.beginPath(); ctx.ellipse(cx - offsetX*scale, cy - offsetY*scale, p.a*scale, p.a*scale, 0, 0, Math.PI*2); ctx.stroke(); });

      // planets
      const t = simYears();
      planets.forEach(p=>{
        const perturbAmp = p.a*0.02;
        const perturb = perturbAmp * Math.sin(2*Math.PI*(t*12/6 + (p.a%1)));
        const radiusAU = p.a + perturb;
        const ecc = 0.02 * Math.sin(2*Math.PI * t / p.period);
        const angle = (2*Math.PI) * ((t / p.period) % 1) + ecc;
        const wx = Math.cos(angle) * radiusAU;
        const wy = Math.sin(angle) * radiusAU;
        const x = cx + (wx - offsetX) * scale;
        const y = cy + (wy - offsetY) * scale;

        if(p._img){ const size = Math.max(8, p.r * Math.min(6, scale/4)); ctx.save(); ctx.beginPath(); ctx.arc(x, y, size/2, 0, Math.PI*2); ctx.closePath(); ctx.clip(); ctx.drawImage(p._img, x - size/2, y - size/2, size, size); ctx.restore(); }
        else { ctx.beginPath(); ctx.fillStyle=p.color; ctx.arc(x,y,p.r,0,Math.PI*2); ctx.fill(); }
        ctx.fillStyle='#fff'; ctx.font='11px sans-serif'; ctx.fillText(p.name, x + p.r + 6, y + 4);
        p._screen = { x, y, r: p.r };
      });
    }

    // interactions
    // click to center on planet and show info
    canvas.addEventListener('click', ev=>{
      const rect = canvas.getBoundingClientRect(); const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      for(const p of planets){ if(!p._screen) continue; const dx = mx - p._screen.x, dy = my - p._screen.y; if(Math.hypot(dx,dy) <= Math.max(8, p._screen.r+6)){ showPlanetInfo(p); return; } }
    });

    // pan drag
    let dragging=false, last=null; canvas.addEventListener('mousedown', e=>{ dragging=true; last={x:e.clientX,y:e.clientY}; canvas.style.cursor='grabbing'; });
    window.addEventListener('mouseup', ()=>{ dragging=false; last=null; canvas.style.cursor='default'; });
    window.addEventListener('mousemove', e=>{ if(!dragging||!last) return; const dx=e.clientX-last.x, dy=e.clientY-last.y; last={x:e.clientX,y:e.clientY}; offsetX -= dx/scale; offsetY -= dy/scale; draw(); });

    // wheel zoom (animated)
    function animateZoom(targetScale, focusX, focusY, duration=260){ const startScale=scale, startOffsetX=offsetX, startOffsetY=offsetY, startTime=performance.now(); const cx=canvas.width/2, cy=canvas.height/2; const worldFocusX=(focusX-cx)/startScale+offsetX, worldFocusY=(focusY-cy)/startScale+offsetY; function step(now){ const t=Math.min(1,(now-startTime)/duration); const eased=1-Math.pow(1-t,3); scale = startScale + (targetScale-startScale)*eased; offsetX = worldFocusX - (focusX-cx)/scale; offsetY = worldFocusY - (focusY-cy)/scale; draw(); if(t<1) requestAnimationFrame(step); } requestAnimationFrame(step); }
    canvas.addEventListener('wheel', ev=>{ ev.preventDefault(); const rect=canvas.getBoundingClientRect(); const mx=ev.clientX-rect.left, my=ev.clientY-rect.top; const zoomFactor = ev.deltaY<0?1.18:1/1.18; const target=Math.max(2,Math.min(1000,scale*zoomFactor)); animateZoom(target,mx,my); }, { passive:false });

    // dblclick to zoom in
    canvas.addEventListener('dblclick', ev=>{ const rect=canvas.getBoundingClientRect(); const mx=ev.clientX-rect.left, my=ev.clientY-rect.top; animateZoom(Math.min(1000, scale*2.5), mx, my, 400); });

    // pinch basic
    let lastTouchDist=null;
    canvas.addEventListener('touchstart', ev=>{ if(ev.touches.length===2){ const dx=ev.touches[0].clientX-ev.touches[1].clientX; const dy=ev.touches[0].clientY-ev.touches[1].clientY; lastTouchDist=Math.hypot(dx,dy); } }, { passive:true });
    canvas.addEventListener('touchmove', ev=>{ if(ev.touches.length===2 && lastTouchDist){ ev.preventDefault(); const dx=ev.touches[0].clientX-ev.touches[1].clientX; const dy=ev.touches[0].clientY-ev.touches[1].clientY; const dist=Math.hypot(dx,dy); const rect=canvas.getBoundingClientRect(); const mx=(ev.touches[0].clientX+ev.touches[1].clientX)/2-rect.left; const my=(ev.touches[0].clientY+ev.touches[1].clientY)/2-rect.top; const factor=dist/lastTouchDist; const target=Math.max(2,Math.min(1000,scale*factor)); animateZoom(target,mx,my,120); lastTouchDist=dist; } }, { passive:false });
    canvas.addEventListener('touchend', ()=>{ lastTouchDist=null; }, { passive:true });

    // UI controls
    zoomInBtn.addEventListener('click', ()=> animateZoom(Math.min(1000, scale*1.5), canvas.width/2, canvas.height/2));
    zoomOutBtn.addEventListener('click', ()=> animateZoom(Math.max(2, scale/1.5), canvas.width/2, canvas.height/2));
    fitBtn.addEventListener('click', ()=>{
      // center and fit all planets
      offsetX = 0; offsetY = 0; scale = (Math.min(canvas.width, canvas.height)*0.45) / (Math.max(...planets.map(p=>p.a))+2); draw();
    });
    speedSlider.addEventListener('input', ()=>{ daysPerSecond = parseFloat(speedSlider.value); speedVal.textContent = `${daysPerSecond} d/s`; });

    function showPlanetInfo(p){
      info.style.display='block';
      const html = `<div class="results-header"><h3>${p.name}</h3></div>` +
        `<div class="planet-info-layout"><div class="planet-info-media"><img src="${p.imgUrl}" class="planet-info-image"/></div><div class="result-data">${p.info.map(l=>`<div>${l}</div>`).join('')}</div></div>`;
      info.innerHTML = html;

      // On mobile, move focus to the generated info card for easier reading.
      if (window.matchMedia('(max-width: 768px)').matches) {
        requestAnimationFrame(() => {
          info.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }

      // animate pan+zoom to planet
      const targetScale = Math.max(40, Math.min(800, scale*4));
      const canvasCenterX = canvas.width/2, canvasCenterY = canvas.height/2;
      const targetOffsetX = ((p._screen.x - canvasCenterX)/scale) + offsetX;
      const targetOffsetY = ((p._screen.y - canvasCenterY)/scale) + offsetY;
      animatePanZoom(targetOffsetX, targetOffsetY, targetScale, 800);
    }

    // animate loop
    function loop(){ draw(); requestAnimationFrame(loop); }
    resize(); requestAnimationFrame(loop);

    // expose for debugging
    window._solar_debug = { planets, draw, canvas, panel };
    log('solar initialized');
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSolar);
  else initSolar();
})();
