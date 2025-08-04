  document.addEventListener('DOMContentLoaded', () => {
      const cartCountSpan = document.getElementById('cartCount');
      const openCartModalBtn = document.getElementById('openCartModal');
      const closeCartModalBtn = document.getElementById('closeCartModal');
      const cartModal = document.getElementById('cartModal');
      const cartItemsList = document.getElementById('cartItemsList');
      const cartTotalSpan = document.getElementById('cartTotal');
      const cartEmptyMessage = document.getElementById('cartEmptyMessage');
      const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
      const proceedToPaymentBtn = document.getElementById('proceedToPayment');

      const paymentModal = document.getElementById('paymentModal');
      const closePaymentModalBtn = document.getElementById('closePaymentModal');
      const paymentForm = document.getElementById('paymentForm');
      const customerNameInput = document.getElementById('customerName');
      const cardNumberInput = document.getElementById('cardNumber');
      const purchaseConfirmationDiv = document.getElementById('purchaseConfirmation');

      let cart = []; // Array para almacenar los ítems del carrito

      // --- Funciones del Carrito ---

      // Función para actualizar el contador del carrito en la interfaz
      function updateCartCount() {
        cartCountSpan.textContent = cart.reduce((total, item) => total + item.quantity, 0);
      }

      // Función para renderizar los ítems en el modal del carrito
      function renderCartItems() {
        cartItemsList.innerHTML = ''; // Limpiar la lista actual
        let total = 0;

        if (cart.length === 0) {
          cartEmptyMessage.style.display = 'block';
          cartItemsList.style.display = 'none';
          proceedToPaymentBtn.disabled = true; // Deshabilita el botón si el carrito está vacío
        } else {
          cartEmptyMessage.style.display = 'none';
          cartItemsList.style.display = 'block';
          proceedToPaymentBtn.disabled = false; // Habilita el botón si hay ítems
          cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <div class="item-quantity">
              <button class="quantity-btn decrease-quantity" data-name="${item.name}">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn increase-quantity" data-name="${item.name}">+</button>
            </div>
            <span class="item-total">S/${(item.price * item.quantity).toFixed(2)}</span>
          `;
            cartItemsList.appendChild(listItem);
            total += item.price * item.quantity;
          });
        }
        cartTotalSpan.textContent = `S/${total.toFixed(2)}`;
        updateCartCount();
      }

      // Añadir un ítem al carrito
      function addItemToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({
            name,
            price: parseFloat(price),
            quantity: 1
          });
        }
        renderCartItems();
      }

      // Eliminar un ítem del carrito (o disminuir cantidad)
      function removeItemFromCart(name) {
        const itemIndex = cart.findIndex(item => item.name === name);
        if (itemIndex > -1) {
          if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
          } else {
            cart.splice(itemIndex, 1); // Eliminar si la cantidad es 1
          }
        }
        renderCartItems();
      }

      // --- Event Listeners ---

      // Event Listeners para los botones "Añadir al carrito"
      addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const card = event.target.closest('.card');
          const name = card.dataset.name;
          const price = card.dataset.price;
          addItemToCart(name, price);
        });
      });

      // Abrir modal del carrito
      openCartModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'flex';
        renderCartItems();
      });

      // Cerrar modal del carrito
      closeCartModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
      });

      // Event listener para los botones de cantidad dentro del carrito
      cartItemsList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('increase-quantity')) {
          const itemName = target.dataset.name;
          const item = cart.find(i => i.name === itemName);
          if (item) {
            item.quantity++;
            renderCartItems();
          }
        } else if (target.classList.contains('decrease-quantity')) {
          const itemName = target.dataset.name;
          removeItemFromCart(itemName);
        }
      });

      // --- Funcionalidad de Pago Simulada ---

      // Abrir modal de pago al hacer clic en "Proceder al pago"
      proceedToPaymentBtn.addEventListener('click', () => {
        if (cart.length > 0) {
          cartModal.style.display = 'none'; // Cierra el modal del carrito
          paymentModal.style.display = 'flex'; // Abre el modal de pago
          purchaseConfirmationDiv.style.display = 'none'; // Asegurarse de que el mensaje de confirmación esté oculto
          paymentForm.style.display = 'block'; // Asegurarse de que el formulario esté visible
          paymentForm.reset(); // Limpiar el formulario
        } else {
          alert('Tu carrito está vacío. Añade productos para proceder al pago.');
        }
      });

      // Cerrar modal de pago
      closePaymentModalBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
      });

      // Manejar el envío del formulario de pago (SIMULADO)
      paymentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que el formulario se recargue la página

        const customerName = customerNameInput.value;
        const cardNumber = cardNumberInput.value; // Solo para demostración

        if (cart.length === 0) {
          alert('El carrito está vacío. No se puede realizar la compra.');
          return;
        }

        const totalAmount = parseFloat(cartTotalSpan.textContent.replace('S/', ''));
        const purchaseId = `PUR-${Date.now()}`; // ID único simulado
        // Obtener la fecha y hora actual en la zona horaria de Lima
        const purchaseDate = new Date().toLocaleString('es-PE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Lima'
        });

        const purchaseData = {
          id: purchaseId,
          cliente: customerName,
          total: totalAmount,
          items: JSON.parse(JSON.stringify(cart)), // Copia profunda del carrito
          fecha: purchaseDate,
          // NOTA: En un sistema real, NUNCA se almacenaría el número de tarjeta completo
          // Aquí es solo para simular que se ha "recibido"
          numero_tarjeta_simulado_ultimos_4: cardNumber.slice(-4),
          estado: 'Completada'
        };

        // --- Simular almacenamiento en "base de datos" (localStorage) ---
        // Recuperar historial existente o inicializarlo
        let purchaseHistory = JSON.parse(localStorage.getItem('misoPurchases')) || [];
        purchaseHistory.push(purchaseData);
        localStorage.setItem('misoPurchases', JSON.stringify(purchaseHistory));

        console.log("--- Compra Registrada (Simulado en localStorage) ---");
        console.log(purchaseData);
        console.log("--- Historial de Compras Actual (Simulado en localStorage) ---");
        console.log(purchaseHistory);


        // Mostrar mensaje de confirmación
        paymentForm.style.display = 'none';
        purchaseConfirmationDiv.style.display = 'block';

        // Opcional: Cerrar el modal después de un tiempo y limpiar carrito
        setTimeout(() => {
          paymentModal.style.display = 'none';
          cart = []; // Limpiar el carrito después de una compra exitosa
          renderCartItems(); // Actualiza el carrito y el contador
        }, 3000); // Cierra después de 3 segundos
      });


      // --- Funcionalidad para el modal de términos y condiciones (ya existente) ---
      const modalTerminos = document.getElementById('modal-terminos');
      const linkTerminos = document.querySelector('footer .footer-links a[href="#modal-terminos"]');
      const cerrarTerminos = modalTerminos.querySelector('.cerrar');

      if (linkTerminos) {
        linkTerminos.addEventListener('click', function(e) {
          e.preventDefault();
          modalTerminos.style.display = 'flex'; // Usar flex para centrar
        });
      }

      if (cerrarTerminos) {
        cerrarTerminos.addEventListener('click', function() {
          modalTerminos.style.display = 'none';
        });
      }

      // Cerrar modales al hacer clic fuera de ellos
      window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
          cartModal.style.display = 'none';
        }
        if (event.target === paymentModal) {
          paymentModal.style.display = 'none';
          // Resetear el formulario y ocultar confirmación si se cierra el modal de pago
          paymentForm.style.display = 'block';
          purchaseConfirmationDiv.style.display = 'none';
          paymentForm.reset();
        }
        if (event.target === modalTerminos) {
          modalTerminos.style.display = 'none';
        }
      });


      updateCartCount(); // Inicializar el contador del carrito al cargar la página
    });