// =============================================
// CARRITO DE COMPRAS - CON IMÁGENES
// =============================================

// Cargar el carrito desde localStorage al iniciar
let cart = JSON.parse(localStorage.getItem('CHAMOY_CART')) || [];

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
});

// =============================================
// MENÚ MÓVIL (HAMBURGUESA)
// =============================================
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// =============================================
// AGREGAR PRODUCTO AL CARRITO (CON IMAGEN)
// =============================================
function addToCart(name, price, imgSrc, event) {
    // Validación de datos
    const cleanPrice = parseFloat(price);
    if (isNaN(cleanPrice) || typeof name !== 'string') {
        console.error('Error: Datos inválidos para el producto');
        return;
    }

    // Buscar si el producto ya existe en el carrito
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // NUEVO: Guardamos también la imagen
        cart.push({
            name: name,
            price: cleanPrice,
            quantity: 1,
            imgSrc: imgSrc || 'imagenes/placeholder.png' // Imagen por defecto si no se proporciona
        });
    }

    saveAndRefresh();

    // Lanzar animación de vuelo al carrito
    if (event) {
        animateFlyToCart(event);
    }
}

// Versión para pedido.html
function sendOrderWithNotes() {
    // Obtener datos del carrito
    const cart = JSON.parse(localStorage.getItem('CHAMOY_CART')) || [];
    if (cart.length === 0) {
        alert('¡Tu carrito está vacío! Agrega productos primero.');
        return;
    }

    // Obtener notas del campo de texto
    const notes = document.getElementById('order-notes')?.value.trim() || 'Sin notas adicionales.';

    // Construir mensaje
    let orderSummary = '🍽️ *NUEVO PEDIDO - CHAMOY* 🍽️\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        orderSummary += `• ${item.name} x${item.quantity} = $${subtotal.toLocaleString()}\n`;
    });

    orderSummary += `\n💰 *Total: $${total.toLocaleString()}*`;
    orderSummary += `\n\n📝 *Notas del cliente:*\n${notes}`;
    orderSummary += `\n\n📱 Enviado desde la web de Chamoy`;

    // Número de WhatsApp
    const phoneNumber = '573206650984';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderSummary)}`;

    // Abrir WhatsApp
    window.open(url, '_blank');
}

// =============================================
// ANIMACIÓN DE VUELO AL CARRITO
// =============================================
function animateFlyToCart(event) {
    const button = event.currentTarget || event.target;
    if (!button) return;

    const cartIcon = document.querySelector('.cart-icon-container');
    if (!cartIcon) return;

    const btnRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Crear partícula voladora
    const particle = document.createElement('div');
    particle.className = 'fly-particle';
    particle.style.left = `${btnRect.left + btnRect.width / 2 - 10}px`;
    particle.style.top = `${btnRect.top + btnRect.height / 2 - 10}px`;

    document.body.appendChild(particle);

    // Forzar reflujo para activar la animación
    particle.offsetWidth;

    // Desplazar partícula al carrito y desvanecerla
    particle.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
    particle.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
    particle.style.transform = 'scale(0.6)';
    particle.style.opacity = '0';

    // Eliminar partícula y animar el icono del carrito
    setTimeout(() => {
        particle.remove();
        cartIcon.classList.add('bounce');
        setTimeout(() => cartIcon.classList.remove('bounce'), 300);
    }, 800);
}

// =============================================
// CAMBIAR CANTIDAD DE UN PRODUCTO
// =============================================
function changeQuantity(index, delta) {
    if (index < 0 || index >= cart.length) return;

    cart[index].quantity += delta;

    // Si la cantidad llega a 0, eliminar el producto
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveAndRefresh();
}

// =============================================
// ELIMINAR PRODUCTO DEL CARRITO
// =============================================
function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    saveAndRefresh();
}

// =============================================
// GUARDAR Y ACTUALIZAR UI
// =============================================
function saveAndRefresh() {
    localStorage.setItem('CHAMOY_CART', JSON.stringify(cart));
    updateCartUI();
}

// =============================================
// ACTUALIZAR INTERFAZ DEL CARRITO
// =============================================
function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items');
    const totalValElement = document.getElementById('cart-total-val');

    let totalItems = 0;
    let totalPrice = 0;
    let htmlContent = '';

    if (cart.length === 0) {
        htmlContent = `
            <div style="text-align: center; padding: 40px 0; color: var(--text-muted);">
                <i class="fa-solid fa-basket-shopping" style="font-size: 48px; opacity: 0.3; margin-bottom: 15px; display: block;"></i>
                <p style="font-size: 16px;">Tu carrito está vacío</p>
                <p style="font-size: 13px; opacity: 0.7;">¡Agrega productos del menú!</p>
            </div>
        `;
    } else {
        cart.forEach((item, index) => {
            totalItems += item.quantity;
            totalPrice += (item.price * item.quantity);

            const imgSrc = item.imgSrc || 'imagenes/placeholder.png';

            htmlContent += `
                <div class="cart-item" onclick="event.stopPropagation();">
                    <img src="${imgSrc}" alt="${item.name}" class="cart-item-img" loading="lazy">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <small>$${item.price.toLocaleString()}</small>
                    </div>
                    <div class="cart-item-controls" onclick="event.stopPropagation();">
                        <button onclick="event.stopPropagation(); changeQuantity(${index}, -1)" class="btn-qty" title="Disminuir">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button onclick="event.stopPropagation(); changeQuantity(${index}, 1)" class="btn-qty" title="Aumentar">+</button>
                        <button onclick="event.stopPropagation(); removeFromCart(${index})" class="btn-remove-item" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }

    if (countElement) {
        countElement.innerText = totalItems;
        countElement.style.display = totalItems === 0 ? 'none' : 'inline-block';
    }

    if (totalValElement) {
        totalValElement.innerText = totalPrice.toLocaleString();
    }

    if (itemsContainer) {
        itemsContainer.innerHTML = htmlContent;
    }
}

