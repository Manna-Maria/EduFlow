const v = require('./controllers/videoController'); console.log('exports:', Object.keys(v)); console.log('types:'); Object.entries(v).forEach(([k,fn])=>console.log(k, typeof fn));
