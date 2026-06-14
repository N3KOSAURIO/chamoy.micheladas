// Cargar el carrito desde localStorage al iniciar la página
let cart = JSON.parse(localStorage.getItem('CHAMOY_CART')) || [];

// Al cargar cualquier documento HTML, refresca los contadores visibles
document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
});

// --- MENÚ MÓVIL (HAMBURGUESA) ---
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    // Esto agrega o quita la clase "active" que hicimos en el CSS
    navLinks.classList.toggle('active');
}

// Función para añadir productos seguros (Control anti-hacks básico mitigando inputs corruptos)
function addToCart(name, price, event) {
    // Sanitización y validación estricta del tipo de dato recibido
    const cleanPrice = parseFloat(price);
    if (isNaN(cleanPrice) || typeof name !== 'string') return;

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: cleanPrice, quantity: 1 });
    }

    saveAndRefresh();

    // Lanzar animación de vuelo al carrito
    if (event) {
        animateFlyToCart(event);
    }
}

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

    // Forzar reflujo
    particle.offsetWidth;

    // Desplazar partícula al carrito y desvanecerla
    particle.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
    particle.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
    particle.style.transform = 'scale(0.2)';
    particle.style.opacity = '0';

    // Eliminar partícula y animar el icono del carrito
    setTimeout(() => {
        particle.remove();
        cartIcon.classList.add('bounce');
        setTimeout(() => cartIcon.classList.remove('bounce'), 300);
    }, 800);
}

function changeQuantity(index, delta) {
    if (index < 0 || index >= cart.length) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('CHAMOY_CART', JSON.stringify(cart));
    updateCartUI();
}

// Actualiza contadores y renderiza la lista en el panel lateral
function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items');
    const totalValElement = document.getElementById('cart-total-val');

    // Calcular totales de forma segura
    let totalItems = 0;
    let totalPrice = 0;
    let htmlContent = '';

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        totalPrice += (item.price * item.quantity);
        
        // Renderización limpia con controles de cantidad +/- y papelera de eliminar
        htmlContent += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <small>$${item.price.toLocaleString()}</small>
                </div>
                <div class="cart-item-controls">
                    <button onclick="changeQuantity(${index}, -1)" class="btn-qty" title="Disminuir">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" class="btn-qty" title="Aumentar">+</button>
                    <button onclick="removeFromCart(${index})" class="btn-remove-item" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    if(countElement) countElement.innerText = totalItems;
    if(totalValElement) totalValElement.innerText = totalPrice.toLocaleString();
    if(itemsContainer) {
        itemsContainer.innerHTML = cart.length === 0 ? '<p style="color:#a49fc6; text-align:center;">Tu carrito está vacío.</p>' : htmlContent;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

// Animación de despliegue del menú de compras
function toggleCartMenu() {
    const sideCart = document.getElementById('side-cart');
    if(sideCart) sideCart.classList.toggle('open');
}

// --- CONEXIONES EXTERNAS ---

// 1. Redirección de la Tienda a la página de Pedido
function sendOrderWhatsApp() {
    if (typeof cart === 'undefined' || cart.length === 0) {
        alert("¡Tu carrito está vacío! Añade productos en el Menú.");
        return;
    }

    // Se asegura de usar la llave exacta en mayúsculas
    localStorage.setItem('CHAMOY_CART', JSON.stringify(cart));

    // Redirecciona a la página final
    window.location.href = 'pedido.html';
}

// 2. Envío de Formulario de Reservaciones a WhatsApp
function sendReservation(event) {
    event.preventDefault(); // Previene recarga de página no deseada

    // Validación y captura limpia de datos
    const name = document.getElementById('username').value.trim();
    const guests = document.getElementById('guests').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;

    let phoneNumber = "573206650984"; // Tu número corporativo
    let message = `¡Hola! 🚀 Deseo agendar una reservación:\n\n`;
    message += `*A nombre de:* ${name}\n`;
    message += `*Personas:* ${guests}\n`;
    message += `*Fecha:* ${date}\n`;
    message += `*Hora:* ${time}\n\n`;
    message += `¿Tienen disponibilidad en este horario?`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// Para evitar que un cliente intente reservar en una fecha que ya pasó
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});