// =============================================
// ABRIR/CERRAR CARRITO LATERAL
// =============================================
function toggleCartMenu() {
    const sideCart = document.getElementById('side-cart');
    if (sideCart) {
        sideCart.classList.toggle('open');
    }
}

// =============================================
// ENVIAR PEDIDO POR WHATSAPP
// =============================================
function sendOrderWhatsApp() {
    if (cart.length === 0) {
        alert('¡Tu carrito está vacío! Añade productos del menú primero.');
        return;
    }

    // Guardar carrito antes de redirigir
    localStorage.setItem('CHAMOY_CART', JSON.stringify(cart));

    // Redirigir a la página de pedido
    window.location.href = 'pedido.html';
}

// =============================================
// ENVIAR RESERVACIÓN POR WHATSAPP
// =============================================
function sendReservation(event) {
    event.preventDefault();

    // Capturar datos del formulario
    const name = document.getElementById('username')?.value?.trim() || '';
    const guests = document.getElementById('guests')?.value || '';
    const date = document.getElementById('res-date')?.value || '';
    const time = document.getElementById('res-time')?.value || '';

    // Validar campos obligatorios
    if (!name || !guests || !date || !time) {
        alert('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Construir mensaje para WhatsApp
    const phoneNumber = '573206650984';
    let message = `¡Hola! 🚀 Deseo agendar una reservación en Chamoy:\n\n`;
    message += `*Nombre:* ${name}\n`;
    message += `*Número de personas:* ${guests}\n`;
    message += `*Fecha:* ${date}\n`;
    message += `*Hora:* ${time}\n\n`;
    message += `¿Tienen disponibilidad en este horario?`;

    // Abrir WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// =============================================
// VALIDACIÓN DE FECHA EN RESERVAS
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        // Opcional: validar que no se seleccione una fecha pasada
        dateInput.addEventListener('change', function() {
            if (this.value < today) {
                alert('No puedes seleccionar una fecha pasada.');
                this.value = today;
            }
        });
    }
});

// =============================================
// CERRAR CARRITO AL HACER CLICK FUERA
// =============================================
document.addEventListener('click', function(event) {
    const sideCart = document.getElementById('side-cart');
    const cartIcon = document.querySelector('.cart-icon-container');

    if (!sideCart || !cartIcon) return;

    // Si el carrito está abierto y el click no fue dentro del carrito ni en el icono
    if (sideCart.classList.contains('open')) {
        const isClickInsideCart = sideCart.contains(event.target);
        const isClickOnCartIcon = cartIcon.contains(event.target);

        if (!isClickInsideCart && !isClickOnCartIcon) {
            sideCart.classList.remove('open');
        }
    }
});

