// Archivo: infoButton.js

document.addEventListener("DOMContentLoaded", function() {
    // Crear y configurar el botón de información
    const infoButton = document.createElement("button");
    infoButton.id = "info-button";
    infoButton.setAttribute("aria-label", "Información de uso de la web");
    infoButton.classList.add("info-button");
    infoButton.innerHTML = '<i class="fa fa-info-circle"></i>';
    document.body.appendChild(infoButton);

    // Crear y configurar el cuadro de información
    const infoBox = document.createElement("div");
    infoBox.id = "info-box";
    infoBox.classList.add("info-box");
    infoBox.style.display = "none";
    infoBox.innerHTML = `
        <h2>Guía de Uso de la Web</h2>
        <p>Bienvenido a Empatía Laboral. Aquí puedes buscar empresas en el mapa, añadir tus propias reseñas y chatear en tiempo real.</p>
        <button id="play-audio" class="audio-control">PLAY</button>
        <button id="stop-audio" class="audio-control">STOP</button>
    `;
    document.body.appendChild(infoBox);

    // Texto de la explicación
    const textoExplicativo = `
        Bienvenido a Empatía Laboral

Empatía Laboral es tu plataforma para descubrir y compartir experiencias laborales. Nuestro objetivo es ayudarte a tomar decisiones informadas y construir un entorno laboral más justo y transparente. Estas son las principales funcionalidades de nuestra página web:

1. Mapa de Empresas
Explora un mapa interactivo donde podrás:

Buscar empresas específicas por nombre o ubicación.
Identificar chinchetas de colores que representan distintos sectores laborales, como tecnología, salud o finanzas.
Hacer clic en cualquier chincheta para acceder a los detalles y reseñas de esa empresa.
2. Buscador Inteligente
Encuentra empresas fácilmente usando nuestro buscador:

Escribe el nombre o dirección de una empresa para obtener sugerencias en tiempo real.
Al seleccionar una sugerencia, el mapa se centrará automáticamente en la ubicación de la empresa seleccionada.
3. Añadir Empresas
Contribuye al mapa añadiendo nuevas empresas:

Requisito: Debes estar registrado para utilizar esta función.
Proporciona el nombre de la empresa, su sector laboral y dirección.
Si no cuentas con coordenadas exactas, nuestro sistema las generará automáticamente utilizando la dirección que proporciones.
4. Reseñas de Empresas
Comparte y consulta opiniones laborales:

Haz clic en cualquier empresa del mapa para ver reseñas de otros usuarios.
Si estás registrado, puedes dejar tu propia reseña con una calificación de estrellas y un comentario detallado.
5. Chat en Vivo
Comunícate en tiempo real con otros usuarios:

Únete a conversaciones en el chat para compartir información, resolver dudas o colaborar.
Consulta la lista de usuarios conectados en tiempo real.
Nota: Solo los usuarios registrados pueden enviar mensajes, aunque cualquier visitante puede leer las conversaciones.
6. Asistencia con IA
¿Tienes preguntas sobre cómo usar la web?

Ve a la sección de consultas y escribe tus dudas.
Nuestra inteligencia artificial está preparada para ayudarte con respuestas rápidas y precisas.
Contacto y Sugerencias
Si tienes preguntas adicionales, comentarios o sugerencias para mejorar la web, no dudes en contactarnos a través del formulario de contacto ubicado en el pie de página.

Empatía Laboral está en constante evolución para ofrecerte la mejor experiencia. ¡Gracias por formar parte de esta comunidad! 🌟

Consejo:
Explora las secciones de la web, comparte tus experiencias y contribuye a construir un entorno laboral más transparente para todos.
        Platón escribe que el verdadero navegante debe estudiar las estaciones del año, el cielo, las estrellas, los vientos y todas las demás materias propias de su profesión. Si realmente es apto para controlar la nave, piensa que es del todo imposible adquirir la destreza profesional necesaria para tal control y que no existe el arte de la navegación.
        ¿Cuánto podría saber realmente un miembro del Consejo de los 500 elegido al azar? ¿Cuánto podría aportar plenamente a la sociedad? ¿Deberíamos permitir que un miembro aleatorio de la sociedad tuviera algún poder?
        En su lugar, Platón abogaba por la idea de un rey filósofo, un hombre que estudia la sabiduría, la lógica y el razonamiento, un hombre que dedique su vida a comprender cómo ser un navegante de la sabiduría.
        Platón decía más bien que la sociedad que hemos descrito nunca podrá hacerse realidad ni ver la luz del día y que no habrá fin a los problemas de los estados, o de hecho, mi querido Glaucón, de la propia humanidad hasta que los filósofos se conviertan en gobernantes de este mundo o hasta que los que ahora llamamos reyes y gobernantes se conviertan real y verdaderamente en filósofos, y el poder político y la filosofía lleguen así a las mismas manos.
        Solo hay un problema con la cita de Platón: todos los líderes se creen reyes filósofos, todos piensan que sus pensamientos son los mejores, desde Yi el Grande en China hasta los libaneses del Imperio Hitita, pasando por Siddhartha Gautama del reino de Magadha en la India.
            `;

    // Configuración de síntesis de voz
    const speech = new SpeechSynthesisUtterance(textoExplicativo);
    speech.lang = "es-ES";

    // Función para alternar la visibilidad del cuadro de información
    infoButton.addEventListener("click", function() {
        infoBox.style.display = infoBox.style.display === "none" ? "block" : "none";
    });

    // Control de reproducción y pausa del audio
    document.getElementById("play-audio").addEventListener("click", function() {
        speechSynthesis.cancel(); // Cancelar cualquier síntesis de voz en progreso
        speechSynthesis.speak(speech);
    });

    document.getElementById("stop-audio").addEventListener("click", function() {
        speechSynthesis.cancel(); // Detener el audio y reiniciarlo al principio
    });
});

// Estilos básicos para el botón y el cuadro de información
const style = document.createElement('style');
style.innerHTML = `
    .info-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }
    .info-box {
        position: fixed;
        bottom: 80px;
        right: 20px;
        background-color: white;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        width: 300px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    }
    .audio-control {
        margin: 5px;
        padding: 8px 12px;
        font-size: 14px;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// SEO Helper Script - Mejora de Metadatos para el Botón de Información
document.addEventListener("DOMContentLoaded", function () {
    // Añadir meta descripción si no existe
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.name = "description";
        newMetaDescription.content = "Descubre cómo usar Empatía Laboral con nuestra guía interactiva. Aprende a buscar empresas, añadir reseñas y usar el chat en tiempo real.";
        document.head.appendChild(newMetaDescription);
    }

    // Añadir palabras clave relevantes si no existen
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        const newMetaKeywords = document.createElement("meta");
        newMetaKeywords.name = "keywords";
        newMetaKeywords.content = "guía de uso, mapa interactivo, empatía laboral, añadir reseñas, chat en vivo, empresas destacadas";
        document.head.appendChild(newMetaKeywords);
    }

    // Cambiar dinámicamente el título cuando se abre el cuadro de información
    const originalTitle = document.title;
    const infoBox = document.getElementById("info-box");
    const infoButton = document.getElementById("info-button");

    if (infoButton && infoBox) {
        infoButton.addEventListener("click", function () {
            if (infoBox.style.display === "block") {
                document.title = "Guía de Uso | Empatía Laboral";
            } else {
                document.title = originalTitle;
            }
        });
    }
});
