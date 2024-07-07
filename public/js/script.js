const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });
    }, (error) => console.log(error), {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

// Initialize the map and set its view
const map = L.map("map").setView([0, 0],16);

// Add a tile layer to the map

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker to the map when a location is received
const marker={};


// adding marker
socket.on("receive-location",(data)=>{
    const {id, latitude,longitude}=data;
    map.setView([latitude,longitude]);
    if (marker[id]) {
        marker[id].setLatlng([latitude,longitude])
    }
    else{
        marker[id]=L.marker([latitude,longitude]).addTo(map)
    }
})


// removing marker
socket.on("user-disconnected",(id)=>{
if (marker[id]) {
    map.removeLayer(marker[id]);
    delete marker[id]
}
})