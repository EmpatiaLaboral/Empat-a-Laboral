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


// Función para actualizar localStorage sin referencias circulares
function actualizarLocalStorage() {
  // Guardar solo los datos esenciales de cada empresa
  const empresasSimplificadas = empresas.map(({ nombre, sector, direccion, lat, lng, creador }) => ({
    nombre,
    sector,
    direccion,
    lat,
    lng,
    creador
  }));
  localStorage.setItem("empresas", JSON.stringify(empresasSimplificadas));
}


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

// Función para añadir la empresa al mapa con el marcador correspondiente
function agregarEmpresaMapa(nombre, sector, lat, lng) {
    const usuarioActual = localStorage.getItem('usuarioActual') || 'invitado';
    const nuevaEmpresa = {
        nombre: nombre,
        sector: sector,
        lat: lat,
        lng: lng,
        creador: usuarioActual,
        reseñas: []
    };

    const colorChincheta = coloresPorSector[sector] || "gray";
    const iconoChincheta = L.AwesomeMarkers.icon({
        icon: 'briefcase',
        markerColor: colorChincheta,
        prefix: 'fa'
    });

    // Añadir la empresa al array y actualizar localStorage
    empresas.push(nuevaEmpresa);
    actualizarLocalStorage();

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



  function getPopupContent(empresa) {
  
    // Calcular el promedio de estrellas usando la función mostrarPromedioEstrellas
    const promedioEstrellas = typeof mostrarPromedioEstrellas === 'function'
        ? mostrarPromedioEstrellas(empresa.lat, empresa.lng, true)
        : 0;
  
  
    // Crear estrellas doradas llenas y vacías
    const estrellas = Array(5).fill("☆") // Unicode para estrella vacía
        .map((estrella, index) => index < Math.round(promedioEstrellas) ? "★" : estrella) // Unicode para estrella llena
        .join("");
  
  
    // Estilos en línea para hacer que las estrellas se vean doradas
    const popupContent = `<b>${empresa.nombre}</b><br>
                          <strong>Promedio de Estrellas:</strong> <span style="color: gold; font-size: 1.2em;">${estrellas}</span><br>
                          <button onclick='borrarEmpresa(${empresa.lat}, ${empresa.lng})'>Borrar Empresa</button>`;
  
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

  // Función para borrar una empresa
  window.borrarEmpresa = function (lat, lng) {
    const usuarioActual = localStorage.getItem('usuarioActual');
    const empresaIndex = empresas.findIndex(emp => emp.lat === lat && emp.lng === lng);

    if (empresaIndex !== -1) {
      const empresa = empresas[empresaIndex];

      // Verificar si el usuario es el creador o el administrador
      if (empresa.creador !== usuarioActual && usuarioActual !== 'admin') {
        alert('No tienes permisos para borrar esta empresa.');
        return;
      }

      // Verificar si la empresa tiene reseñas asociadas
      if (empresa.reseñas && empresa.reseñas.length > 0) {
        alert('No se puede borrar la empresa porque tiene reseñas asociadas.');
        return;
      }

      empresas.splice(empresaIndex, 1);
      actualizarLocalStorage();
      alert('Empresa borrada correctamente.');
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker && layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
          map.removeLayer(layer);
        }
      });
    } else {
      alert('Empresa no encontrada.');
    }
  };






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
