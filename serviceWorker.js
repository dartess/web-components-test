self.addEventListener('install', event => {
    console.log('install');
    console.log(event);
});

self.addEventListener('activate', event => {
    console.log('activate');
    console.log(event);
});