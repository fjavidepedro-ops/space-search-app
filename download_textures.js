// download_textures.js
// Simple Node script to download public-domain / Wikimedia planet images into assets/textures/
// Usage: node download_textures.js
const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'assets', 'textures');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = [
  { url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg', name: 'mercury.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg', name: 'venus.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg', name: 'earth.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg', name: 'mars.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg', name: 'jupiter.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg', name: 'saturn.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg', name: 'uranus.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg', name: 'neptune.jpg' }
];

function download(url, dest){
  const timeoutMs = 25000;
  const maxRedirects = 5;

  return new Promise((resolve, reject)=>{
    const cleanupAndReject = (err)=>{
      fs.unlink(dest, ()=>{});
      reject(err);
    };

    const requestWithRedirects = (currentUrl, redirectsLeft)=>{
      const file = fs.createWriteStream(dest);
      const req = https.get(currentUrl, res=>{
        const status = res.statusCode || 0;

        if(status >= 300 && status < 400 && res.headers.location){
          file.close(()=> fs.unlink(dest, ()=>{}));
          if(redirectsLeft <= 0){
            cleanupAndReject(new Error('Too many redirects for ' + url));
            return;
          }
          requestWithRedirects(res.headers.location, redirectsLeft - 1);
          return;
        }

        if(status !== 200){
          file.close(()=> fs.unlink(dest, ()=>{}));
          cleanupAndReject(new Error('Failed to download ' + currentUrl + ' status ' + status));
          return;
        }

        res.pipe(file);
        file.on('finish', ()=> file.close(()=> resolve(dest)));
      });

      req.setTimeout(timeoutMs, ()=>{
        req.destroy(new Error('Timeout after ' + timeoutMs + 'ms for ' + currentUrl));
      });

      req.on('error', cleanupAndReject);
      file.on('error', cleanupAndReject);
    };

    requestWithRedirects(url, maxRedirects);
  });
}

(async ()=>{
  console.log('Downloading textures to', outDir);
  const queue = files.filter(f=> !fs.existsSync(path.join(outDir, f.name)));
  const concurrency = 3;

  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async ()=>{
    while(queue.length){
      const f = queue.shift();
      if(!f) break;

      const dest = path.join(outDir, f.name);
      try{
        console.log('Downloading', f.url);
        await download(f.url, dest);
        console.log('Saved', dest);
      }
      catch(e){
        console.error('Error', e.message);
      }
    }
  });

  for(const f of files){
    const dest = path.join(outDir, f.name);
    if(fs.existsSync(dest)) console.log('Exists:', f.name);
  }

  await Promise.all(workers);
  console.log('Done.');
})();
