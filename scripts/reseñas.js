// Asegurar que Firebase está inicializado
if (!window.db) {
  console.error("Firebase no está inicializado. Verifica tu archivo firebaseconfig.js.");
}

function mostrarNombreEmpresa(nombreEmpresa) {
  const reviewsContainer = document.getElementById("reviews");
  if (reviewsContainer) {
      reviewsContainer.innerHTML = `<h2 id="nombre-empresa">${nombreEmpresa}</h2>`;
  } else {
      console.error("Contenedor de reseñas no encontrado.");
  }
}



document.addEventListener("DOMContentLoaded", () => {
  let reseñas = [];

  if (window.db) {
    // Código para guardar en Firebase
} else {
    console.warn("Firebase no disponible. Solo se utilizará localStorage.");
}


  if (window.db) {
      db.collection("reseñas").get()
        .then((snapshot) => {
            reseñas = snapshot.docs.map((doc) => doc.data());
            localStorage.setItem("reseñas", JSON.stringify(reseñas));
            console.log("Reseñas cargadas desde Firebase.");
        })
        .catch((error) => {
            console.error("Error al cargar reseñas de Firebase. Usando localStorage:", error);
            const reseñasStr = localStorage.getItem("reseñas");
            reseñas = reseñasStr ? JSON.parse(reseñasStr) : [];
        });
  } else {
      console.warn("Firebase no disponible. Usando solo localStorage.");
      const reseñasStr = localStorage.getItem("reseñas");
      reseñas = reseñasStr ? JSON.parse(reseñasStr) : [];
  }
  
  const usuarioActual = localStorage.getItem("usuarioActual");
  const reviewsContainer = document.getElementById("reviews");

  // Mostrar un mensaje inicial en la sección de reseñas
  reviewsContainer.innerHTML = "<h2>Seleccione una empresa</h2>";

  // Escuchar el evento de selección de una empresa
  document.addEventListener("empresaSeleccionada", (event) => {
    const { lat, lng, nombreEmpresa } = event.detail;
    reviewsContainer.innerHTML = ""; // Limpiar contenido previo
    reviewsContainer.insertAdjacentHTML("beforeend", `<h2 id='nombre-empresa'>${nombreEmpresa}</h2>`);
    mostrarPromedioEstrellas(lat, lng);
    mostrarFormularioAgregarReseña(lat, lng, nombreEmpresa);
    reviewsContainer.insertAdjacentHTML("beforeend", `<div id="reseñas-lista"></div>`); // Contenedor específico para reseñas
    mostrarReseñas(lat, lng);
  });

  // Función para mostrar las reseñas en la sección de reseñas
  const mostrarReseñas = (lat, lng) => {
    let reseñasLista = document.getElementById("reseñas-lista");
    if (!reseñasLista) {
      reseñasLista = document.createElement("div");
      reseñasLista.id = "reseñas-lista";
      const reviewsContainer = document.getElementById("reviews");
      if (reviewsContainer) {
        reviewsContainer.appendChild(reseñasLista);
      } else {
        console.error("Contenedor principal de reseñas no encontrado.");
        return;
      }
    }
    reseñasLista.innerHTML = ""; // Limpiar solo la lista de reseñas
    

    const reseñasFiltradas = reseñas.filter((reseña) => reseña.lat === lat && reseña.lng === lng);
    const reseñasHTML = reseñasFiltradas.length
      ? reseñasFiltradas.map((reseña, index) => `
          <div class='reseña' data-index='${index}'>
            <p><strong>Usuario:</strong> ${reseña.usuario}</p>
            <p><strong>Puntuación:</strong> ${"★".repeat(reseña.estrellas)}</p>
            <p>${reseña.texto}</p>
            <button onclick="toggleLike(${index}, ${lat}, ${lng})">
              ${reseña.likes && reseña.likes.includes(usuarioActual) ? "Quitar Like" : "Dar Like"}
            </button>
            <span>${reseña.likes ? reseña.likes.length : 0} Likes</span>
          </div>
          <hr class="reseña-separador">`
        ).join("")
      : "<p>No hay reseñas para esta empresa.</p>";

    reseñasLista.insertAdjacentHTML("beforeend", `<h3>Reseñas de la Empresa</h3>${reseñasHTML}`);
  };

  // Función para dar o quitar like usando el índice de las reseñas filtradas
  window.toggleLike = function (index, lat, lng) {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para dar o quitar likes.");
      return;
    }
  
    const reseñasFiltradas = reseñas.filter((reseña) => reseña.lat === lat && reseña.lng === lng);
    const reseña = reseñasFiltradas[index];
    
    if (!reseña.likes) reseña.likes = []; // Inicializar likes si no existe
    const likeIndex = reseña.likes.indexOf(usuarioActual);
  
    if (likeIndex === -1) {
        reseña.likes.push(usuarioActual); // Agregar like
    } else {
        reseña.likes.splice(likeIndex, 1); // Quitar like
    }
  
    // Actualizar las reseñas en Firebase
    if (window.db) {
        const reseñaId = `${reseña.lat}_${reseña.lng}_${index}`;
        db.collection("reseñas").doc(reseñaId).set({
            ...reseña,
            likes: reseña.likes, // Guardar la lista actualizada de likes
        })
        .then(() => console.log("Likes actualizados en Firebase"))
        .catch((error) => console.error("Error al actualizar likes en Firebase:", error));
    } else {
        console.warn("Firebase no disponible. Solo se actualiza en localStorage.");
    }
  
    // Actualizar las reseñas en localStorage y volver a renderizar
    localStorage.setItem("reseñas", JSON.stringify(reseñas));
    mostrarReseñas(lat, lng); // Actualizar la visualización de las reseñas
  };
  


  // Resto de las funciones (mostrarPromedioEstrellas, mostrarFormularioAgregarReseña, etc.)



  // Función para mostrar o calcular el promedio de estrellas de la empresa
  function mostrarPromedioEstrellas(lat, lng, returnAsNumber = false) {
    const reseñasFiltradas = reseñas.filter(reseña => reseña.lat === lat && reseña.lng === lng);

    if (reseñasFiltradas.length === 0) {
      if (returnAsNumber) return 0;
      reviewsContainer.insertAdjacentHTML("beforeend", "<p>No hay reseñas para esta empresa.</p>");
      return;
    }

    const totalEstrellas = reseñasFiltradas.reduce((sum, reseña) => sum + reseña.estrellas, 0);
    const promedioEstrellas = totalEstrellas / reseñasFiltradas.length;

    if (returnAsNumber) return promedioEstrellas;

    reviewsContainer.insertAdjacentHTML("beforeend", `<p>Promedio de Estrellas: ${promedioEstrellas.toFixed(1)}</p>`);
  }

  // Función para mostrar el formulario para agregar una reseña
  const mostrarFormularioAgregarReseña = (lat, lng, nombreEmpresa) => {
    const formularioHTML = `
      <h3>Agregar Reseña</h3>
      <form id='form-agregar-resena'>
        <label for='usuario'>Nombre de Usuario:</label><br>
        <input type='text' id='usuario' name='usuario' value='${usuarioActual || ""}' readonly><br><br>
        <label for='estrellas'>Puntuación:</label><br>
        <div id='rating-container' class='rating-container'>
          <span class='estrella' data-value='1'>&#9734;</span>
          <span class='estrella' data-value='2'>&#9734;</span>
          <span class='estrella' data-value='3'>&#9734;</span>
          <span class='estrella' data-value='4'>&#9734;</span>
          <span class='estrella' data-value='5'>&#9734;</span>
        </div><br><br>
        <label for='texto'>Comentario:</label><br>
        <textarea id='texto' name='texto' rows='4' required></textarea><br><br>
        <button type='submit'>Enviar Reseña</button>
      </form>`;

    reviewsContainer.insertAdjacentHTML("beforeend", formularioHTML);

    const estrellasElements = document.querySelectorAll(".estrella");
    let estrellasSeleccionadas = 0;

    estrellasElements.forEach((estrella) => {
      estrella.addEventListener("click", () => {
        estrellasSeleccionadas = parseInt(estrella.getAttribute("data-value"));
        estrellasElements.forEach((e, index) => {
          e.innerHTML = index < estrellasSeleccionadas ? "&#9733;" : "&#9734;";
        });
      });
    });

    // Añadir evento de envío del formulario
    document.getElementById("form-agregar-resena").addEventListener("submit", (e) => {
      e.preventDefault();

      const texto = document.getElementById("texto").value.trim();

      if (estrellasSeleccionadas && texto) {
        const nuevaReseña = {
          usuario: usuarioActual,
          estrellas: estrellasSeleccionadas,
          texto,
          lat,
          lng,
        };
        reseñas.push(nuevaReseña);
        localStorage.setItem("reseñas", JSON.stringify(reseñas));
        
        // Guardar la reseña en Firebase
        if (window.db) {
            db.collection("reseñas").add(nuevaReseña)
              .then(() => console.log("Reseña guardada en Firebase"))
              .catch((error) => console.error("Error al guardar la reseña en Firebase:", error));
        } else {
            console.warn("Firebase no disponible. Solo se guardará en localStorage.");
        }
        
        reviewsContainer.innerHTML = "";
        mostrarNombreEmpresa(nombreEmpresa || "Nombre de la Empresa no disponible");
        mostrarPromedioEstrellas(lat, lng);
        mostrarFormularioAgregarReseña(lat, lng, nombreEmpresa);
        mostrarReseñas(lat, lng);
      }
    });
    
  };
  
});

