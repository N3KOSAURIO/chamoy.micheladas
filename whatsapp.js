// =============================================
// WHATSAPP FLOTANTE - COMPONENTE REUTILIZABLE
// =============================================

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        phoneNumber: '573206650984',
        faqItems: [
            {
                icon: 'fa-regular fa-clock',
                text: '¿Cuál es el horario de atención?',
                message: '¡Hola Chamoy! 🥪 Quiero saber cuál es el horario de atención hoy.'
            },
            {
                icon: 'fa-solid fa-motorcycle',
                text: '¿Tienen cobertura de domicilios?',
                message: '¡Hola Chamoy! 📍 ¿Quiero saber si tienen cobertura de domicilios en mi zona?'
            },
            {
                icon: 'fa-solid fa-calendar-days',
                text: 'Cotizar reservas o eventos especiales',
                message: '¡Hola Chamoy! 🥂 Me gustaría cotizar un evento o reserva especial.'
            },
            {
                icon: 'fa-solid fa-credit-card',
                text: 'Métodos de pago disponibles',
                message: '¡Hola Chamoy! 💳 ¿Qué medios de pago reciben en el local y domicilios?'
            }
        ]
    };

    // =============================================
    // CREAR E INYECTAR EL HTML DEL WIDGET
    // =============================================
    function createWhatsAppWidget() {
        // Contenedor principal
        const container = document.createElement('div');
        container.className = 'whatsapp-floating-container';
        container.id = 'whatsapp-widget';

        // Ventana FAQ
        const faqWindow = document.createElement('div');
        faqWindow.className = 'whatsapp-faq-window';
        faqWindow.id = 'whatsapp-faq-window';
        faqWindow.style.display = 'none';

        // Cabecera FAQ
        const faqHeader = document.createElement('div');
        faqHeader.className = 'faq-header';
        faqHeader.innerHTML = `
            <div class="faq-avatar">🌶️</div>
            <div class="faq-header-info">
                <h4>Soporte Chamoy</h4>
                <p>Normalmente responde en minutos</p>
            </div>
            <button class="faq-close" id="faq-close-btn">&times;</button>
        `;

        // Cuerpo FAQ
        const faqBody = document.createElement('div');
        faqBody.className = 'faq-body';

        const welcomeMsg = document.createElement('p');
        welcomeMsg.className = 'faq-welcome';
        welcomeMsg.textContent = '¡Hola! 🔥 ¿En qué te podemos ayudar hoy? Elige una opción para chatear:';
        faqBody.appendChild(welcomeMsg);

        // Opciones FAQ
        const faqOptions = document.createElement('div');
        faqOptions.className = 'faq-options';

        CONFIG.faqItems.forEach(item => {
            const link = document.createElement('a');
            link.className = 'faq-item';
            link.href = `https://api.whatsapp.com/send?phone=${CONFIG.phoneNumber}&text=${encodeURIComponent(item.message)}`;
            link.target = '_blank';
            link.innerHTML = `<i class="${item.icon}"></i> ${item.text}`;
            faqOptions.appendChild(link);
        });

        faqBody.appendChild(faqOptions);
        faqWindow.appendChild(faqHeader);
        faqWindow.appendChild(faqBody);

        // Botón WhatsApp
        const whatsappBtn = document.createElement('button');
        whatsappBtn.className = 'btn-whatsapp-toggle';
        whatsappBtn.id = 'whatsapp-toggle-btn';
        whatsappBtn.innerHTML = `
            <i class="fa-brands fa-whatsapp"></i>
            <span class="notification-badge">1</span>
        `;

        // Ensamblar
        container.appendChild(faqWindow);
        container.appendChild(whatsappBtn);

        // Insertar al final del body
        document.body.appendChild(container);

        // =============================================
        // EVENTOS
        // =============================================
        const toggleBtn = document.getElementById('whatsapp-toggle-btn');
        const closeBtn = document.getElementById('faq-close-btn');
        const faqWindowElement = document.getElementById('whatsapp-faq-window');

        function toggleWhatsApp() {
            if (faqWindowElement.style.display === 'block') {
                faqWindowElement.style.display = 'none';
            } else {
                faqWindowElement.style.display = 'block';
            }
        }

        // Abrir/cerrar con el botón principal
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleWhatsApp);
        }

        // Cerrar con la X
        if (closeBtn) {
            closeBtn.addEventListener('click', toggleWhatsApp);
        }

        // Cerrar al hacer click fuera del widget
        document.addEventListener('click', function(event) {
            const widget = document.getElementById('whatsapp-widget');
            if (!widget) return;

            const isClickInsideWidget = widget.contains(event.target);
            if (!isClickInsideWidget && faqWindowElement.style.display === 'block') {
                faqWindowElement.style.display = 'none';
            }
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                if (faqWindowElement.style.display === 'block') {
                    faqWindowElement.style.display = 'none';
                }
            }
        });
    }

    // =============================================
    // INICIALIZAR CUANDO EL DOM ESTÉ LISTO
    // =============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWhatsAppWidget);
    } else {
        createWhatsAppWidget();
    }

})();
