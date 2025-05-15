export function initMap(divId = 'mapaG1', center = [-17.3747, -66.1568], zoom = 15) {
     if (!window.mapaGasolineras) {
          window.mapaGasolineras = L.map(divId).setView(center, zoom);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
               attribution: '&copy; OpenStreetMap contributors'
          }).addTo(window.mapaGasolineras);
     }
}

export function clearMarkers() {
     if (!window.mapaGasolineras) return;
     window.mapaGasolineras.eachLayer(layer => {
          if (layer instanceof L.Marker) {
               window.mapaGasolineras.removeLayer(layer);
          }
     });
}

export function addMarkers(estaciones) {
     if (!window.mapaGasolineras) return;
     estaciones.forEach(est => {
          if (est.coords) {
               L.marker(est.coords)
                    .addTo(window.mapaGasolineras)
                    .bindPopup(`<strong>${est.nombre}</strong><br>${est.direccion}`);
          }
     });
}