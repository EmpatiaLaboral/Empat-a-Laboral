document.addEventListener("DOMContentLoaded", () => {
    const cookieBanner = document.getElementById("cookie-banner");
  
    // Mostrar el banner si no hay preferencia guardada
    if (!localStorage.getItem("cookiesAccepted")) {
      cookieBanner.classList.remove("hidden");
    }
  
    // Función para aceptar todas las cookies
    const acceptCookies = () => {
      localStorage.setItem("cookiesAccepted", "true");
      localStorage.setItem(
        "cookiesPreferences",
        JSON.stringify({ analytics: true, personalization: true })
      );
      cookieBanner.classList.add("hidden");
      console.log("Cookies aceptadas.");
    };
  
    // Función para rechazar todas las cookies
    const rejectCookies = () => {
      localStorage.setItem("cookiesAccepted", "false");
      localStorage.setItem(
        "cookiesPreferences",
        JSON.stringify({ analytics: false, personalization: false })
      );
      cookieBanner.classList.add("hidden");
      console.log("Cookies rechazadas.");
    };
  
    // Función para personalizar cookies
    const customizeCookies = () => {
      const preferences = {
        analytics: confirm("¿Permitir cookies de análisis?"),
        personalization: confirm("¿Permitir cookies de personalización?")
      };
  
      localStorage.setItem("cookiesPreferences", JSON.stringify(preferences));
      cookieBanner.classList.add("hidden");
      console.log("Preferencias de cookies guardadas:", preferences);
    };
  
    // Eventos para los botones
    document.getElementById("accept-cookies").addEventListener("click", acceptCookies);
    document.getElementById("reject-cookies").addEventListener("click", rejectCookies);
    document.getElementById("customize-cookies").addEventListener("click", customizeCookies);
  });

  // SEO Helper Script - Mejora de Metadatos para Cookies
document.addEventListener("DOMContentLoaded", function () {
  // Añadir meta descripción específica para la configuración de cookies si no existe
  const metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Configura tus preferencias de cookies en Empatía Laboral. Acepta, rechaza o personaliza cookies para mejorar tu experiencia de usuario.";
      document.head.appendChild(newMetaDescription);
  }

  // Añadir palabras clave específicas si no existen
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
      const newMetaKeywords = document.createElement("meta");
      newMetaKeywords.name = "keywords";
      newMetaKeywords.content = "configuración de cookies, privacidad, preferencias de usuario, cookies de análisis, cookies de personalización";
      document.head.appendChild(newMetaKeywords);
  }

  // Actualizar dinámicamente el título según la interacción con el banner de cookies
  const originalTitle = document.title;
  const cookieBanner = document.getElementById("cookie-banner");

  if (cookieBanner) {
      const observer = new MutationObserver(() => {
          if (!cookieBanner.classList.contains("hidden")) {
              document.title = "Configuración de Cookies | Empatía Laboral";
          } else {
              document.title = originalTitle;
          }
      });

      observer.observe(cookieBanner, { attributes: true });
  }
});
