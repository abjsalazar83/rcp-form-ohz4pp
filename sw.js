const V="rcp-v7";const F=["./","index.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png","icon-maskable-512.png","icon-180.png","sc-ocorrencia.png","sc-pdf.png","sc-colega.png","sc-viatura.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;
const nav=e.request.mode==="navigate";
e.respondWith(caches.match(nav?"./":e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(n=>{if(n.ok){const c=n.clone();caches.open(V).then(x=>x.put(e.request,c))}return n}).catch(()=>caches.match("./"))))});
