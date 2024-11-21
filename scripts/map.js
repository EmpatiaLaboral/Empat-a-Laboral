// Definir los colores de cada sector usando AwesomeMarkers
const coloresPorSector = {
  "Tecnología": "blue",
  "Tienda": "green",
  "Educación": "purple",
  "Salud": "red",
  "Construcción": "orange",
  "Finanzas": "darkblue",
  "Deportes": "cadetblue",
  "Turismo": "pink",
  "Otros": "brown"
};












function getPopupContent(empresa) {
  if (!empresa || !empresa.nombre || !empresa.lat || !empresa.lng) {
      console.error("Datos incompletos para generar el popup:", empresa);
      return "<b>Error: Datos incompletos</b>";
  }

  const promedioEstrellas = typeof mostrarPromedioEstrellas === 'function'
      ? mostrarPromedioEstrellas(empresa.lat, empresa.lng, true)
      : 0;

  const estrellas = Array(5).fill("☆")
      .map((estrella, index) => index < Math.round(promedioEstrellas) ? "★" : estrella)
      .join("");

  const popupContent = `<b>${empresa.nombre}</b><br>
                        <strong>Promedio de Estrellas:</strong> <span style="color: gold; font-size: 1.2em;">${estrellas}</span><br>`
  return popupContent;
}

  // Función para agregar eventos a los marcadores
  function addMarkerEventHandlers(marker, empresa) {
    marker.on('click', function (e) {
      const eventoEmpresaSeleccionada = new CustomEvent("empresaSeleccionada", {
        detail: { lat: empresa.lat, lng: empresa.lng, nombreEmpresa: empresa.nombre }
      });
      document.dispatchEvent(eventoEmpresaSeleccionada);
    });
  }


function crearMarcadorEmpresa(empresa) {
  const colorChincheta = coloresPorSector[empresa.sector] || "gray";
  const iconoChincheta = L.AwesomeMarkers.icon({
      icon: 'briefcase',
      markerColor: colorChincheta,
      prefix: 'fa'
  });

  const marker = L.marker([empresa.lat, empresa.lng], { title: empresa.nombre, icon: iconoChincheta })
      .addTo(map)
      .bindPopup(getPopupContent(empresa))
      .bindTooltip(empresa.nombre, { direction: "top", opacity: 0.8 });
  addMarkerEventHandlers(marker, empresa);
  empresa.marker = marker; // Asigna el marcador a la empresa
}

document.addEventListener("DOMContentLoaded", function () {
  const empresasRef = db.collection('empresas').limit(100);

  empresasRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const empresa = change.doc.data();
            // Evitar duplicados comparando latitud y longitud
            if (!empresas.some(e => e.lat === empresa.lat && e.lng === empresa.lng)) {
                empresas.push(empresa);
                crearMarcadorEmpresa(empresa);
            }
        }
    });
});

      
      });




// Archivo: map.js