// Función para calcular y mostrar el promedio de estrellas de una empresa en base a su latitud y longitud
function mostrarPromedioEstrellas(lat, lng, returnAsNumber = false) {

  // Recuperar reseñas de localStorage
  const reseñasStr = localStorage.getItem("reseñas");
  const reseñas = reseñasStr ? JSON.parse(reseñasStr) : [];

  // Filtrar las reseñas para las coordenadas dadas
  const reseñasFiltradas = reseñas.filter(reseña => reseña.lat === lat && reseña.lng === lng);

  if (reseñasFiltradas.length === 0) {
      if (returnAsNumber) return 0;
      return "<p>No hay reseñas para esta empresa.</p>";
  }

  // Calcular el promedio de estrellas
  const sumaEstrellas = reseñasFiltradas.reduce((sum, reseña) => sum + reseña.estrellas, 0);
  const promedioEstrellas = sumaEstrellas / reseñasFiltradas.length;

  if (returnAsNumber) return promedioEstrellas;

  // Crear estrellas doradas llenas y vacías
  const estrellasHTML = Array(5)
      .fill("☆") // Unicode para estrella vacía
      .map((estrella, index) => {
          const esLlena = index < Math.round(promedioEstrellas);
          return esLlena ? "★" : estrella; // Unicode para estrella llena
      })
      .join("");


  // Retorna el HTML de estrellas doradas
  return `<p><strong>Promedio de Estrellas:</strong> <span style="color: gold; font-size: 1.2em;">${estrellasHTML}</span></p>`;
}
