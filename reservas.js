document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos del DOM
    const formReserva = document.getElementById('formReserva'); // El formulario de reserva
    const reservaModal = document.getElementById('reservaModal'); // El modal completo
    const mensajeReservaModal = document.getElementById('mensajeReservaModal'); // El párrafo dentro del modal para el mensaje
    const cerrarReservaModalBtn = document.getElementById('cerrarReservaModal'); // Botón 'x' para cerrar
    const aceptarReservaModalBtn = document.getElementById('aceptarReservaModal'); // Botón 'Aceptar' para cerrar

    // Verificar si el formulario existe en la página antes de intentar añadir el evento
    if (formReserva) {
        formReserva.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional y recargue la página

            // Recopila los datos del formulario (opcional, si los necesitas para el backend)
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const personas = document.getElementById('personas').value;
            const hora = document.getElementById('hora').value;

            console.log("Datos de la reserva (simulada):", {
                nombre,
                telefono,
                personas,
                hora
            });

            // --- Lógica para guardar la reserva (simulada) ---
            // En un proyecto real, aquí harías una petición AJAX (fetch o XMLHttpRequest)
            // a un script PHP en el backend para guardar la reserva en una base de datos.
            // La variable `exitoReserva` dependería de la respuesta del servidor.

            const exitoReserva = true; // Por ahora, siempre asumimos que la reserva es exitosa.
                                     // Si quisieras simular un error, cámbiala a `false`.

            if (exitoReserva) {
                mensajeReservaModal.textContent = "¡La reserva se ha guardado con éxito!"; // Texto del mensaje
                mensajeReservaModal.style.color = "#5cb85c"; // Color verde para el mensaje de éxito
            } else {
                mensajeReservaModal.textContent = "Hubo un error al guardar la reserva. Por favor, inténtalo de nuevo."; // Mensaje de error
                mensajeReservaModal.style.color = "#d9534f"; // Color rojo para el mensaje de error
            }

            // Mostrar el modal de confirmación
            reservaModal.style.display = 'block';

            // Limpia los campos del formulario después de intentar enviar
            formReserva.reset();
        });
    }

    // Funciones para cerrar el modal
    function cerrarModal() {
        reservaModal.style.display = 'none';
    }

    // Event listeners para cerrar el modal
    // Cierra el modal al hacer clic en la 'x'
    if (cerrarReservaModalBtn) {
        cerrarReservaModalBtn.addEventListener('click', cerrarModal);
    }

    // Cierra el modal al hacer clic en el botón 'Aceptar'
    if (aceptarReservaModalBtn) {
        aceptarReservaModalBtn.addEventListener('click', cerrarModal);
    }

    // Cierra el modal si el usuario hace clic fuera del contenido del modal
    if (reservaModal) {
        window.addEventListener('click', function(event) {
            if (event.target == reservaModal) {
                cerrarModal();
            }
        });
    }
});