document.addEventListener("DOMContentLoaded", function () {

  // Inicializar el mapa
  if (typeof L !== 'undefined' && document.getElementById('map')._leaflet_id) {
    console.log("El mapa ya está inicializado.");
    window.map = L.map(document.getElementById('map')._leaflet_id); // Reutilizar instancia existente
} else {
    window.map = L.map('map', {
        maxBounds: [[-85, -180], [85, 180]], // Limitar el área visible del mapa
        maxBoundsViscosity: 1.0, // Restringir completamente la vista a los límites
        minZoom: 2 // Limitar el nivel de zoom mínimo
    }).setView([20, 0], 2);
}



  // Añadir capas base: calle y satélite
  const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  // Control de capas
  const baseLayers = {
    "Vista de Calles": streetLayer,
    "Vista Satélite": satelliteLayer
  };

  L.control.layers(baseLayers).addTo(map);

  // Almacenar empresas temporalmente en el cliente
  window.empresas = JSON.parse(localStorage.getItem('empresas')) || [];

  function escucharEmpresasEnArea(latMin, latMax, lngMin, lngMax) {
    const empresasRef = db.collection('empresas')
        .where('lat', '>=', latMin)
        .where('lat', '<=', latMax); // Filtro por latitud

    empresasRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const empresa = change.doc.data();
                
                // Filtrar manualmente por longitud
                if (
                    empresa.lng >= lngMin &&
                    empresa.lng <= lngMax &&
                    !empresas.some(e => e.lat === empresa.lat && e.lng === empresa.lng)
                ) {
                    empresas.push(empresa);
                    crearMarcadorEmpresa(empresa);
                }
            }
        });
    });
}


  function actualizarLocalStorage() {
    // Guardar solo los datos esenciales de cada empresa
    const empresasSimplificadas = empresas.map(({ nombre, sector, direccion, lat, lng, creador }) => ({
        nombre: nombre || "Sin nombre",
        sector: sector || "Otros",
        direccion: direccion || "Sin dirección",
        lat: lat,
        lng: lng,
        creador: creador || "invitado"
    }));
  
    localStorage.setItem("empresas", JSON.stringify(empresasSimplificadas));
  
    // Guardar las empresas en Firestore
    const batch = db.batch();
    const empresasCollectionRef = db.collection('empresas'); // Referencia sin limit
    const empresasRef = db.collection('empresas').limit(100); // Para leer empresas existentes
    
    empresasSimplificadas.forEach((empresa) => {
        if (empresa.lat && empresa.lng) { // Asegurar que las coordenadas sean válidas
            const docRef = empresasCollectionRef.doc(`${empresa.lat}_${empresa.lng}`); // Usar la referencia sin limit
            batch.set(docRef, empresa);
        } else {
            console.warn("Empresa con datos incompletos omitida:", empresa);
        }
    });
    
  
    batch.commit()
        .then(() => console.log("Empresas sincronizadas con Firebase."))
        .catch((error) => console.error("Error al sincronizar empresas con Firebase:", error));
  }

  

  // Función para buscar una empresa específica en Overpass API
  function buscarEmpresa(nombreEmpresa) {
    const query = `
      [out:json];
      node["name"~"${nombreEmpresa}", i];
      out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al obtener datos de Overpass API: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.elements.length === 0) {
          alert('No se encontró ninguna empresa con ese nombre.');
          return;
        }
        if (data.elements.length > 0) {
          map.setView([data.elements[0].lat, data.elements[0].lon], 17); // Centrar el mapa en la primera empresa encontrada
        }
        data.elements.forEach(function (element) {
          if (element.lat && element.lon) {
            const nombre = element.tags.name || "Empresa sin nombre";
            const lat = element.lat;
            const lng = element.lon;

            const nuevaEmpresa = {
              nombre: nombre,
              lat: lat,
              lng: lng,
              creador: "sistema",
              reseñas: []
            };
            empresas.push(nuevaEmpresa);
            actualizarLocalStorage();

            const marker = L.marker([lat, lng], { title: nombre }).addTo(map);
            marker.bindPopup(getPopupContent(nuevaEmpresa)).openPopup();
            marker.bindTooltip(nombre, { permanent: true, direction: 'top', opacity: 0.8 });
            addMarkerEventHandlers(marker, nuevaEmpresa);
          }
        });
      })
      .catch(error => {
        console.error('Error al cargar datos desde Overpass API:', error);
        alert('Error al cargar datos desde Overpass API. Verifica la conexión a internet o la disponibilidad de Overpass API.');
      });
  }

  function guardarEmpresaSinDuplicados(empresa) {
    const empresasRef = db.collection('empresas').limit(100);

    empresasRef.where('direccion', '==', empresa.direccion).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                // Si no hay duplicados, guarda la empresa
                empresasRef.add(empresa)
                    .then(() => console.log("Empresa guardada en Firebase."))
                    .catch((error) => console.error("Error al guardar la empresa en Firebase:", error));
            } else {
                console.warn("Ya existe una empresa con la misma dirección en Firebase:", empresa.direccion);
            }
        })
        .catch((error) => console.error("Error al verificar duplicados en Firebase:", error));
}

map.on('moveend', function () {
  const bounds = map.getBounds();
  const latMin = bounds.getSouth();
  const latMax = bounds.getNorth();
  const lngMin = bounds.getWest();
  const lngMax = bounds.getEast();

  escucharEmpresasEnArea(latMin, latMax, lngMin, lngMax);
});



  

  // Mostrar empresas guardadas
  empresas.forEach(function (empresa) {
    // Validar que la empresa tiene latitud, longitud, y sector definidos
    if (empresa.lat && empresa.lng && empresa.sector) {
      // Asegurarse de que el marcador no se crea si ya existe
      if (!empresa.marker) {
        // Obtener el color de la chincheta basado en el sector o usar un color predeterminado
        const colorChincheta = coloresPorSector[empresa.sector] || "gray";

        // Verificar que AwesomeMarkers esté disponible antes de crear el icono
        if (typeof L.AwesomeMarkers !== 'undefined') {
          const iconoChincheta = L.AwesomeMarkers.icon({
            icon: 'briefcase',
            markerColor: colorChincheta,
            prefix: 'fa'
          });

          // Crear el marcador y asignarlo a la empresa
          const marker = L.marker([empresa.lat, empresa.lng], { title: empresa.nombre, icon: iconoChincheta })
            .addTo(map)
            .bindPopup(getPopupContent(empresa))
            .bindTooltip(empresa.nombre, { direction: 'top', opacity: 0.8 });

          addMarkerEventHandlers(marker, empresa);
          empresa.marker = marker; // Asignar el marcador a la empresa
        } else {
          console.warn('L.AwesomeMarkers no está definido. Asegúrate de que el script de AwesomeMarkers esté cargado.');
        }
      }
    } else {
      console.warn('Empresa con datos incompletos en localStorage:', empresa);
    }
    // Escuchar el evento "nuevaEmpresa" para añadir una nueva empresa en el mapa
    document.addEventListener("nuevaEmpresa", function (e) {
      const empresa = e.detail;

      // Añadir la nueva empresa al array y al localStorage
      empresas.push(empresa);
      actualizarLocalStorage(); // Guarda solo los datos necesarios

      // Crear el marcador en el mapa para la nueva empresa
      crearMarcadorEmpresa(empresa);
    });


  

    document.addEventListener("direccionSeleccionada", function (e) {
      const { lat, lng } = e.detail;
      console.log("Evento direccionSeleccionada recibido en map.js con coordenadas:", lat, lng);
      if (window.map) {
          window.map.setView([lat, lng], 17); // Centrar el mapa
      } else {
          console.error("El mapa no está definido.");
      }
  });

  


  });

  // Escuchar evento de aplicación de filtros
  document.addEventListener("aplicarFiltrosMapa", function (event) {
    const { sectores, valoracionMin } = event.detail;

    empresas.forEach(empresa => {
      // Verificar que la función mostrarPromedioEstrellas exista y calcular el promedio de valoraciones
      const promedioValoracion = typeof mostrarPromedioEstrellas === 'function'
        ? mostrarPromedioEstrellas(empresa.lat, empresa.lng, true)
        : 0; // Asignar 0 si no se encuentra la función

      // Aplicar el filtro de sector y valoración mínima
      if (sectores.includes(empresa.sector) && promedioValoracion >= valoracionMin) {
        if (!map.hasLayer(empresa.marker)) {
          empresa.marker.addTo(map); // Añadir marcador si pasa el filtro
        }
      } else {
        if (map.hasLayer(empresa.marker)) {
          map.removeLayer(empresa.marker); // Remover marcador si no pasa el filtro
        }
      }
    });
  });


  // Escuchar evento de restablecimiento de filtros
  document.addEventListener("restablecerFiltrosMapa", function () {
    empresas.forEach(empresa => {
      if (!map.hasLayer(empresa.marker)) {
        empresa.marker.addTo(map); // Asegurar que todos los marcadores se muestren al restablecer
      }
    });
  });



// Cambiar el cursor y mostrar el popup de agregar empresa al seleccionar el modo de añadir
let addingMode = false;
const addButton = L.control({ position: 'topright' });

addButton.onAdd = function () {
    const div = L.DomUtil.create('div', 'add-button');
    div.innerHTML = '<button id="toggleAddMode">Añadir Empresa</button>';
    L.DomEvent.disableClickPropagation(div);
    return div;
};
addButton.addTo(map);

// Evento del botón para alternar el modo de añadir y cambiar el cursor
document.getElementById('toggleAddMode').addEventListener('click', function (e) {
    e.stopPropagation();
    addingMode = !addingMode;
    this.textContent = addingMode ? 'Salir de Modo Añadir' : 'Añadir Empresa';
    map.getContainer().style.cursor = addingMode ? 'crosshair' : ''; // Cambia el cursor a 'crosshair' en modo añadir
});

// Función para mostrar el popup de añadir empresa en la ubicación seleccionada
function mostrarPopupAgregarEmpresa(lat, lng) {
    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
        <label>Sector Laboral:</label>
        <select id="popupSectorSelect" required>
            <option value="" disabled selected>Selecciona un sector</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Tienda">Tienda</option>
            <option value="Educación">Educación</option>
            <option value="Salud">Salud</option>
            <option value="Construcción">Construcción</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Deportes">Deportes</option>
            <option value="Turismo">Turismo</option>
            <option value="Otros">Otros</option>
        </select>
        <br>
        <label>Nombre de la Empresa:</label>
        <input type="text" id="popupNombreEmpresa" placeholder="Introduce el nombre de la empresa" required>
        <br>
        <button id="popupAgregarEmpresaBtn">Listo</button>
    `;

    // Crear un popup en la posición especificada
    const popup = L.popup()
        .setLatLng([lat, lng])
        .setContent(popupContent)
        .openOn(map);

    // Evento del botón "Listo" dentro del popup
    popupContent.querySelector('#popupAgregarEmpresaBtn').addEventListener('click', function () {
        const nombre = popupContent.querySelector('#popupNombreEmpresa').value.trim();
        const sector = popupContent.querySelector('#popupSectorSelect').value;

        if (nombre && sector) {
            // Cerrar el popup
            map.closePopup();

            // Añadir la empresa al mapa
            agregarEmpresaMapa(nombre, sector, lat, lng);
        } else {
            alert("Por favor, completa todos los campos antes de continuar.");
        }
    });
}

