// solar-system-3d.js — 3D Solar System viewer using three.js (module)
import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/FlyControls.js';

(function(){
  const container = document.createElement('div');
  container.id = 'solar3dContainer';
  container.style.marginTop = '20px';
  container.innerHTML = `
    <div class="results-header"><h2>Sistema Solar 3D</h2></div>
    <div id="solar3dWrap" style="width:100%; height:640px; border-radius:8px; overflow:hidden; background:#000"></div>
    <div style="margin-top:8px; display:flex; gap:8px; align-items:center;">
      <button id="toggleMoons">Mostrar/Ocultar Lunas</button>
      <button id="resetView">Reset view</button>
      <label style="color:var(--text-light); margin-left:8px;">Velocidad: <input id="speed3d" type="range" min="1" max="200" value="30"></label>
      <span id="speed3dVal" style="color:var(--text-light); margin-left:6px">30 d/s</span>
    </div>
  `;
  const main = document.querySelector('main') || document.body;
  main.appendChild(container);

  // controls row (where buttons and inputs are placed)
  let controlsRow = container.querySelector('div[style*="margin-top:8px"]');
  if(!controlsRow){ controlsRow = container.querySelector('div') || container; }
  // ensure the controls row is visible and uses flex layout
  try{ controlsRow.style.display = controlsRow.style.display || 'flex'; }catch(e){}

  const mount = document.getElementById('solar3dWrap');
  const width = () => mount.clientWidth;
  const height = () => mount.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width()/height(), 0.1, 2000);
  camera.position.set(0, 60, 180);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width(), height());
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  mount.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0,0,0);
  controls.enableDamping = true;
  controls.enablePan = true;
  controls.enableRotate = true;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;
  // allow full 360 azimuth and full polar range
  controls.minPolarAngle = 0.001;
  controls.maxPolarAngle = Math.PI - 0.001;
  controls.screenSpacePanning = false;
  // explicitly allow unrestricted azimuth (horizontal) rotation
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;
  // increase rotate speed for more responsive feel
  controls.rotateSpeed = 1.2;

  // FlyControls for free movement (disabled by default)
  const flyControls = new FlyControls(camera, renderer.domElement);
  flyControls.movementSpeed = 80;
  flyControls.rollSpeed = Math.PI / 24;
  flyControls.dragToLook = true;
  flyControls.enabled = false;
  let flyMode = false;
  const flyBtn = document.createElement('button'); flyBtn.id = 'flyBtn'; flyBtn.textContent = 'Modo Libre: OFF'; flyBtn.style.marginLeft='8px'; flyBtn.style.padding='6px 8px'; flyBtn.style.backgroundColor='#333'; flyBtn.style.color='#fff'; flyBtn.style.border='1px solid #666'; controlsRow.appendChild(flyBtn);
  flyBtn.addEventListener('click', ()=>{
    flyMode = !flyMode; flyControls.enabled = flyMode; controls.enabled = !flyMode; flyBtn.textContent = 'Modo Libre: ' + (flyMode? 'ON':'OFF');
    if(!flyMode){ controls.target.set(0,0,0); camera.lookAt(controls.target); }
  });

  // lights
  const amb = new THREE.AmbientLight(0x666666); scene.add(amb);
  const sunLight = new THREE.PointLight(0xffffff, 2.2, 0); sunLight.position.set(0,0,0); scene.add(sunLight);
  const dir = new THREE.DirectionalLight(0xffffff, 0.4); dir.position.set(100,100,50); scene.add(dir);

  // starfield background (big sphere)
  const starsGeo = new THREE.SphereGeometry(900, 32, 32);
  const starMat = new THREE.MeshBasicMaterial({ color:0x000012, side:THREE.BackSide });
  const starMesh = new THREE.Mesh(starsGeo, starMat); scene.add(starMesh);

  // helper function to create planet
  function createPlanet(opts){
    const geom = new THREE.SphereGeometry(opts.size, 32, 32);
    // prefer texture if provided, otherwise use color-based Phong material
    let mat;
    if(opts.texture){
      // opts.texture may be a path (string) or a THREE.Texture object
      if(typeof opts.texture === 'string'){
        const tex = new THREE.TextureLoader().load(opts.texture);
        mat = new THREE.MeshPhongMaterial({ map: tex, shininess: 5 });
      } else if(opts.texture instanceof THREE.Texture){
        mat = new THREE.MeshPhongMaterial({ map: opts.texture, shininess: 5 });
      } else {
        mat = new THREE.MeshPhongMaterial({ color: opts.color, shininess: 10 });
      }
    } else {
      mat = new THREE.MeshPhongMaterial({ color: opts.color, shininess: 10 });
    }
    const mesh = new THREE.Mesh(geom, mat);
    mesh.userData = opts;
    mesh.name = opts.name;
    return mesh;
  }

  // generate a procedural Saturn-like texture (bands) on a canvas and return THREE.Texture
  function makeSaturnProceduralTexture(){
    const w = 2048, h = 1024; const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d');
    // base gradient
    const g = ctx.createLinearGradient(0,0,w,0);
    g.addColorStop(0, '#bda36a'); g.addColorStop(0.3, '#e2cfa0'); g.addColorStop(0.5, '#c7a86a'); g.addColorStop(0.7, '#d9bf8f'); g.addColorStop(1, '#bda36a');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    // add horizontal bands with slight noise
    for(let i=0;i<200;i++){
      const y = Math.floor(h * Math.random());
      const height = 1 + Math.random()*6;
      const alpha = 0.02 + Math.random()*0.12;
      ctx.fillStyle = `rgba(${160+Math.random()*80|0},${120+Math.random()*60|0},${80+Math.random()*40|0},${alpha})`;
      ctx.fillRect(0, y, w, height);
    }
    // subtle scratches/texture
    ctx.globalAlpha = 0.08; ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    for(let i=0;i<600;i++){ ctx.beginPath(); const y = Math.random()*h; ctx.moveTo(0,y); ctx.lineTo(w, y + (Math.random()-0.5)*4); ctx.stroke(); }
    // create THREE texture
    const tex = new THREE.CanvasTexture(canvas); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1,1); tex.needsUpdate = true; return tex;
  }

  // create a ring mesh for a planet (Saturn) using a canvas texture
  function makePlanetRing(innerKm, outerKm, kmToUnit){
    const size = 2048; const canvas = document.createElement('canvas'); canvas.width = canvas.height = size; const ctx = canvas.getContext('2d');
    // draw rings radial gradient and gaps
    const cx = size/2, cy = size/2; const maxR = size*0.48; ctx.clearRect(0,0,size,size);
    for(let r=0;r<maxR;r++){
      const t = r/maxR; const shade = 200 - Math.floor(120 * Math.abs(Math.sin(t*50 + Math.random()*0.3)));
      ctx.fillStyle = `rgba(${shade},${shade},${shade},${0.6 - Math.random()*0.35})`;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas); tex.center.set(0.5,0.5); tex.needsUpdate = true;
    const inner = innerKm * kmToUnit; const outer = outerKm * kmToUnit;
    const geom = new THREE.RingGeometry(inner*1.02, outer*1.02, 256);
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent:true, opacity:0.95 });
    const mesh = new THREE.Mesh(geom, mat); mesh.rotation.x = -Math.PI/2; return mesh;
  }

  // dataset (real radii in km and orbital parameters in AU)
  const dataset = [
    { name:'Mercurio', a:0.387, period:0.241, radiusKm:2440, color:0xb2b2b2, texture:'assets/textures/mercury.jpg', inc:7.0 },
    { name:'Venus',    a:0.723, period:0.615, radiusKm:6052, color:0xe0c16a, texture:'assets/textures/venus.jpg', inc:3.39 },
    { name:'Tierra',   a:1.000, period:1.000, radiusKm:6371, color:0x2a9df4, texture:'assets/textures/earth.jpg', inc:0.0 },
    { name:'Marte',    a:1.524, period:1.881, radiusKm:3390, color:0xc1440e, texture:'assets/textures/mars.jpg', inc:1.85 },
    { name:'Júpiter',  a:5.203, period:11.862, radiusKm:69911, color:0xd9a066, texture:'assets/textures/jupiter.jpg', inc:1.31 },
    { name:'Saturno',  a:9.537, period:29.457, radiusKm:58232, color:0xf0db9a, texture:'assets/textures/saturn.jpg', inc:2.49 },
    { name:'Urano',    a:19.191, period:84.07, radiusKm:25362, color:0x7fd3e6, texture:'assets/textures/uranus.jpg', inc:0.77 },
    { name:'Neptuno',  a:30.07, period:164.8, radiusKm:24622, color:0x4062a8, texture:'assets/textures/neptune.jpg', inc:1.77 }
  ];

  // scale setup: use real radii (km) but scale them to scene units so relative sizes are accurate
  const SUN_RADIUS_KM = 696340;
  const UNIT_SUN_RADIUS = 10; // scene units chosen for Sun radius (adjust for visibility)
  const KM_TO_UNIT = UNIT_SUN_RADIUS / SUN_RADIUS_KM;

  const sun = (function(){
    const geom = new THREE.SphereGeometry(SUN_RADIUS_KM * KM_TO_UNIT, 64, 64);
    const mat = new THREE.MeshBasicMaterial({ color:0xffdd33, emissive:0xffcc66 });
    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);
    return mesh;
  })();

  // groups
  const planetGroup = new THREE.Group(); scene.add(planetGroup);
  const moonGroup = new THREE.Group(); scene.add(moonGroup);
  const labelGroup = new THREE.Group(); scene.add(labelGroup);

  // create orbits and planets
  const orbits = [];
  dataset.forEach(d=>{
    // orbit ring (thinner)
    const orbitRadius = d.a*8;
    const segs = 256;
    const orbitPts = new Float32Array(segs*3);
    for(let i=0;i<segs;i++){ const ang = (i/segs)*Math.PI*2; orbitPts[i*3]=Math.cos(ang)*orbitRadius; orbitPts[i*3+1]=0; orbitPts[i*3+2]=Math.sin(ang)*orbitRadius; }
    const orbitGeom = new THREE.BufferGeometry(); orbitGeom.setAttribute('position', new THREE.BufferAttribute(orbitPts,3));
    const orbitMat = new THREE.LineBasicMaterial({ color:0x666666, transparent:true, opacity:0.6 });
    const orbitLine = new THREE.LineLoop(orbitGeom, orbitMat);
    // tilt the orbit by its inclination (degrees) to show 3D orbital planes
    const incRad = THREE.MathUtils.degToRad(d.inc || 0);
    orbitLine.rotation.x = incRad;
    scene.add(orbitLine); orbits.push(orbitLine);

    const texturePath = d.texture || null;
    // for Saturn use procedural texture and add rings
    let planetTexture = texturePath;
    if(d.name === 'Saturno'){
      try{ planetTexture = makeSaturnProceduralTexture(); } catch(e){ planetTexture = texturePath; }
    }
    const pl = createPlanet({ name:d.name, size: Math.max(0.5, d.radiusKm * KM_TO_UNIT), color:d.color, texture: planetTexture });
    // position in orbital plane, then rotate by inclination so planets are distributed in 3D
    const initialPos = new THREE.Vector3(d.a*8, 0, 0);
    initialPos.applyAxisAngle(new THREE.Vector3(1,0,0), incRad);
    pl.position.copy(initialPos);
    pl.userData.a = d.a; pl.userData.period = d.period; pl.userData.radiusKm = d.radiusKm; pl.userData.inc = d.inc || 0;
    planetGroup.add(pl);

    // add ring for Saturn
    if(d.name === 'Saturno'){
      try{
        const innerKm = 66200; const outerKm = 140000; const ring = makePlanetRing(innerKm, outerKm, KM_TO_UNIT);
        ring.position.copy(pl.position);
        // tilt rings by Saturn axial tilt (~26.7°)
        const tilt = THREE.MathUtils.degToRad(26.7);
        ring.rotation.x = -Math.PI/2 + tilt;
        scene.add(ring);
      } catch(e){ console.warn('ring error', e); }
    }

    // label sprite
    const label = makeLabelSprite(d.name);
    label.position.copy(pl.position).add(new THREE.Vector3( (d.radiusKm*KM_TO_UNIT)+1.6, 1.2, 0));
    labelGroup.add(label);
  });

  // simple moons dataset (major satellites)
  const moons = [
    { parent:'Tierra', name:'Luna', a:0.00257, period:0.0748, radiusKm:1737, color:0x999999 },
    { parent:'Marte', name:'Fobos', a:0.000094, period:0.0007, radiusKm:11.27, color:0x888888 },
    { parent:'Marte', name:'Deimos', a:0.000156, period:0.0013, radiusKm:6.2, color:0x777777 },
    { parent:'Júpiter', name:'Io', a:0.0028*5, period:0.004, radiusKm:1822, color:0xffcc77 },
    { parent:'Júpiter', name:'Europa', a:0.0045*5, period:0.007, radiusKm:1561, color:0xddeeff },
    { parent:'Júpiter', name:'Ganimedes', a:0.0071*5, period:0.012, radiusKm:2634, color:0xd2c2b0 },
    { parent:'Saturno', name:'Titán', a:0.008, period:0.045, radiusKm:2576, color:0xffe0b2 }
  ];

  const moonMeshes = [];
  moons.forEach(m=>{
    const mesh = createPlanet({ name:m.name, size: m.radiusKm * KM_TO_UNIT, color:m.color });
    mesh.userData = m; moonGroup.add(mesh); moonMeshes.push(mesh);
  });

  // animation state
  let last = performance.now();
  let simDaysPerSec = 30;
  const speedInput = document.getElementById('speed3d');
  const speedVal = document.getElementById('speed3dVal');
  speedInput.addEventListener('input', ()=>{ simDaysPerSec = parseFloat(speedInput.value); speedVal.textContent = `${simDaysPerSec} d/s`; });

  let showMoons = true;
  document.getElementById('toggleMoons').addEventListener('click', ()=>{ showMoons = !showMoons; moonGroup.visible = showMoons; });
  document.getElementById('resetView').addEventListener('click', ()=>{ controls.reset(); camera.position.set(0,60,180); });

  // add auto-rotate control and 360 button
  const autoBtn = document.createElement('button'); autoBtn.textContent='Auto-rotar: OFF'; autoBtn.style.marginLeft='8px'; controlsRow.appendChild(autoBtn);
  let autoRotateOn = false; autoBtn.addEventListener('click', ()=>{ autoRotateOn = !autoRotateOn; controls.autoRotate = autoRotateOn; autoBtn.textContent = 'Auto-rotar: ' + (autoRotateOn? 'ON':'OFF'); });
  const rotate360Btn = document.createElement('button'); rotate360Btn.textContent='Girar 360°'; rotate360Btn.style.marginLeft='8px'; controlsRow.appendChild(rotate360Btn);
  // rotate camera around current target a full 360 degrees
  function rotateCamera360(duration=2200){
    if(controls.isRotating) return;
    controls.isRotating = true;
    const start = performance.now();
    const startAz = Math.atan2(camera.position.z - controls.target.z, camera.position.x - controls.target.x);
    const radius = Math.hypot(camera.position.x - controls.target.x, camera.position.z - controls.target.z);
    const startPolar = Math.atan2(camera.position.y - controls.target.y, radius);
    // disable user controls during animation
    const wasEnabled = controls.enabled;
    controls.enabled = false;
    function step(now){
      const t = Math.min(1,(now-start)/duration);
      const eased = t<.5 ? 2*t*t : -1 + (4 - 2*t)*t;
      const az = startAz + eased * Math.PI*2;
      const x = controls.target.x + Math.cos(az) * radius;
      const z = controls.target.z + Math.sin(az) * radius;
      const y = controls.target.y + Math.tan(startPolar) * radius;
      camera.position.set(x, y, z);
      camera.lookAt(controls.target);
      renderer.render(scene, camera);
      if(t<1) requestAnimationFrame(step);
      else { controls.enabled = wasEnabled; controls.isRotating = false; }
    }
    requestAnimationFrame(step);
  }
  rotate360Btn.addEventListener('click', ()=> rotateCamera360(2200));
  const centerSunBtn = document.createElement('button'); centerSunBtn.textContent = 'Centrar en Sol'; centerSunBtn.style.marginLeft='8px'; controlsRow.appendChild(centerSunBtn);
  centerSunBtn.addEventListener('click', ()=>{
    // set controls target to Sun and move camera back to a good distance
    controls.target.set(0,0,0);
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    const desired = new THREE.Vector3().addVectors(controls.target, dir.multiplyScalar(180));
    camera.position.copy(desired); camera.lookAt(controls.target);
  });

  // raycaster for clicks
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  function onClick(e){
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObjects(planetGroup.children.concat(moonGroup.children));
    if(intersect.length>0){
      const obj = intersect[0].object;
      const targetPos = new THREE.Vector3().copy(obj.position);
      // If in fly (free) mode, move camera close and look at the object
      if(flyMode){
        const dir = new THREE.Vector3().subVectors(camera.position, targetPos).normalize();
        const newPos = new THREE.Vector3().addVectors(targetPos, dir.multiplyScalar( Math.max( (obj.geometry.parameters.radius||1)*6, 10 ) ));
        const start = performance.now(); const from = camera.position.clone(); const duration = 600;
        function step(now){ const t = Math.min(1,(now-start)/duration); const eased = 1 - Math.pow(1-t,3); camera.position.lerpVectors(from, newPos, eased); camera.lookAt(targetPos); if(t<1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      } else {
        // orbit mode: keep Sun as rotation center, move camera toward object but keep controls.target at Sun (0,0,0)
        const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
        const newPos = new THREE.Vector3().addVectors(targetPos, dir.multiplyScalar( Math.max( (obj.geometry.parameters.radius||1)*6, 20 ) ));
        const start = performance.now(); const from = camera.position.clone(); const duration = 600;
        function step(now){ const t = Math.min(1,(now-start)/duration); const eased = 1 - Math.pow(1-t,3); camera.position.lerpVectors(from, newPos, eased); camera.lookAt(controls.target); if(t<1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      }
      showInfoPanel(obj.userData || { name: obj.name });
    }
  }
  renderer.domElement.addEventListener('click', onClick);

  function animate(){
    const now = performance.now(); const dt = (now-last)/1000; last = now;
    const yearsPerSec = (simDaysPerSec/365.25);
    const deltaYears = dt * yearsPerSec;

    // rotate planets along orbits
    planetGroup.children.forEach(pl=>{
      const a = pl.userData.a; const period = pl.userData.period;
      const angle = (now/1000) * 0.2 * (1/period);
      const base = new THREE.Vector3(Math.cos(angle)*a*8, 0, Math.sin(angle)*a*8);
      const inc = THREE.MathUtils.degToRad(pl.userData.inc || 0);
      base.applyAxisAngle(new THREE.Vector3(1,0,0), inc);
      pl.position.copy(base);
    });

    // moons orbit parents
    moonMeshes.forEach(m=>{
      const parent = planetGroup.children.find(p=>p.name===m.userData.parent);
      if(parent){
        const a = m.userData.a*60; const per = m.userData.period;
        const ang = (now/1000) * 0.5 * (1/(per+1e-6));
        m.position.copy(parent.position).add(new THREE.Vector3(Math.cos(ang)*a, 0, Math.sin(ang)*a));
      }
    });

    // update label positions to follow planets
    labelGroup.children.forEach((lab, i)=>{
      const pl = planetGroup.children[i]; if(pl) lab.position.copy(pl.position).add(new THREE.Vector3((pl.geometry.parameters.radius||1)+1.6,1.2,0));
    });

    // smooth auto-rotate of whole planetary group if controls.autoRotate active
    if(controls.autoRotate){ planetGroup.rotation.y += 0.0005 * (controls.autoRotateSpeed || 1); }

    // update controls (Orbit or Fly)
    if(flyControls.enabled){ flyControls.update(dt); }
    controls.update(); renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', ()=>{ camera.aspect = width()/height(); camera.updateProjectionMatrix(); renderer.setSize(width(), height()); });

  // start
  animate();

  // helper: create text sprite for labels
  function makeLabelSprite(text){
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); const size = 256; canvas.width = size; canvas.height = 64; ctx.fillStyle='rgba(0,0,0,0)'; ctx.fillRect(0,0,size,64); ctx.font='24px sans-serif'; ctx.fillStyle='white'; ctx.textAlign='center'; ctx.fillText(text, size/2, 40);
    const tex = new THREE.CanvasTexture(canvas); tex.needsUpdate = true; const mat = new THREE.SpriteMaterial({ map: tex, transparent:true }); const sp = new THREE.Sprite(mat); sp.scale.set(6,1.6,1); return sp;
  }

  // helper: info panel display
  function showInfoPanel(data){
    const infoHtml = `<div class="results-header"><h3>${data.name||data.title}</h3></div>` +
      `<div style="padding:8px;">` +
      `<div><strong>Masa:</strong> ${data.massKg?Number(data.massKg).toExponential(4)+' kg':'n/d'}</div>` +
      `<div><strong>Radio medio:</strong> ${data.meanRadiusKm?data.meanRadiusKm+' km':'n/d'}</div>` +
      `<div><strong>Gravedad:</strong> ${data.gravityMs2?data.gravityMs2+' m/s²':'n/d'}</div>` +
      `<div><strong>Satélites:</strong> ${(data.satellites && data.satellites.length)?data.satellites.join(', '):'Ninguno'}</div>` +
      `<div style="margin-top:6px">${data.official?('<a href="'+data.official.nasa+'" target="_blank">Ficha NASA</a> • <a href="'+data.official.wikipedia+'" target="_blank">Wikipedia</a>') : ''}</div>` +
      `</div>`;
    const infoEl = document.getElementById('solar3dInfo');
    if(!infoEl){ const el = document.createElement('div'); el.id='solar3dInfo'; el.className='results-container'; el.style.marginTop='10px'; el.innerHTML = infoHtml; container.appendChild(el); }
    else infoEl.innerHTML = infoHtml;
  }

})();
