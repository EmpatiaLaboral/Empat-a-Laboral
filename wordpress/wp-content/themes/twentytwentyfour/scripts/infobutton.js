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
        Bienvenidos a Empatía Laboral. Esta página web está diseñada para ayudarte a conocer las experiencias laborales de otros usuarios y compartir la tuya. Aquí tienes las funcionalidades principales:
        1. Mapa de Empresas: En el mapa, puedes buscar empresas específicas y ver chinchetas de diferentes colores que representan sectores laborales, como tecnología, salud, o finanzas. Las chinchetas incluyen reseñas de usuarios sobre las empresas. Puedes hacer clic en cualquier chincheta para ver detalles y reseñas de esa empresa.
        2. Buscador: Utiliza el cuadro de búsqueda para encontrar empresas por nombre o dirección. Los resultados se desplegarán en un cuadro sugerente, similar a Google Maps, y al seleccionar una sugerencia, el mapa centrará la vista en la empresa.
        3. Añadir Empresa: Si estás registrado, puedes añadir una empresa proporcionando su nombre, sector laboral, y dirección. Si no tienes las coordenadas exactas, el sistema geocodificará la dirección para ubicarla automáticamente en el mapa.
        4. Reseñas de Empresas: Al hacer clic en una empresa del mapa, se abrirá una sección de reseñas donde podrás ver comentarios y calificaciones. Si eres usuario registrado, también puedes añadir tu propia reseña con una calificación de estrellas y un comentario.
        5. Chat en Vivo: Interactúa en el chat en vivo para compartir información y dudas en tiempo real. En la sección de usuarios conectados, verás una lista de personas online. Para enviar mensajes, necesitas estar registrado.
        6. Consultas con Chat: En la sección de consultas, tienes un cuadro de texto donde puedes escribir preguntas sobre cómo usar la web. La IA responderá y resolverá tus dudas.
        Si tienes dudas o sugerencias, puedes contactarnos a través del formulario de contacto en el pie de página. Empatía Laboral está en constante mejora para ofrecerte la mejor experiencia.
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
