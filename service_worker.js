//==========
// ServiceWorker

const CACHE_VERSION = "cache_0.1.8";
const CACHE_FILES = [
	"./index.html",
	"./css/custom.css",
	"./js/sketch.js",
	"./js/utility.js",
	"./libs/jquery/jquery.js",
	"./libs/jquery/jquery.min.js",
	"./images/icons/favicon.ico",
	"./images/icons/icon152x152.png",
	"./images/icons/icon192x192.png",
	"./images/icons/icon512x512.png",
	"./images/logo512x512.png",
	"./samples/index.html",
	"./samples/images/food_01.png",
	"./samples/images/food_02.png",
	"./samples/images/food_03.png",
	"./samples/js/sketch.js",
	"./samples/js/utility.js",
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