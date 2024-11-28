// footer.js

// Función para generar el contenido del footer
function generarFooter() {
    // Crear un contenedor para el footer
    const footer = document.createElement('footer');
    footer.style.textAlign = 'center';
    footer.style.padding = '20px';
    footer.style.backgroundColor = '#f1f1f1';

    // Crear los detalles y resúmenes
    const avisoLegal = document.createElement('details');
    const avisoLegalSummary = document.createElement('summary');
    avisoLegalSummary.textContent = 'Aviso Legal';
    avisoLegalSummary.style.cursor = 'pointer'; // Cambiar el cursor a puntero
    avisoLegal.appendChild(avisoLegalSummary);
    const avisoLegalContent = document.createElement('p');
    avisoLegalContent.textContent = `Este aviso legal regula el uso del sitio web empatialaboral.com. El acceso y uso de este
    sitio implica la aceptación plena y sin reservas de todos los términos y condiciones establecidos en este aviso legal.
    Empatía Laboral se reserva el derecho a modificar cualquier contenido, estructura o condiciones de acceso del sitio web
    en cualquier momento. Empatía Laboral no se responsabiliza por daños o perjuicios derivados del uso de la web, 
    incluida la interrupción de la disponibilidad de la página, fallos en el funcionamiento o la transmisión de virus informáticos.
    El usuario es el único responsable del uso y navegación en este sitio web, y de cualquier daño que pueda ocasionar a su sistema
    informático.`;
    avisoLegal.appendChild(avisoLegalContent);

    const politicaCookies = document.createElement('details');
    const politicaCookiesSummary = document.createElement('summary');
    politicaCookiesSummary.textContent = 'Política de Cookies';
    politicaCookiesSummary.style.cursor = 'pointer'; // Cambiar el cursor a puntero
    politicaCookies.appendChild(politicaCookiesSummary);
    const politicaCookiesContent = document.createElement('p');
    politicaCookiesContent.textContent = `En [Empatia Labroal], utilizamos cookies para mejorar tu experiencia de navegación. Una cookie es un pequeño archivo que se almacena en tu dispositivo y que nos ayuda a ofrecerte servicios personalizados. Puedes gestionar tus preferencias sobre cookies a través de tu navegador. Ten en cuenta que si decides no aceptar cookies, es posible que no puedas acceder a algunas funcionalidades del sitio. Para más información sobre las cookies que utilizamos y cómo gestionarlas, consulta nuestra `;
    const politicaLink = document.createElement('a');
    politicaLink.href = '/politica-cookies.html';
    politicaLink.textContent = 'Política de Cookies completa';
    politicaLink.style.color = '#4CAF50'; // Personalización opcional
    politicaCookiesContent.appendChild(politicaLink);
    politicaCookies.appendChild(politicaCookiesContent);

    const politicaPrivacidad = document.createElement('details');
    const politicaPrivacidadSummary = document.createElement('summary');
    politicaPrivacidadSummary.textContent = 'Política de Privacidad';
    politicaPrivacidadSummary.style.cursor = 'pointer'; // Cambiar el cursor a puntero
    politicaPrivacidad.appendChild(politicaPrivacidadSummary);
    const politicaPrivacidadContent = document.createElement('p');
    politicaPrivacidadContent.textContent = `En Empatía Laboral, nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos tus datos personales. Para más información, consulta nuestra `;
    const privacidadLink = document.createElement('a');
    privacidadLink.href = '/politica-privacidad.html';
    privacidadLink.textContent = 'Política de Privacidad completa';
    privacidadLink.style.color = '#4CAF50';
    politicaPrivacidadContent.appendChild(privacidadLink);
    politicaPrivacidad.appendChild(politicaPrivacidadContent);

    // Añadir los detalles al contenedor del footer
    footer.appendChild(avisoLegal);
    footer.appendChild(politicaCookies);
    footer.appendChild(politicaPrivacidad);

    // Insertar el footer en el cuerpo del documento
    document.body.appendChild(footer);
}

// Llamar a la función para generar el footer cuando la página haya cargado
window.onload = generarFooter;