function agregarEmpresaMapa(nombre, sector, lat, lng) {
  const usuarioActual = localStorage.getItem('usuarioActual') || 'invitado';
  const nuevaEmpresa = {
      nombre: nombre,
      sector: sector,
      direccion: "Sin dirección", // Asignar un valor predeterminado si no hay dirección
      lat: lat,
      lng: lng,
      creador: usuarioActual,
      reseñas: []
  };

  nuevaEmpresa.direccion = nuevaEmpresa.direccion || "Dirección desconocida";


  const colorChincheta = coloresPorSector[sector] || "gray";
  const iconoChincheta = L.AwesomeMarkers.icon({
      icon: 'briefcase',
      markerColor: colorChincheta,
      prefix: 'fa'
  });

  // Añadir la empresa al array y actualizar localStorage
  empresas.push(nuevaEmpresa);
  actualizarLocalStorage();

  guardarEmpresaSinDuplicados(nuevaEmpresa);


  // Crear el marcador y añadirlo al mapa
  const marker = L.marker([lat, lng], { title: nombre, icon: iconoChincheta }).addTo(map);
  marker.bindPopup(getPopupContent(nuevaEmpresa)).openPopup();
  marker.bindTooltip(nombre, { direction: 'top', opacity: 0.8 });
  addMarkerEventHandlers(marker, nuevaEmpresa);
}



