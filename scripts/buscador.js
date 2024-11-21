// Archivo: buscador.js

document.addEventListener("DOMContentLoaded", function () {
    const inputBuscar = document.getElementById("buscar-direccion");
    const buscarBtn = document.getElementById("buscar-btn");
    const sugerenciasContainer = document.createElement("ul");
    sugerenciasContainer.id = "sugerencias-container";
    inputBuscar.parentNode.appendChild(sugerenciasContainer);

    let empresas = [];

    // Función para cargar empresas desde Firebase Firestore
    async function cargarEmpresas() {
        const empresasSnapshot = await db.collection("empresas").get();
        empresas = empresasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log("Empresas cargadas desde Firebase:", empresas);
    }
    
    // Llama a la función para cargar las empresas al cargar la página
    cargarEmpresas().catch(error => console.error("Error al cargar empresas desde Firebase:", error));
    
    let debounceTimer;
    inputBuscar.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const direccion = inputBuscar.value;
            sugerenciasContainer.innerHTML = "";
            
            // Añadir sugerencias basadas en las chinchetas existentes en el mapa
            if (direccion.length > 2) {
                empresas.forEach(empresa => {
                    if (empresa.nombre.toLowerCase().includes(direccion.toLowerCase())) {
                        const item = document.createElement("li");
                        item.classList.add("sugerencia-item");
                        item.textContent = empresa.nombre;
                        item.addEventListener("click", function () {
                            sugerenciasContainer.innerHTML = "";
                            const eventoDireccionSeleccionada = new CustomEvent("direccionSeleccionada", {
                                detail: { lat: empresa.lat, lng: empresa.lng }
                            });
                            console.log("Evento direccionSeleccionada disparado con coordenadas:", empresa.lat, empresa.lng);
                            document.dispatchEvent(eventoDireccionSeleccionada);
                        });
                        sugerenciasContainer.appendChild(item);
                    }
                });
            }

            // Búsqueda en Nominatim si no hay coincidencias entre las empresas locales
            if (direccion.length > 2) {
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data && data.length > 0) {
                            data.forEach(sugerencia => {
                                const item = document.createElement("li");
                                item.classList.add("sugerencia-item");
                                item.textContent = sugerencia.display_name;
                                item.addEventListener("click", function () {
                                    sugerenciasContainer.innerHTML = "";
                                    const latitud = parseFloat(sugerencia.lat);
                                    const longitud = parseFloat(sugerencia.lon);
                                    const eventoDireccionSeleccionada = new CustomEvent("direccionSeleccionada", {
                                        detail: { lat: latitud, lng: longitud }
                                    });
                                    console.log("Evento direccionSeleccionada disparado con coordenadas:", latitud, longitud);
                                    document.dispatchEvent(eventoDireccionSeleccionada);
                                });
                                sugerenciasContainer.appendChild(item);
                            });
                        } else {
                            mostrarMensajeNoResultados();
                        }
                    })
                    .catch(error => {
                        console.error("Error al buscar sugerencias:", error);
                        alert("Hubo un problema al buscar las sugerencias. Verifica tu conexión a Internet e inténtalo de nuevo.");
                    });
            }
        }, 300);
    });
    

    buscarBtn.addEventListener("click", function () {
        const direccion = inputBuscar.value;
        if (direccion) {
            console.log("Buscando dirección:", direccion);
            // Utilizando la API de Nominatim de OpenStreetMap para geocodificación
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.length > 0) {
                        const latitud = parseFloat(data[0].lat);
                        const longitud = parseFloat(data[0].lon);

                        console.log("Coordenadas encontradas:", latitud, longitud);

                        const eventoDireccionSeleccionada = new CustomEvent("direccionSeleccionada", {
                            detail: { lat: latitud, lng: longitud }
                        });
                        document.dispatchEvent(eventoDireccionSeleccionada);
                        console.log("Evento direccionSeleccionada disparado con coordenadas:", latitud, longitud);
                        clearSearchField(); // Limpiar el campo de búsqueda después de la acción
                    } else {
                        alert("No se encontraron resultados para la dirección proporcionada.");
                    }
                })
                .catch(error => {
                    console.error("Error al buscar la dirección:", error);
                    alert("Hubo un problema al buscar la dirección. Inténtalo de nuevo más tarde.");
                });
        }
    });

    // Función para limpiar el campo de búsqueda
    function clearSearchField() {
        inputBuscar.value = "";
    }

    // Mostrar un mensaje si no se encuentran resultados
    function mostrarMensajeNoResultados() {
        const item = document.createElement("li");
        item.classList.add("sugerencia-item");
        item.textContent = "No se encontraron sugerencias";
        sugerenciasContainer.appendChild(item);
    }

    // Añadir un botón "X" para limpiar manualmente el campo de búsqueda
    const clearButton = document.createElement("button");
    clearButton.id = "clear-search";
    clearButton.innerHTML = "&times;";
    clearButton.classList.add("clear-button");
    clearButton.style.display = "none";
    inputBuscar.parentNode.appendChild(clearButton);

    clearButton.addEventListener("click", function () {
        clearSearchField();
        sugerenciasContainer.innerHTML = "";
        clearButton.style.display = "none";
    });

    inputBuscar.addEventListener("input", function () {
        if (inputBuscar.value.length > 0) {
            clearButton.style.display = "block";
        } else {
            clearButton.style.display = "none";
        }
    });

    // Añadir estilos CSS específicos para móviles dentro del script
    const style = document.createElement('style');
    style.innerHTML = `
        /* Ajustes para el buscador en pantallas móviles */
        @media (max-width: 768px) {
            #buscar-direccion {
                width: 100%;
                font-size: 1rem;
                padding: 0.75rem;
            }

            #clear-search {
                font-size: 1.5rem;
                padding: 0.5rem;
            }

            #sugerencias-container {
                width: 100%;
                max-height: 200px; /* Limitar la altura de las sugerencias en móviles */
                overflow-y: auto;  /* Habilitar scroll si hay muchas sugerencias */
                font-size: 0.9rem;
            }

            .sugerencia-item {
                padding: 0.5rem;
                cursor: pointer;
            }

            .sugerencia-item:hover {
                background-color: #f0f0f0;
            }
        }
    `;
    document.head.appendChild(style);

    // Función para calcular la similaridad entre dos cadenas
    function similaridad(cadena1, cadena2) {
        const longer = cadena1.length > cadena2.length ? cadena1 : cadena2;
        const shorter = cadena1.length <= cadena2.length ? cadena1 : cadena2;
        const longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / longerLength;
    }

    // Función para calcular la distancia de edición entre dos cadenas
    function editDistance(cadena1, cadena2) {
        const costs = new Array();
        for (let i = 0; i <= cadena1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= cadena2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                } else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (cadena1.charAt(i - 1) !== cadena2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) {
                costs[cadena2.length] = lastValue;
            }
        }
        return costs[cadena2.length];
    }


    // Añadir un listener para el evento "direccionSeleccionada"
    document.addEventListener("direccionSeleccionada", function (event) {
        console.log("Evento direccionSeleccionada recibido con coordenadas:", event.detail.lat, event.detail.lng);
        // Aquí deberías añadir el código para mover el mapa a las coordenadas recibidas
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
