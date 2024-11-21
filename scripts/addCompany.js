
document.addEventListener("DOMContentLoaded", function () {
    const empresaForm = document.getElementById("company-form");
    const empresaMessage = document.getElementById("company-message");
    const direccionInput = document.getElementById("company-address");

    // Crear un contenedor para las sugerencias en el campo de dirección
    const sugerenciasContainer = document.createElement("ul");
    sugerenciasContainer.id = "sugerencias-add-company";
    direccionInput.parentNode.appendChild(sugerenciasContainer);

    // Verificar si el usuario ha iniciado sesión
    const usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) {
        empresaMessage.textContent = "Debes iniciar sesión para añadir una empresa.";
        empresaMessage.style.color = "red";
        empresaMessage.style.display = "block";
        empresaForm.style.display = "none"; // Oculta el formulario para usuarios no autenticados
        return;
    }

    // Debounce para evitar llamadas excesivas a la API
    let debounceTimer;
    direccionInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const direccion = direccionInput.value;
            sugerenciasContainer.innerHTML = "";

            if (direccion.length > 2) {
                // Llamada a la API de Nominatim para obtener sugerencias de direcciones
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.length > 0) {
                            data.forEach(sugerencia => {
                                const item = document.createElement("li");
                                item.classList.add("sugerencia-item");
                                item.textContent = sugerencia.display_name;
                                item.addEventListener("click", function () {
                                    sugerenciasContainer.innerHTML = "";
                                    direccionInput.value = sugerencia.display_name;
                                    // Opcional: Asignar coordenadas obtenidas
                                    document.getElementById("company-lat").value = sugerencia.lat;
                                    document.getElementById("company-lng").value = sugerencia.lon;
                                });
                                sugerenciasContainer.appendChild(item);
                            });
                        } else {
                            mostrarMensajeNoResultados();
                        }
                    })
                    .catch(error => {
                        console.error("Error al buscar sugerencias:", error);
                    });
            }
        }, 300);
    });

    function mostrarMensajeNoResultados() {
        const item = document.createElement("li");
        item.classList.add("sugerencia-item");
        item.textContent = "No se encontraron sugerencias";
        sugerenciasContainer.appendChild(item);
    }

    empresaForm.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("Formulario de empresa enviado");

        const nombre = document.getElementById("company-name").value.trim();
        const sector = document.getElementById("sectorSelectAddCompany").value;
        const direccion = document.getElementById("company-address").value.trim();
        let latitud = parseFloat(document.getElementById("company-lat").value);
        let longitud = parseFloat(document.getElementById("company-lng").value);

        // Verificar si latitud y longitud son válidos
        if (!isNaN(latitud) && !isNaN(longitud)) {
            // Caso 1: Latitud y longitud proporcionadas directamente
            añadirEmpresa(nombre, sector, direccion, latitud, longitud);
        } else if (direccion) {
            // Caso 2: Dirección proporcionada, hacer geocodificación
            geocodificarDireccion(direccion, (coords) => {
                if (coords) {
                    añadirEmpresa(nombre, sector, direccion, coords.lat, coords.lng);
                } else {
                    empresaMessage.textContent = "No se pudo encontrar la ubicación de la dirección proporcionada.";
                    empresaMessage.style.color = "red";
                    empresaMessage.style.display = "block";
                    setTimeout(() => { empresaMessage.style.display = "none"; }, 3000);
                }
            });
        } else {
            // Mostrar mensaje de error si faltan ambos métodos de ubicación
            empresaMessage.textContent = "Por favor, proporciona una dirección o coordenadas válidas.";
            empresaMessage.style.color = "red";
            empresaMessage.style.display = "block";
            console.log("Error: Faltan datos de ubicación");
            setTimeout(() => { empresaMessage.style.display = "none"; }, 3000);
        }
    });

    // Función para geocodificar la dirección usando OpenStreetMap
    function geocodificarDireccion(direccion, callback) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lng = parseFloat(data[0].lon);
                    console.log("Coordenadas obtenidas de la dirección:", { lat, lng });
                    callback({ lat, lng });
                } else {
                    console.log("No se encontraron resultados de geocodificación para la dirección.");
                    callback(null);
                }
            })
            .catch(error => {
                console.error("Error en la geocodificación:", error);
                callback(null);
            });
    }

    // Función para enviar la empresa al mapa y guardarla en Firestore
function añadirEmpresa(nombre, sector, direccion, lat, lng) {
    const nuevaEmpresa = {
        nombre: nombre,
        sector: sector,
        direccion: direccion,
        lat: lat,
        lng: lng,
        creador: usuarioActual || "invitado",
        reseñas: []
    };
    console.log("Nueva empresa creada:", nuevaEmpresa);

    // Guardar en Firestore
    db.collection("empresas").add(nuevaEmpresa)
        .then((docRef) => {
            console.log("Empresa añadida a Firebase con ID:", docRef.id);
            empresaMessage.textContent = "Empresa añadida exitosamente!";
            empresaMessage.style.color = "green";
            empresaMessage.style.display = "block";
            empresaForm.reset();

            setTimeout(() => { empresaMessage.style.display = "none"; }, 3000);

            // Disparar evento para agregar la empresa en el mapa local
            const eventoNuevaEmpresa = new CustomEvent("nuevaEmpresa", { detail: nuevaEmpresa });
            document.dispatchEvent(eventoNuevaEmpresa);
            console.log("Evento 'nuevaEmpresa' disparado");
        })
        .catch((error) => {
            console.error("Error al añadir la empresa en Firebase: ", error);
            empresaMessage.textContent = "Error al añadir la empresa en el servidor.";
            empresaMessage.style.color = "red";
            empresaMessage.style.display = "block";
            setTimeout(() => { empresaMessage.style.display = "none"; }, 3000);
        });
}

// SEO Helper Script - Mejora de Metadatos Dinámicos
document.addEventListener("DOMContentLoaded", function () {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        // Añadir una meta descripción si no existe
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.name = "description";
        newMetaDescription.content = "Añade tu empresa al mapa interactivo de Empatía Laboral. Encuentra empresas destacadas por su trato justo y compromiso laboral.";
        document.head.appendChild(newMetaDescription);
    }

    // Generar un título dinámico para la página según la actividad del usuario
    const originalTitle = document.title;
    document.title = "Añadir Empresa | Empatía Laboral";

    // Monitorear el campo de nombre de la empresa para reflejar cambios en el título
    const companyNameInput = document.getElementById("company-name");
    if (companyNameInput) {
        companyNameInput.addEventListener("input", function () {
            const companyName = companyNameInput.value.trim();
            if (companyName) {
                document.title = `Añadiendo: ${companyName} | Empatía Laboral`;
            } else {
                document.title = originalTitle;
            }
        });
    }

    // Añadir palabras clave dinámicas basadas en el contenido del formulario
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        const newMetaKeywords = document.createElement("meta");
        newMetaKeywords.name = "keywords";
        newMetaKeywords.content = "empresas, mapa interactivo, añadir empresa, trato justo, equidad laboral, reseñas de empresas";
        document.head.appendChild(newMetaKeywords);
    }
});


});
