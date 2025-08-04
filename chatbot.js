document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar los elementos del DOM
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotContainer = document.getElementById('chatbot-container'); // Confirmado: ID 'chatbot-container'
    const chatbotCloseBtn = document.querySelector('.chatbot-close-btn'); // Confirmado: Clase 'chatbot-close-btn'
    const chatMessages = document.querySelector('.chatbot-messages'); // Confirmado: Clase 'chatbot-messages'
    const userInput = document.getElementById('user-input'); // Confirmado: ID 'user-input'
    const sendBtn = document.getElementById('send-btn'); // Confirmado: ID 'send-btn'

    let userName = '';
    let chatState = 0; // 0: inicial/cerrado, 1: preguntando nombre, 2: nombre recibido/conversación general

    // Verifica que todos los elementos existan antes de añadir event listeners
    if (chatbotToggleBtn && chatbotContainer && chatbotCloseBtn && chatMessages && userInput && sendBtn) {

        // Función para agregar un mensaje al chat (general, usado por bot y usuario)
        const addMessage = (content, sender) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender);
            messageDiv.innerHTML = content; // Usar innerHTML para permitir etiquetas como <br/> o <a>
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
        };

        // Funciones específicas para mensajes del bot y del usuario
        const addBotMessage = (content) => addMessage(content, 'bot');
        const addUserMessage = (content) => addMessage(content, 'user');

        // Función principal para enviar un mensaje (usuario)
        const sendMessage = () => {
            const userMessage = userInput.value.trim();
            if (userMessage === '') return;

            addUserMessage(userMessage); // Mostrar el mensaje del usuario
            userInput.value = ''; // Limpiar el input

            // Retraso para la respuesta del bot
            setTimeout(() => {
                handleChatResponse(userMessage);
            }, 500); // 0.5 segundos de retraso
        };

        // Función para manejar la lógica de respuesta del chatbot
        const handleChatResponse = (message) => {
            const normalizedMessage = message.toLowerCase();
            let botResponse = 'Lo siento, no entiendo esa pregunta. Por favor, intenta de nuevo o pregunta sobre nuestros platos, horarios, ubicación o si hacemos delivery.';

            if (chatState === 1) { // Si estamos en el estado de preguntar el nombre
                userName = message.split(' ')[0]; // Toma la primera palabra como nombre
                addBotMessage(`¡Hola, ${userName}! Es un placer conocerte. ¿En qué puedo ayudarte? Puedes preguntar sobre nuestros platos, horarios, ubicación o si hacemos delivery.`);
                chatState = 2; // Cambiar el estado a "nombre recibido, en conversación general"
                return; // Salir para no procesar como pregunta general aún
            }

            // Respuestas basadas en palabras clave (conversación general)
            if (normalizedMessage.includes('hola') || normalizedMessage.includes('qué tal')) {
                botResponse = `¡Hola${userName ? ', ' + userName : ''}! ¿En qué puedo ayudarte hoy?`;
            } else if (normalizedMessage.includes('plato') || normalizedMessage.includes('comida') || normalizedMessage.includes('venden') || normalizedMessage.includes('menu')) {
                botResponse = 'En Miso Cocina Nikkei ofrecemos una fusión de sabores peruanos y japoneses. Nuestros platos son innovadores y preparados con ingredientes de alta calidad. Te invitamos a ver nuestro <a href="Menu.html" class="chatbot-link" target="_blank">menú completo</a> para más detalles.';
            } else if (normalizedMessage.includes('horario') || normalizedMessage.includes('abierto') || normalizedMessage.includes('horas')) {
                botResponse = 'Nuestro horario es el siguiente:<br/><strong>Lunes a Viernes:</strong> 04:00 p.m. - 11:00 p.m.<br/><strong>Sábados y Domingos:</strong> 03:00 p.m. - 10:45 p.m.';
            } else if (normalizedMessage.includes('ubicacion') || normalizedMessage.includes('direccion') || normalizedMessage.includes('donde')) {
                botResponse = 'Estamos ubicados en Av. los Ficos 220, San Juan de Lurigancho 15404. ¡Te esperamos! <a href="https://www.google.com/maps/search/Av.+los+Ficos+220,+San+Juan+de+Lurigancho+15404" target="_blank" class="chatbot-link">Ver en el mapa</a>';
            } else if (normalizedMessage.includes('delivery') || normalizedMessage.includes('domicilio')) {
                botResponse = 'Sí, hacemos delivery a través de Rappi. Puedes hacer tu pedido desde su aplicación: <a href="https://www.rappi.com.pe/restaurantes/61289-miso-cocina-nikkei" target="_blank" class="chatbot-link">Rappi - Miso Cocina Nikkei</a>.';
            } else if (normalizedMessage.includes('reserva') || normalizedMessage.includes('reservar')) {
                botResponse = 'Para hacer una reserva, por favor visita nuestra sección de Reservas: <a href="Nosotros.html#reservas" target="_blank" class="chatbot-link">Reservar mesa</a>.';
            } else if (normalizedMessage.includes('gracias') || normalizedMessage.includes('muchas gracias')) {
                botResponse = `¡De nada${userName ? ', ' + userName : ''}! Estoy aquí para ayudarte.`;
            } else if (normalizedMessage.includes('adiós') || normalizedMessage.includes('chao') || normalizedMessage.includes('nos vemos')) {
                botResponse = `¡Hasta luego${userName ? ', ' + userName : ''}! Espero verte pronto en Miso Cocina Nikkei.`;
            }

            addBotMessage(botResponse);
        };

        // === Event Listeners ===

        // Botón principal de abrir/cerrar chatbot
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotContainer.classList.toggle('active');

            // Cambiar icono del botón flotante
            if (chatbotContainer.classList.contains('active')) {
                chatbotToggleBtn.innerHTML = '×'; // Si está abierto, mostrar 'x'
                // Si se abre por primera vez, enviar el mensaje de bienvenida
                if (chatState === 0) {
                    addBotMessage("¡Hola! Soy Misoku, el asistente de Miso Cocina Nikkei. ¿Cuál es tu nombre?");
                    chatState = 1; // Cambiar el estado a "preguntando por el nombre"
                }
            } else {
                chatbotToggleBtn.innerHTML = '💬'; // Si está cerrado, mostrar icono de chat
                // Si el chatbot se cierra, reiniciar el estado y limpiar los mensajes
                chatState = 0;
                userName = '';
                chatMessages.innerHTML = ''; // Limpiar historial de mensajes al cerrar
            }
        });

        // Botón de cerrar dentro del chatbot
        chatbotCloseBtn.addEventListener('click', () => {
            chatbotContainer.classList.remove('active'); // Ocultar el chatbot
            chatbotToggleBtn.innerHTML = '💬'; // Asegurar que el botón flotante vuelva al icono de chat
            chatState = 0; // Reiniciar estado
            userName = ''; // Reiniciar nombre de usuario
            chatMessages.innerHTML = ''; // Limpiar historial de mensajes
        });

        // Botón de enviar mensaje
        sendBtn.addEventListener('click', sendMessage);

        // Enviar mensaje al presionar Enter en el input
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

    } else {
        console.error("Error: No se encontraron todos los elementos del chatbot en el DOM. Asegúrate de que los IDs y clases HTML sean correctos.");
    }
});