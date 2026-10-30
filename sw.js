/* Cooperativa — service worker v22
   Estáticos (app, ícones, pdf-lib, modelo RCP): Cache First com pré-cache por versão.
   Navegação: Network First com 3 s de limite; sem rede responde a app guardada.
   Supabase (outra origem, com cabeçalhos apikey/x-coop-part/x-coop-admin): só rede, nunca guardado em cache.
   A fila de sincronização cifrada da app trata do envio quando houver rede. */
const V="rcp-v22-5-2";
const CORE=["./","index.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png","icon-maskable-192.png","icon-maskable-512.png","icon-180.png"];
const LAZY=["pdf-lib.min.js","rcp-modelo.pdf","sc-ocorrencia.png","sc-pdf.png","sc-viatura.png","sc-colega.png","screenshot-1.webp","screenshot-1.png"];
const NAV_TIMEOUT=3000;
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(V);
 await c.addAll(CORE.map(u=>new Request(u,{cache:"reload"})));
 await Promise.all(LAZY.map(u=>c.add(new Request(u,{cache:"reload"})).catch(()=>{})));
 const k=await caches.keys();const old=k.filter(x=>x!==V).map(x=>/^rcp-v(\d+)(?:-\d+)?$/.exec(x)).filter(Boolean).map(m=>+m[1]);
 if(!old.length||Math.max(...old)<22)await self.skipWaiting()})())});
self.addEventListener("message",e=>{if(e.data&&e.data.t==="skip")self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&/^rcp-/.test(x)).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const OFF='<!doctype html><html lang="pt-PT"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sem rede</title><body style="margin:0;background:#1a1b26;color:#c0caf5;font:16px system-ui;display:grid;place-items:center;height:100vh;text-align:center"><div><h1 style="color:#7aa2f7">Sem rede, tudo guardado</h1><p>Abra a aplicação de novo quando houver ligação.</p></div>';
async function netFirst(req){const ac=new AbortController();const t=setTimeout(()=>ac.abort(),NAV_TIMEOUT);
 try{const r=await fetch(req,{signal:ac.signal});clearTimeout(t);if(r&&r.ok&&r.type==="basic"){const c=await caches.open(V);c.put("./",r.clone())}return r}
 catch(_){clearTimeout(t);return (await caches.match("./"))||(await caches.match("index.html"))||new Response(OFF,{headers:{"Content-Type":"text/html; charset=utf-8"}})}}
async function cacheFirst(req){const h=await caches.match(req,{ignoreSearch:true});if(h)return h;
 try{const r=await fetch(req);if(r&&r.ok&&r.type==="basic"){const c=await caches.open(V);c.put(req,r.clone())}return r}catch(_){return (await caches.match("./"))||Response.error()}}
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET")return;const u=new URL(q.url);
 if(u.origin!==location.origin)return;
 if(q.mode==="navigate"){e.respondWith(netFirst(q));return}
 e.respondWith(cacheFirst(q))});
self.addEventListener("notificationclick",e=>{e.notification.close();const a=(e.notification.data&&e.notification.data.a)||"";
e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{for(const c of l)if("focus"in c){if(a)c.postMessage({a});return c.focus()}return clients.openWindow(a?"./?a="+a:"./")}))});
