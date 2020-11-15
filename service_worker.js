//==========
// ServiceWorker

const CACHE_VERSION = "cache_0.4.6";
const CACHE_FILES = [
	"./pwa/index.html",
	"./pwa/css/custom.css",
	"./pwa/js/sketch.js",
	"./pwa/js/utility.js",
	"./pwa/libs/jquery/jquery.js",
	"./pwa/libs/jquery/jquery.min.js",
	"./pwa/libs/hammer/hammer.js",
	"./pwa/libs/hammer/hammer.min.js",
	"./pwa/pwa/libs/glfx/glfx.js",
	"./pwa/libs/glfx/utility.js",
	"./pwa/images/icons/favicon.ico",
	"./pwa/pwa/images/icons/icon152x152.png",
	"./pwa/images/icons/icon192x192.png",
	"./pwa/images/icons/icon512x512.png",
	"./pwa/images/logo512x512.png",
	"./pwa/images/crt_body.png",
	"./pwa/images/crt_frame.png",
	"./pwa/images/scanline.png"
];

// Place files that need to be executed offline 
// in the offline cache area.
// Check it out: Console -> Application -> Cache Storage
self.addEventListener("install", (e)=>{
	console.log("install", e);
	e.waitUntil(caches.open(CACHE_VERSION).then((cache)=>{
		return cache.addAll(CACHE_FILES);
	}));
});

// Delete caches that are not on the whitelist.
self.addEventListener("activate", (e)=>{
	console.log("activate", e);
	let cacheWhitelist = [CACHE_VERSION];
	e.waitUntil(caches.keys().then(function(keyList){
		return Promise.all(keyList.map(function(key){
			if(cacheWhitelist.indexOf(key) === -1){
				return caches.delete(key);}
			}));
		})
	);
});

// If there is data in the cache, 
// use it as it is, if not, request it.
self.addEventListener("fetch", (e)=>{
	e.respondWith(caches.match(e.request).then((res)=>{
		if(res) return res;
		return fetch(e.request);
	}));
});