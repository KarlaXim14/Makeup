

let static_cache = 'static_v2'; 
let dynamic_cache = 'dynamic_v1'; 
let inmutable_cache = 'inmutable_v1'; 

//Se agregan los archivos al cache static
let files_appShell = [
    "/",
    "index.html",
    "main.js",
    "not-found.html",
    "diseño.css",
    "manifest.json",
    "./images/361332.png",
    "./images/Articulos/Base.jpg",
    "./images/Articulos/Brochas.jpg",
    "./images/Articulos/Bronceador.jpg",
    "./images/Articulos/Caja.jpg",
    "./images/Articulos/Correctores.jpg",
    "./images/Articulos/Esponja.jpg",
    "./images/Articulos/Kit Brochas.jpg",
    "./images/Articulos/Labiales.jpg",
    "./images/Articulos/Som.jpg",
    "./images/Articulos/Sombasex.jpg",
    "./images/Articulos/Sombras.jpg",
];
//Se crea el cache inmutable
let inmutableFiles = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    
    
];

//intalacion del SW
self.addEventListener('install', result => {
    console.log("SW instalado")
    

    const openStatic = caches.open(static_cache).then(cache => {
        cache.addAll(files_appShell);
    });

    const openInmutable = caches.open(inmutable_cache).then(cache => {
        cache.addAll(inmutableFiles);
    });

    //Este metodo hace todas las promesas que esten dentro en una sola
    result.waitUntil(
        Promise.all([
            openStatic,
            openInmutable
        ])
    );

})
self.addEventListener('activate', event => {

    console.log("SW activado")
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!static_cache.includes(key) && key.includes('static')) {
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log('V2 lista para manejar las recuperaciones!');
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(
        cacheResponse => {
            //Si estuvo en cache, lo va a regresar
            if (cacheResponse) return cacheResponse;
            //Sino estuvo en cache, lo va a buscar a la red
            return fetch(event.request).then(
                networkResponse => {
                    caches.open(dynamic_cache).then(cache => {
                        cache.put(event.request, networkResponse)
                        // Tarea: Funcion de limpiar el cache
                    })
                }
            )
        }
    ))

})

self.addEventListener('message', msj => {
    //Revisar si el msj tiene el mensaje skipWaiting
    if (msj.data.action == 'skipWaiting') {
        self.skipWaiting();

    }
})


