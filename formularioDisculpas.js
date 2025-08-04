document.addEventListener('DOMContentLoaded', function() {
    const disculpasLink = document.querySelector('a[href="#modal-disculpas"]');
    const disculpasModal = document.getElementById('modal-disculpas');
    const cerrarDisculpasBtn = disculpasModal ? disculpasModal.querySelector('.cerrar') : null;
    const disculpasForm = document.getElementById('disculpasForm');
    const mensajeDisculpasDiv = document.getElementById('mensaje-disculpas');
    const cerrarMensajeDisculpasBtn = mensajeDisculpasDiv ? mensajeDisculpasDiv.querySelector('.cerrar-mensaje-disculpas') : null;

    // 1. Manejo de la apertura del modal
    if (disculpasLink && disculpasModal) {
        disculpasLink.addEventListener('click', function(e) {
            e.preventDefault();
            disculpasModal.classList.add('activo');
            document.body.style.overflow = 'hidden'; // Evita scroll en el body
            
            // Asegúrate de que el formulario esté visible y el mensaje oculto al abrir
            if (disculpasForm) disculpasForm.style.display = 'grid'; // Usa 'grid' como en el CSS
            if (mensajeDisculpasDiv) mensajeDisculpasDiv.style.display = 'none';
            disculpasForm.reset(); // Limpia el formulario cada vez que se abre
            
            // Oculta todos los mensajes de error al abrir y quita clases de error
            disculpasForm.querySelectorAll('.error-message').forEach(span => {
                span.style.display = 'none';
            });
            disculpasForm.querySelectorAll('.invalid-field').forEach(input => {
                input.classList.remove('invalid-field');
            });
        });
    }

    // 2. Manejo del cierre del modal principal (botón X o clic fuera)
    if (cerrarDisculpasBtn) {
        cerrarDisculpasBtn.addEventListener('click', function(e) {
            e.preventDefault();
            disculpasModal.classList.remove('activo');
            document.body.style.overflow = ''; // Restaura scroll en el body
        });
    }

    if (disculpasModal) {
        disculpasModal.addEventListener('click', function(e) {
            if (e.target === disculpasModal) {
                disculpasModal.classList.remove('activo');
                document.body.style.overflow = '';
            }
        });
    }

    // 3. Manejo del envío del formulario
    if (disculpasForm) {
        disculpasForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita el envío por defecto

            let isValid = true;
            // Selecciona todos los inputs con el atributo 'required'
            const fields = disculpasForm.querySelectorAll('input[required]');

            // Limpiar errores previos y clases de estilo de error
            disculpasForm.querySelectorAll('.error-message').forEach(span => {
                span.style.display = 'none';
            });
            disculpasForm.querySelectorAll('.invalid-field').forEach(input => {
                input.classList.remove('invalid-field');
            });

            fields.forEach(field => {
                const errorMessageSpan = field.nextElementSibling; // El span.error-message debe estar justo después
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('invalid-field'); // Añade clase para resaltar el campo
                    if (errorMessageSpan) {
                        errorMessageSpan.textContent = 'Este campo es obligatorio.';
                        errorMessageSpan.style.display = 'block';
                    }
                } else {
                    field.classList.remove('invalid-field');
                    if (errorMessageSpan) errorMessageSpan.style.display = 'none';
                }
            });

            // Validación de patrones específicos (DNI, Teléfono, Correo)
            const dniInput = document.getElementById('dniUsuario');
            const telefonoInput = document.getElementById('telefonoUsuario');
            const emailInput = document.getElementById('correoUsuario');

            // Función de ayuda para validar patrones y mostrar mensajes
            const validatePattern = (inputElement, pattern, message) => {
                if (inputElement && inputElement.value.trim() !== '' && !pattern.test(inputElement.value)) {
                    isValid = false;
                    inputElement.classList.add('invalid-field');
                    const errorMessageSpan = inputElement.nextElementSibling;
                    if (errorMessageSpan) {
                        errorMessageSpan.textContent = message;
                        errorMessageSpan.style.display = 'block';
                    }
                }
            };

            validatePattern(dniInput, /^[0-9]{8}$/, 'El DNI debe tener 8 dígitos numéricos.');
            validatePattern(telefonoInput, /^[0-9]{9}$/, 'El teléfono debe tener 9 dígitos numéricos.');
            validatePattern(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Ingrese un correo electrónico válido.');

            if (isValid) {
                // Si todo es válido, oculta el formulario y muestra el mensaje de disculpas
                disculpasForm.style.display = 'none';
                if (mensajeDisculpasDiv) {
                    mensajeDisculpasDiv.style.display = 'block';
                }
                // Aquí podrías recopilar los datos del formulario si necesitaras enviarlos a un backend
                const formData = new FormData(disculpasForm);
                const data = {};
                formData.forEach((value, key) => (data[key] = value));
                console.log('Datos del formulario enviados (simulación):', data);

            } else {
                // Si no es válido, puedes dar una alerta general adicional o confiar en los mensajes de campo.
                alert('Por favor, complete todos los campos requeridos y corrija los errores.');
            }
        });
    }

    // 4. Manejo del cierre del mensaje de disculpas
    if (cerrarMensajeDisculpasBtn) {
        cerrarMensajeDisculpasBtn.addEventListener('click', function() {
            if (mensajeDisculpasDiv) mensajeDisculpasDiv.style.display = 'none';
            disculpasModal.classList.remove('activo');
            document.body.style.overflow = '';
            disculpasForm.reset(); // Resetea el formulario al cerrar el modal después del mensaje
        });
    }
});