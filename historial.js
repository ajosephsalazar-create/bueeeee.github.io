
        document.addEventListener('DOMContentLoaded', () => {
            const purchaseHistoryDisplay = document.getElementById('purchaseHistoryDisplay');
            const clearHistoryButton = document.getElementById('clearHistoryButton');
            const noPurchasesMessage = document.getElementById('noPurchasesMessage');

            function renderPurchaseHistory() {
                purchaseHistoryDisplay.innerHTML = ''; // Limpiar el contenido actual
                let purchases = JSON.parse(localStorage.getItem('misoPurchases')) || [];

                if (purchases.length === 0) {
                    noPurchasesMessage.style.display = 'block';
                    clearHistoryButton.style.display = 'none';
                } else {
                    noPurchasesMessage.style.display = 'none';
                    clearHistoryButton.style.display = 'inline-block';

                    purchases.forEach(purchase => {
                        const purchaseEntry = document.createElement('div');
                        purchaseEntry.classList.add('purchase-entry');
                        let itemsHtml = '<ul>';
                        purchase.items.forEach(item => {
                            itemsHtml += `<li>${item.name} (x${item.quantity}) - S/${(item.price * item.quantity).toFixed(2)}</li>`;
                        });
                        itemsHtml += '</ul>';

                        purchaseEntry.innerHTML = `
                            <p><strong>ID de Compra:</strong> ${purchase.id}</p>
                            <p><strong>Cliente:</strong> ${purchase.cliente}</p>
                            <p><strong>Fecha:</strong> ${purchase.fecha}</p>
                            <p><strong>Total:</strong> S/${purchase.total.toFixed(2)}</p>
                            <p><strong>Estado:</strong> ${purchase.estado}</p>
                            <p><strong>Últimos 4 dígitos de tarjeta:</strong> **** **** **** ${purchase.numero_tarjeta_simulado_ultimos_4}</p>
                            <p><strong>Artículos:</strong></p>
                            ${itemsHtml}
                        `;
                        purchaseHistoryDisplay.appendChild(purchaseEntry);
                    });
                }
            }

            // Cargar el historial al cargar la página
            renderPurchaseHistory();

            // Botón para limpiar el historial
            clearHistoryButton.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres borrar todo el historial de compras? Esto no se puede deshacer.')) {
                    localStorage.removeItem('misoPurchases');
                    renderPurchaseHistory(); // Volver a renderizar para mostrar vacío
                }
            });
        });