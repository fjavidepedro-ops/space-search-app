#!/usr/bin/env node
// search-fuzz.js
// Simple fuzz tester for a web search endpoint or frontend search API.
// Usage:
//   node search-fuzz.js --url "http://localhost:8000/search?q=" --concurrency 10 --count 200

const fs = require('fs');
const { argv } = require('process');

function parseArgs() {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i+1] && !argv[i+1].startsWith('--') ? argv[++i] : true;
      args[k] = v;
    }
  }
  return args;
}

const args = parseArgs();
const baseUrl = args.url || 'http://localhost:8000/search?q=';
const concurrency = parseInt(args.concurrency || '8', 10);
const total = parseInt(args.count || '200', 10);
const outFile = args.out || 'search-fuzz-results.json';

const queries = [
  'earth',
  'mars',
  '¿qué es una estrella?',
  '寿司',
  'emoji 😀🚀',
  '<script>alert(1)</script>',
  "' OR '1'='1", // SQL-injection-like
  'a'.repeat(10),
  'a'.repeat(100),
  'a'.repeat(1000),
  'select * from users where name="admin"',
  'DROP TABLE users; --',
  "\u0000\u0001\u0002", // control chars
  '💥★☆彡',
  'longword'.repeat(50),
  'normal query example',
  'find satellites near me',
  '¿cómo desplegar en google cloud?',
  '!!@@##$$%%^^&&**()__++',
  Array(300).fill('word').join(' '),
];

// extend queries to reach total
while (queries.length < total) {
  const pick = queries[Math.floor(Math.random()*queries.length)];
  const suffix = Math.random() < 0.2 ? (' ' + Math.random().toString(36).slice(2)) : '';
  queries.push(pick + suffix);
}

const results = [];

async function fetchOne(q) {
  const url = baseUrl + encodeURIComponent(q);
  const start = Date.now();
  try {
    const res = await fetch(url, { method: 'GET' });
    const text = await res.text();
    const duration = Date.now() - start;
    return { query: q, url, status: res.status, ok: res.ok, duration, length: text.length };
  } catch (err) {
    const duration = Date.now() - start;
    return { query: q, url, error: String(err), duration };
  }
}

async function runAll() {
  console.log('Starting fuzz run:', total, 'queries ->', baseUrl);
  const pool = [];
  let index = 0;

  function next() {
    if (index >= total) return null;
    const q = queries[index++];
    return fetchOne(q).then(r=>{ results.push(r); process.stdout.write('.'); }).catch(e=>{ results.push({error:String(e)}); process.stdout.write('E'); });
  }

  for (let i=0;i<concurrency;i++) {
    const p = (async function loop(){
      while(true){
        const job = next();
        if (!job) break;
        await job;
      }
    })();
    pool.push(p);
  }

  await Promise.all(pool);
  console.log('\nDone. Writing results to', outFile);
  fs.writeFileSync(outFile, JSON.stringify({meta:{baseUrl, total, concurrency, timestamp: new Date().toISOString()}, results}, null, 2));
}

runAll().catch(err=>{ console.error(err); process.exit(1); });
