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
  