// Evento para añadir empresa en el mapa cuando está en modo añadir
map.on('click', function (e) {
    if (!addingMode) return;

    const isAuthenticated = !!localStorage.getItem('usuarioActual');
    if (!isAuthenticated) {
        alert('Debes iniciar sesión para añadir una empresa.');
        return;
    }

    // Mostrar el popup para agregar empresa en la ubicación seleccionada
    mostrarPopupAgregarEmpresa(e.latlng.lat, e.latlng.lng);
});




  



  










});

if (!window.listenerDireccionSeleccionada) {
  document.addEventListener("direccionSeleccionada", function (e) {
      const { lat, lng } = e.detail;
      console.log("Evento direccionSeleccionada recibido con coordenadas:", lat, lng);
      if (window.map) {
          window.map.setView([lat, lng], 17); // Centrar el mapa
      } else {
          console.error("El mapa no está definido.");
      }
  });

  // Marcador para evitar duplicados
  window.listenerDireccionSeleccionada = true;
  console.log("Listener direccionSeleccionada añadido");
}


// SEO Helper Script - Mejora de Metadatos para el Mapa
document.addEventListener("DOMContentLoaded", function () {
  // Añadir meta descripción específica si no existe
  const metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Explora un mapa interactivo con marcadores personalizados en Empatía Laboral. Encuentra empresas destacadas por su trato justo y equidad laboral.";
      document.head.appendChild(newMetaDescription);
  }

  // Añadir palabras clave específicas si no existen
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
      const newMetaKeywords = document.createElement("meta");
      newMetaKeywords.name = "keywords";
      newMetaKeywords.content = "mapa interactivo, marcadores personalizados, empresas, reseñas, trato justo, equidad laboral";
      document.head.appendChild(newMetaKeywords);
  }

  // Cambiar dinámicamente el título del mapa según la actividad
  const originalTitle = document.title;

  if (window.empresas && window.empresas.length > 0) {
      const markerCount = window.empresas.length;
      document.title = `Mapa Interactivo: ${markerCount} empresas destacadas | Empatía Laboral`;
  } else {
      document.title = originalTitle;
  }

  // Actualizar el título dinámicamente cuando se añaden nuevas empresas
  document.addEventListener("nuevaEmpresa", function () {
      const markerCount = window.empresas.length;
      document.title = `Mapa Interactivo: ${markerCount} empresas destacadas | Empatía Laboral`;
  });
});
