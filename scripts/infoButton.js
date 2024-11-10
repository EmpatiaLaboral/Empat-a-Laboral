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
            <div style="color: black;">

        <h2>Guía de Uso de la Web</h2>
        <p style="color: black;">Bienvenido a Empatía Laboral. Aquí puedes buscar empresas en el mapa, añadir tus propias reseñas y chatear en tiempo real.</p>
        <button id="play-audio" class="audio-control">PLAY</button>
        <button id="stop-audio" class="audio-control">STOP</button>
                </div>

    `;
    document.body.appendChild(infoBox);

    // Texto de la explicación
    const textoExplicativo = `
        <div style="color: black;">
            Bienvenidos a Empatía Laboral. Esta página web está diseñada para ayudarte a conocer las experiencias laborales de otros usuarios y compartir la tuya. Aquí tienes las funcionalidades principales:
            1. Mapa de Empresas: En el mapa, puedes buscar empresas específicas y ver chinchetas de diferentes colores que representan sectores laborales, como tecnología, salud, o finanzas. Las chinchetas incluyen reseñas de usuarios sobre las empresas. Puedes hacer clic en cualquier chincheta para ver detalles y reseñas de esa empresa.
            2. Buscador: Utiliza el cuadro de búsqueda para encontrar empresas por nombre o dirección. Los resultados se desplegarán en un cuadro sugerente, similar a Google Maps, y al seleccionar una sugerencia, el mapa centrará la vista en la empresa.
            3. Añadir Empresa: Si estás registrado, puedes añadir una empresa proporcionando su nombre, sector laboral, y dirección. Si no tienes las coordenadas exactas, el sistema geocodificará la dirección para ubicarla automáticamente en el mapa.
            4. Reseñas de Empresas: Al hacer clic en una empresa del mapa, se abrirá una sección de reseñas donde podrás ver comentarios y calificaciones. Si eres usuario registrado, también puedes añadir tu propia reseña con una calificación de estrellas y un comentario.
            5. Chat en Vivo: Interactúa en el chat en vivo para compartir información y dudas en tiempo real. En la sección de usuarios conectados, verás una lista de personas online. Para enviar mensajes, necesitas estar registrado.
            6. Consultas con Chat: En la sección de consultas, tienes un cuadro de texto donde puedes escribir preguntas sobre cómo usar la web. La IA responderá y resolverá tus dudas.
            Si tienes dudas o sugerencias, puedes preguntar a la IA o contactarnos a través del formulario de contacto en el pie de página. Empatía Laboral está en constante mejora para ofrecerte la mejor experiencia.
        </div>
    `;

    // Configuración de síntesis de voz
    const speech = new SpeechSynthesisUtterance(textoExplicativo);
    speech.lang = "es-ES";

    // Función para alternar la visibilidad del cuadro de información
    infoButton.addEventListener("click", function() {
        infoBox.style.display = infoBox.style.display === "none" ? "block" : "none";
    });

    // Funciones para controlar la síntesis de voz
    document.getElementById("play-audio").addEventListener("click", function() {
        window.speechSynthesis.speak(speech);
    });

    document.getElementById("stop-audio").addEventListener("click", function() {
        window.speechSynthesis.cancel();
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