// =============================================
// OBTENER UBICACIÓN AUTOMÁTICA (Google Maps)
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    const locationBtn = document.getElementById('btn-get-location');
    const addressInput = document.getElementById('delivery-address');

    if (locationBtn && addressInput) {
        locationBtn.addEventListener('click', function() {
            // Verificar si el navegador soporta geolocalización
            if (!navigator.geolocation) {
                alert('❌ Tu navegador no soporta geolocalización. Por favor ingresa la dirección manualmente.');
                return;
            }

            // Cambiar estado del botón
            locationBtn.classList.add('loading');
            locationBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            locationBtn.disabled = true;

            // Mostrar feedback temporal
            showLocationFeedback('Obteniendo tu ubicación...', 'loading');

            navigator.geolocation.getCurrentPosition(
                // Éxito
                function(position) {
                    const { latitude, longitude } = position.coords;
                    
                    // Construir URL de Google Maps con la ubicación
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                    
                    // Mostrar la ubicación en el input (formato amigable)
                    addressInput.value = `📍 Ubicación: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    addressInput.dataset.lat = latitude;
                    addressInput.dataset.lng = longitude;
                    addressInput.dataset.mapsUrl = mapsUrl;

                    // Restaurar botón
                    locationBtn.classList.remove('loading');
                    locationBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
                    locationBtn.disabled = false;

                    // Feedback de éxito
                    showLocationFeedback('✅ Ubicación obtenida correctamente. Se ha agregado la coordenada.', 'success');

                    // Abrir Google Maps en una nueva pestaña (opcional - se puede omitir)
                    // window.open(mapsUrl, '_blank');

                    // Mensaje adicional: el usuario puede hacer clic en el input para abrir el mapa
                    addressInput.style.cursor = 'pointer';
                    addressInput.title = 'Haz clic para ver en Google Maps';
                    
                    // Al hacer clic en el input, abrir Google Maps
                    addressInput.onclick = function() {
                        if (this.dataset.mapsUrl) {
                            window.open(this.dataset.mapsUrl, '_blank');
                        }
                    };

                },
                // Error
                function(error) {
                    console.error('Error de geolocalización:', error);
                    
                    // Restaurar botón
                    locationBtn.classList.remove('loading');
                    locationBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
                    locationBtn.disabled = false;

                    // Mensaje de error según el tipo
                    let errorMsg = '❌ No se pudo obtener tu ubicación. ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMsg += 'Por favor, permite el acceso a tu ubicación en la configuración del navegador.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMsg += 'La información de ubicación no está disponible.';
                            break;
                        case error.TIMEOUT:
                            errorMsg += 'La solicitud de ubicación ha expirado. Intenta de nuevo.';
                            break;
                        default:
                            errorMsg += 'Intenta ingresar la dirección manualmente.';
                    }
                    
                    showLocationFeedback(errorMsg, 'error');
                    
                    // Si el usuario tiene permisos, ofrecer abrir Google Maps manualmente
                    if (error.code === error.PERMISSION_DENIED) {
                        const openMaps = confirm('¿Quieres abrir Google Maps para buscar tu ubicación manualmente?');
                        if (openMaps) {
                            window.open('https://www.google.com/maps', '_blank');
                        }
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        });
    }
});

// =============================================
// FUNCIÓN PARA MOSTRAR FEEDBACK DE UBICACIÓN
// =============================================

function showLocationFeedback(message, type) {
    // Remover feedback anterior
    const existingFeedback = document.querySelector('.location-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Crear nuevo feedback
    const feedback = document.createElement('div');
    feedback.className = `location-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.display = 'block';

    // Insertar después del input de dirección
    const addressInput = document.getElementById('delivery-address');
    if (addressInput && addressInput.parentElement) {
        addressInput.parentElement.parentElement.insertBefore(
            feedback, 
            addressInput.parentElement.nextSibling
        );
    }

    // Auto-ocultar después de 8 segundos (excepto errores)
    if (type !== 'error') {
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.style.opacity = '0';
                setTimeout(() => feedback.remove(), 500);
            }
        }, 8000);
    }
}

// =============================================
// ACTUALIZAR FUNCIÓN sendOrderWithNotes()
// =============================================

// Esta función reemplaza la existente - agrega el nombre del receptor
function sendOrderWithNotes() {
    // Obtener carrito
    const cart = JSON.parse(localStorage.getItem('CHAMOY_CART')) || [];
    if (cart.length === 0) {
        alert('❌ Tu carrito está vacío. Agrega productos primero.');
        return;
    }

    // Obtener datos del formulario
    const notes = document.getElementById('order-notes')?.value.trim() || 'Sin notas adicionales.';
    const address = document.getElementById('delivery-address')?.value.trim() || 'No especificada.';
    const phone = document.getElementById('contact-phone')?.value.trim() || 'No especificado.';
    const receiverName = document.getElementById('receiver-name')?.value.trim() || 'No especificado.';

    // Validar campos obligatorios (opcional)
    if (!address || address === 'No especificada.') {
        const confirmar = confirm('⚠️ No has ingresado una dirección de entrega. ¿Quieres continuar de todos modos?');
        if (!confirmar) return;
    }

    // Construir mensaje
    let mensaje = '🍽️ *NUEVO PEDIDO - CHAMOY* 🍽️\n\n';
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        mensaje += `• ${item.name} ×${item.quantity} = $${subtotal.toLocaleString()}\n`;
    });

    mensaje += `\n💰 *Total: $${total.toLocaleString()}*`;
    mensaje += `\n\n👤 *Recibe:* ${receiverName}`;
    mensaje += `\n📍 *Dirección:* ${address}`;
    mensaje += `\n📱 *Contacto:* ${phone}`;
    mensaje += `\n📝 *Notas:* ${notes}`;
    mensaje += `\n\n🙏 ¡Gracias por tu pedido! 🔥`;

    // Número de WhatsApp
    const phoneNumber = '573206650984';
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp
    window.open(url, '_blank');
}

// =============================================
// CERRAR CARRITO CON TECLA ESC
// =============================================
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const sideCart = document.getElementById('side-cart');
        if (sideCart && sideCart.classList.contains('open')) {
            sideCart.classList.remove('open');
        }
    }
});
