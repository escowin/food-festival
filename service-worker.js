// Service workers do NOT need webpack to work. Because the application is already using webpack, we'll only need to prepend the names of the JavaScript files to cache in the dist/ folder. Other than that, the steps to add a service worker to an application without webpack are exactly the same
const APP_PREFIX = "FoodFest-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

// defines files to cache. relative pathing needed to work in development & production. images not included since browser cache limits range from 50MB to 250MB
const FILES_TO_CACHE = [
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js",
];

// service workers run before `window` object is created. `self` keyword instantiates listeners to service worker.
self.addEventListener("install", function (e) {
  // installs service worker. method tells browser to wait until work is complete before terminating service worker
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// clears out old data from cache & manages caches
self.addEventListener("activate", function (e) {
  e.waitUntil(
    // returns array of all cache names as `keyList`. this parameter conatins all cache names under <username>.github.io
    caches.keys().then(function (keyList) {
      // filters caches that use this app's prefix
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // adds current cache to the array
      cacheKeeplist.push(CACHE_NAME);

      // resolves once all old version of the cache have been deleted
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// tells application how to retrieve cache data
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  // intercepts fetch requests.
  e.respondWith(
    // deterines if resource already exists in cache
    caches.match(e.request).then(function (request) {
      console.log(e.request.url)
      return request || fetch(e.request)
    })
  );
});
