// Timer countdown
function initTimer() {
    const timerElement = document.querySelector('.font-mono');
    if (!timerElement) return;

    let [minutes, seconds] = timerElement.textContent.split(':').map(Number);

    setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        }

        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// FAQ Accordion
function initFAQ() {
    const faqButtons = document.querySelectorAll('button[aria-controls]');

    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const targetId = button.getAttribute('aria-controls');
            const targetContent = document.getElementById(targetId);

            // Toggle state
            button.setAttribute('aria-expanded', !isExpanded);
            button.setAttribute('data-state', isExpanded ? 'closed' : 'open');

            if (targetContent) {
                targetContent.setAttribute('data-state', isExpanded ? 'closed' : 'open');
                if (isExpanded) {
                    targetContent.setAttribute('hidden', '');
                } else {
                    targetContent.removeAttribute('hidden');
                }
            }
        });
    });
}

// Kit Selection
let selectedKit = 'colecionador'; // Default selection

function initKitSelection() {
    const kitCards = document.querySelectorAll('.flex.flex-col.gap-4 > div');

    // Kit data
    const kits = {
        'basico': { name: 'Kit Básico', price: 39.90, packets: 10 },
        'iniciante': { name: 'Kit Iniciante', price: 59.90, packets: 30 },
        'campeao': { name: 'Kit Campeão', price: 97.90, packets: 60 },
        'colecionador': { name: 'Kit Colecionador', price: 119.90, packets: 90 }
    };

    kitCards.forEach((card, index) => {
        const kitId = Object.keys(kits)[index];

        // Add click handler
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            // Remove selection from all cards
            kitCards.forEach(c => {
                c.classList.remove('border-panini-green', 'shadow-lg');
                c.classList.add('border-primary', 'shadow-sm');

                // Update radio button visual
                const radio = c.querySelector('.w-6.h-6.rounded-full');
                if (radio) {
                    radio.classList.remove('border-panini-green');
                    radio.classList.add('border-muted-foreground/40');
                    const innerCircle = radio.querySelector('.w-3\\.5');
                    if (innerCircle) innerCircle.remove();
                }
            });

            // Add selection to clicked card
            card.classList.remove('border-primary', 'shadow-sm');
            card.classList.add('border-panini-green', 'shadow-lg');

            // Update radio button
            const radio = card.querySelector('.w-6.h-6.rounded-full');
            if (radio) {
                radio.classList.remove('border-muted-foreground/40');
                radio.classList.add('border-panini-green');

                // Add inner circle if not exists
                if (!radio.querySelector('.w-3\\.5')) {
                    const innerCircle = document.createElement('div');
                    innerCircle.className = 'w-3.5 h-3.5 rounded-full bg-panini-green';
                    radio.appendChild(innerCircle);
                }
            }

            selectedKit = kitId;
        });
    });
}

// Checkout Button
function initCheckoutButton() {
    const checkoutButton = document.querySelector('button.bg-panini-green');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            // Get current URL parameters
            const params = new URLSearchParams(window.location.search);
            params.set('kit', selectedKit);

            // Redirect to checkout with parameters
            window.location.href = `https://seguro.copa-lojaspanini.shop/pay/d19ab365-d732-4e99-8e71-a5c1f3d84569`;
        });
    }
}

// UTM Parameter Preservation
function initUTMTracking() {
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (link && link.href) {
            try {
                const url = new URL(link.href, window.location.origin);
                if (url.pathname.includes('checkout')) {
                    const currentParams = new URLSearchParams(window.location.search);
                    currentParams.forEach((val, key) => {
                        if (!url.searchParams.has(key)) url.searchParams.set(key, val);
                    });
                    link.href = url.toString();
                }
            } catch (err) {
                console.error("Error patching link:", err);
            }
        }
    }, true);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTimer();
    initFAQ();
    initKitSelection();
    initCheckoutButton();
    initUTMTracking();
});
