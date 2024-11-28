document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Iniciando filtros.js básico...");

    const mapElement = document.getElementById("map");
    if (!mapElement) throw new Error("Elemento #map no encontrado en el HTML.");

    // Lupa para mostrar/ocultar filtros
    const lupaIcono = document.createElement("span");
    lupaIcono.classList.add("fa", "fa-search");
    lupaIcono.style.cursor = "pointer";
    lupaIcono.title = "Mostrar filtros";
    lupaIcono.addEventListener("click", () => {
      filtrosContainer.style.display = filtrosContainer.style.display === "none" ? "block" : "none";
      console.log(`Filtros ${filtrosContainer.style.display === "none" ? "ocultos" : "desplegados"}`);
    });
    mapElement.appendChild(lupaIcono);
    console.log("Lupa añadida al mapa.");

    // Contenedor de filtros
    const filtrosContainer = document.createElement("div");
    filtrosContainer.id = "filtros-container";
    filtrosContainer.style.display = "none";
    filtrosContainer.innerHTML = `
      <h3>Filtros de Búsqueda</h3>
      <label for="sectorSelect">Selecciona Sector:</label>
      <select id="sectorSelect" multiple>
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
      <label for="valoracionMin">Valoración Mínima:</label>
      <input type="number" id="valoracionMin" min="1" max="5" placeholder="1 - 5">
      <br>
      <button id="aplicarFiltros">Aplicar Filtros</button>
      <button id="restablecerFiltros">Restablecer Filtros</button>
      <button id="seleccionarTodosSectores">Seleccionar Todos los Sectores</button>
    `;
    mapElement.appendChild(filtrosContainer);
    console.log("Contenedor de filtros añadido al DOM.");

    // Selección de elementos dentro del contenedor de filtros
    const sectorSelect = filtrosContainer.querySelector("#sectorSelect");
    const valoracionMinInput = filtrosContainer.querySelector("#valoracionMin");
    const aplicarFiltrosBtn = filtrosContainer.querySelector("#aplicarFiltros");
    const restablecerFiltrosBtn = filtrosContainer.querySelector("#restablecerFiltros");
    const seleccionarTodosSectoresBtn = filtrosContainer.querySelector("#seleccionarTodosSectores");

    // Verificación de elementos
    if (!sectorSelect || !valoracionMinInput || !aplicarFiltrosBtn || !restablecerFiltrosBtn || !seleccionarTodosSectoresBtn) {
      console.error("Error en la creación de los elementos del DOM.");
      return;
    }

    // Evento Aplicar Filtros
    aplicarFiltrosBtn.addEventListener("click", () => {
      const sectoresSeleccionados = Array.from(sectorSelect.options)
        .filter(option => option.selected)
        .map(option => option.value);
      const valoracionMin = parseInt(valoracionMinInput.value) || 1;

      console.log("Sectores seleccionados:", sectoresSeleccionados, "Valoración mínima:", valoracionMin);

      document.dispatchEvent(new CustomEvent("aplicarFiltrosMapa", {
        detail: { sectores: sectoresSeleccionados, valoracionMin }
      }));
    });

    // Evento Restablecer Filtros
    restablecerFiltrosBtn.addEventListener("click", () => {
      sectorSelect.querySelectorAll("option").forEach(option => option.selected = false);
      valoracionMinInput.value = "";
      console.log("Filtros restablecidos.");
      document.dispatchEvent(new CustomEvent("restablecerFiltrosMapa"));
    });

    // Evento Seleccionar Todos los Sectores
    seleccionarTodosSectoresBtn.addEventListener("click", () => {
      sectorSelect.querySelectorAll("option").forEach(option => option.selected = true);
      console.log("Todos los sectores seleccionados.");
    });

  } catch (error) {
    console.error("Error en la inicialización de filtros.js:", error);
  }

  // SEO Helper Script - Mejora de Metadatos para Filtros
document.addEventListener("DOMContentLoaded", function () {
  // Añadir meta descripción específica para la página de filtros si no existe
  const metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Explora empresas utilizando filtros avanzados en Empatía Laboral. Filtra por sector, valoración mínima y encuentra las mejores empresas por su trato justo.";
      document.head.appendChild(newMetaDescription);
  }

  // Añadir palabras clave específicas relacionadas con filtros
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
      const newMetaKeywords = document.createElement("meta");
      newMetaKeywords.name = "keywords";
      newMetaKeywords.content = "filtros de empresas, sectores laborales, valoración mínima, mapa interactivo, reseñas de empresas";
      document.head.appendChild(newMetaKeywords);
  }

  // Actualizar dinámicamente el título según los filtros aplicados
  const sectorSelect = document.getElementById("sectorSelect");
  const valoracionMinInput = document.getElementById("valoracionMin");
  const originalTitle = document.title;

  document.addEventListener("aplicarFiltrosMapa", (event) => {
      const { sectores, valoracionMin } = event.detail;
      const sectoresTexto = sectores.length > 0 ? sectores.join(", ") : "Todos los sectores";
      document.title = `Buscando en: ${sectoresTexto} con valoración mínima ${valoracionMin} | Empatía Laboral`;
  });

  document.addEventListener("restablecerFiltrosMapa", () => {
      document.title = originalTitle;
  });
});

});
