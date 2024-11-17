document.addEventListener("DOMContentLoaded", () => {
    const cookieBanner = document.getElementById("cookie-banner");
  
    // Mostrar el banner si no hay preferencia guardada
    if (!localStorage.getItem("cookiesAccepted")) {
      cookieBanner.classList.remove("hidden");
    }
  
    // Función para aceptar todas las cookies
    const acceptCookies = () => {
      localStorage.setItem("cookiesAccepted", "true");
      localStorage.setItem("cookiesPreferences", JSON.stringify({ analytics: true, personalization: true }));
      cookieBanner.classList.add("hidden");
      console.log("Cookies aceptadas.");
    };
  
    // Función para rechazar todas las cookies
    const rejectCookies = () => {
      localStorage.setItem("cookiesAccepted", "false");
      localStorage.setItem("cookiesPreferences", JSON.stringify({ analytics: false, personalization: false }));
      cookieBanner.classList.add("hidden");
      console.log("Cookies rechazadas.");
    };
  
    // Función para personalizar cookies
    const customizeCookies = () => {
      const preferences = prompt(
        "Configura tus preferencias:\nEscribe 'analytics: true/false' y 'personalization: true/false'.\nEjemplo: analytics: true, personalization: false"
      );
      try {
        const preferencesObj = preferences
          .split(",")
          .map(pref => pref.trim().split(":"))
          .reduce((acc, [key, value]) => {
            acc[key] = value.trim() === "true";
            return acc;
          }, {});
  
        localStorage.setItem("cookiesPreferences", JSON.stringify(preferencesObj));
        cookieBanner.classList.add("hidden");
        console.log("Preferencias de cookies guardadas:", preferencesObj);
      } catch (error) {
        console.error("Error al configurar preferencias de cookies:", error);
        alert("Formato incorrecto. Intenta de nuevo.");
      }
    };
  
    // Eventos para los botones
    document.getElementById("accept-cookies").addEventListener("click", acceptCookies);
    document.getElementById("reject-cookies").addEventListener("click", rejectCookies);
    document.getElementById("customize-cookies").addEventListener("click", customizeCookies);
  });

  