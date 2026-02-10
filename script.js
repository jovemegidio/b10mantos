/* ========================================
   B10 MANTOS - ADVANCED JAVASCRIPT
   Professional UX & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // LOAD SITE SETTINGS FROM ADMIN
    // ==========================================
    const siteSettings = (() => {
        try {
            const data = localStorage.getItem('b10_settings');
            return data ? JSON.parse(data) : {};
        } catch { return {}; }
    })();

    const storeConfig = {
        whatsapp: siteSettings.store?.whatsapp || '5511954555972',
        instagram: siteSettings.store?.instagram || '@b10mantos',
        name: siteSettings.store?.name || 'B10 Mantos',
        email: siteSettings.store?.email || 'bruno.teles2@icloud.com'
    };

    const shippingConfig = {
        freeShipping: siteSettings.shipping?.freeShipping ?? 299.90,
        pixDiscount: siteSettings.shipping?.pixDiscount ?? 5,
        maxInstallments: siteSettings.shipping?.maxInstallments ?? 2
    };

    const appearanceConfig = {
        primaryColor: siteSettings.appearance?.primaryColor || '#ff4500',
        announcementText: siteSettings.appearance?.announcementText || '',
        heroTitle1: siteSettings.appearance?.heroTitle1 || '',
        heroTitle2: siteSettings.appearance?.heroTitle2 || ''
    };

    // Apply primary color
    if (appearanceConfig.primaryColor && appearanceConfig.primaryColor !== '#ff4500') {
        document.documentElement.style.setProperty('--primary', appearanceConfig.primaryColor);
    }

    // Apply announcement bar text
    if (appearanceConfig.announcementText) {
        const track = document.querySelector('.announcement-track');
        if (track) {
            const lines = appearanceConfig.announcementText.split('\n').filter(l => l.trim());
            if (lines.length > 0) {
                const spans = lines.map(l => `<span>${l.trim()}</span>`).join('');
                track.innerHTML = spans + spans; // duplicate for marquee effect
            }
        }
    }

    // Apply top-bar dynamic values
    const topBarFrete = document.querySelector('.top-bar-left span:first-child');
    if (topBarFrete) topBarFrete.innerHTML = `<i class="fas fa-truck"></i> Frete grátis acima de R$ ${shippingConfig.freeShipping.toFixed(2).replace('.', ',')}`;

    const topBarPix = document.querySelector('.top-bar-left span:last-child');
    if (topBarPix && topBarPix.textContent.includes('PIX')) {
        topBarPix.innerHTML = `<i class="fab fa-pix"></i> ${shippingConfig.pixDiscount}% OFF no PIX`;
    }

    // Apply WhatsApp/Instagram to top-bar
    const topBarRight = document.querySelector('.top-bar-right');
    if (topBarRight) {
        const waNum = storeConfig.whatsapp.replace(/\D/g, '');
        const waFormatted = waNum.length >= 11 ? `(${waNum.slice(2,4)}) ${waNum.slice(4,9)}-${waNum.slice(9)}` : waNum;
        const waLink = topBarRight.querySelector('a[href*="wa.me"]');
        if (waLink) {
            waLink.href = `https://wa.me/${waNum}`;
            waLink.innerHTML = `<i class="fab fa-whatsapp"></i> ${waFormatted}`;
        }
        const igLink = topBarRight.querySelector('a[href*="instagram"]');
        if (igLink) {
            const igHandle = storeConfig.instagram.replace('@', '');
            igLink.href = `https://www.instagram.com/${igHandle}`;
            igLink.innerHTML = `<i class="fab fa-instagram"></i> ${storeConfig.instagram}`;
        }
    }

    // Apply settings to footer links
    const waNum = storeConfig.whatsapp.replace(/\D/g, '');
    const waFormatted = waNum.length >= 11 ? `(${waNum.slice(2,4)}) ${waNum.slice(4,9)}-${waNum.slice(9)}` : waNum;

    document.querySelectorAll('.footer .contact-list a[href*="wa.me"]').forEach(link => {
        link.href = `https://wa.me/${waNum}`;
        if (link.querySelector('i')) link.innerHTML = `<i class="fab fa-whatsapp"></i> (${waNum.slice(2,4)}) ${waNum.slice(4,9)}-${waNum.slice(9)}`;
    });
    // Update social icon hrefs only (no text injection)
    document.querySelectorAll('.footer .footer-socials a[href*="wa.me"]').forEach(link => {
        link.href = `https://wa.me/${waNum}`;
    });
    document.querySelectorAll('.footer a[href*="instagram"]').forEach(link => {
        const igHandle = storeConfig.instagram.replace('@', '');
        link.href = `https://www.instagram.com/${igHandle}`;
    });
    document.querySelectorAll('.footer .contact-list a[href*="mailto"]').forEach(link => {
        link.href = `mailto:${storeConfig.email}`;
        if (link.querySelector('i')) link.innerHTML = `<i class="fas fa-envelope"></i> ${storeConfig.email}`;
    });

    // ==========================================
    // HERO SLIDER — Professional Carousel
    // ==========================================
    const heroSlider = (() => {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dots .dot');
        const prevBtn = document.getElementById('heroPrev');
        const nextBtn = document.getElementById('heroNext');
        const currentNumEl = document.getElementById('heroCurrentNum');
        const totalNumEl = document.getElementById('heroTotalNum');
        let current = 0;
        let interval;
        const AUTOPLAY_MS = 6000;

        // Set total counter
        if (totalNumEl) totalNumEl.textContent = String(slides.length).padStart(2, '0');

        function goTo(index) {
            if (index === current) return;

            // Remove active from current
            slides[current].classList.remove('active');
            dots[current]?.classList.remove('active');

            // Reset the progress bar animation on the old dot
            const oldProgress = dots[current]?.querySelector('.dot-progress');
            if (oldProgress) {
                oldProgress.style.animation = 'none';
                oldProgress.offsetHeight; // force reflow
                oldProgress.style.animation = '';
            }

            // Set new current
            current = (index + slides.length) % slides.length;

            // Activate new slide
            slides[current].classList.add('active');
            dots[current]?.classList.add('active');

            // Restart the progress bar animation
            const newProgress = dots[current]?.querySelector('.dot-progress');
            if (newProgress) {
                newProgress.style.animation = 'none';
                newProgress.offsetHeight; // force reflow
                newProgress.style.animation = `dotFill ${AUTOPLAY_MS}ms linear forwards`;
            }

            // Update counter
            if (currentNumEl) currentNumEl.textContent = String(current + 1).padStart(2, '0');
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startAutoplay() {
            clearInterval(interval);
            interval = setInterval(next, AUTOPLAY_MS);

            // Start progress bar on first dot
            const firstProgress = dots[current]?.querySelector('.dot-progress');
            if (firstProgress) {
                firstProgress.style.animation = 'none';
                firstProgress.offsetHeight;
                firstProgress.style.animation = `dotFill ${AUTOPLAY_MS}ms linear forwards`;
            }
        }

        function resetAutoplay() {
            clearInterval(interval);
            startAutoplay();
        }

        prevBtn?.addEventListener('click', () => { prev(); resetAutoplay(); });
        nextBtn?.addEventListener('click', () => { next(); resetAutoplay(); });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goTo(parseInt(dot.dataset.slide));
                resetAutoplay();
            });
        });

        // Touch/Swipe support with improved detection
        let touchStartX = 0;
        let touchStartY = 0;
        const slider = document.getElementById('heroSlider');

        slider?.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        slider?.addEventListener('touchend', e => {
            const diffX = touchStartX - e.changedTouches[0].screenX;
            const diffY = touchStartY - e.changedTouches[0].screenY;
            // Only trigger if horizontal swipe is dominant
            if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
                diffX > 0 ? next() : prev();
                resetAutoplay();
            }
        }, { passive: true });

        // Pause on hover (desktop)
        const heroSection = document.getElementById('heroSection');
        heroSection?.addEventListener('mouseenter', () => clearInterval(interval));
        heroSection?.addEventListener('mouseleave', resetAutoplay);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
            if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
        });

        startAutoplay();
        return { goTo, next, prev };
    })();

    // ==========================================
    // COUNTDOWN TIMER
    // ==========================================
    (() => {
        const hoursEl = document.getElementById('cdHours');
        const minutesEl = document.getElementById('cdMinutes');
        const secondsEl = document.getElementById('cdSeconds');

        if (!hoursEl) return;

        // Set end time to midnight
        const now = new Date();
        const endTime = new Date(now);
        endTime.setHours(23, 59, 59, 999);

        function update() {
            const remaining = endTime - new Date();
            if (remaining <= 0) {
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }

            const h = Math.floor(remaining / 3600000);
            const m = Math.floor((remaining % 3600000) / 60000);
            const s = Math.floor((remaining % 60000) / 1000);

            hoursEl.textContent = String(h).padStart(2, '0');
            minutesEl.textContent = String(m).padStart(2, '0');
            secondsEl.textContent = String(s).padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    })();

    // ==========================================
    // HEADER SCROLL EFFECT
    // ==========================================
    (() => {
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            header.classList.toggle('scrolled', y > 10);
            lastScroll = y;
        }, { passive: true });
    })();

    // ==========================================
    // BACK TO TOP
    // ==========================================
    (() => {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();

    // ==========================================
    // MOBILE MENU
    // ==========================================
    (() => {
        const hamburger = document.getElementById('mobileHamburger');
        const nav = document.getElementById('mainNav');
        const overlay = document.getElementById('mobileOverlay');

        function toggle(open) {
            hamburger?.classList.toggle('active', open);
            nav?.classList.toggle('open', open);
            overlay?.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
        }

        hamburger?.addEventListener('click', () => {
            toggle(!nav.classList.contains('open'));
        });

        overlay?.addEventListener('click', () => toggle(false));
    })();

    // ==========================================
    // SEARCH
    // ==========================================
    (() => {
        const input = document.getElementById('searchInput');
        const suggestions = document.getElementById('searchSuggestions');

        if (!input) return;

        input.addEventListener('focus', () => {
            if (!input.value.trim()) suggestions?.classList.add('active');
        });

        input.addEventListener('input', () => {
            const query = input.value.toLowerCase().trim();
            const productCards = document.querySelectorAll('.product-card');

            if (!query) {
                suggestions?.classList.add('active');
                productCards.forEach(card => {
                    card.style.opacity = '1';
                    card.style.transform = '';
                    card.style.pointerEvents = '';
                });
                return;
            }

            suggestions?.classList.remove('active');

            productCards.forEach(card => {
                const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
                const match = name.includes(query);
                card.style.opacity = match ? '1' : '0.2';
                card.style.transform = match ? '' : 'scale(0.95)';
                card.style.pointerEvents = match ? '' : 'none';
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
                suggestions?.classList.remove('active');
            }
        });
    })();

    // ==========================================
    // TOAST NOTIFICATIONS
    // ==========================================
    const toast = (() => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        function show(title, subtitle, duration = 3000) {
            const t = document.createElement('div');
            t.className = 'toast';
            t.innerHTML = `
                <div class="toast-icon"><i class="fas fa-check"></i></div>
                <div class="toast-text">
                    <strong>${title}</strong>
                    <span>${subtitle}</span>
                </div>
            `;
            container.appendChild(t);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => t.classList.add('show'));
            });

            setTimeout(() => {
                t.classList.remove('show');
                setTimeout(() => t.remove(), 300);
            }, duration);
        }

        return { show };
    })();

    // ==========================================
    // CART SIDEBAR
    // ==========================================
    const cart = (() => {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        const closeBtn = document.getElementById('cartClose');
        const continueBtn = document.getElementById('cartContinue');
        const badge = document.getElementById('cartBadge');
        const sidebarCount = document.getElementById('cartSidebarCount');
        const body = document.getElementById('cartSidebarBody');
        const footer = document.getElementById('cartSidebarFooter');
        const totalEl = document.getElementById('cartTotal');
        const subtotalEl = document.getElementById('cartSubtotal');
        const openBtn = document.getElementById('cartBtn');

        let items = JSON.parse(localStorage.getItem('b10_cart')) || [];
        let appliedCoupon = null;

        const COUPONS = {
            'B10OFF10': { type: 'percent', value: 10, label: 'B10OFF10 (-10%)' },
            'B10OFF15': { type: 'percent', value: 15, label: 'B10OFF15 (-15%)' },
            'FRETEGRATIS': { type: 'freeShipping', value: 0, label: 'FRETEGRATIS (Frete Grátis)' },
            'PRIMEIRACOMPRA': { type: 'percent', value: 10, label: 'PRIMEIRACOMPRA (-10%)' }
        };

        function saveCart() {
            localStorage.setItem('b10_cart', JSON.stringify(items));
        }

        function open() {
            sidebar?.classList.add('open');
            overlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            sidebar?.classList.remove('open');
            overlay?.classList.remove('active');
            document.body.style.overflow = '';
        }

        function getSubtotal() {
            return items.reduce((sum, item) => {
                let val;
                if (typeof item.price === 'number') { val = item.price; }
                else { val = parseFloat(String(item.price).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()); }
                return sum + (isNaN(val) ? 0 : val) * (item.qty || 1);
            }, 0);
        }

        function updateUI() {
            const count = items.reduce((s, i) => s + (i.qty || 1), 0);
            if (badge) { badge.textContent = count; badge.classList.add('bump'); setTimeout(() => badge.classList.remove('bump'), 300); }
            if (sidebarCount) sidebarCount.textContent = `(${count})`;

            if (items.length === 0) {
                body.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Sua sacola está vazia</p>
                        <a href="#destaques" class="btn btn-primary" onclick="document.getElementById('cartSidebar').classList.remove('open');document.getElementById('cartOverlay').classList.remove('active');document.body.style.overflow=''">Continuar Comprando</a>
                    </div>`;
                if (footer) footer.style.display = 'none';
                return;
            }

            if (footer) footer.style.display = '';

            body.innerHTML = items.map((item, i) => {
                const unitPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace('R$','').replace(/\./g,'').replace(',','.').trim()) || 0;
                const fmtP = v => `R$ ${v.toFixed(2).replace('.',',')}`;
                return `
                <div class="cart-item">
                    <div class="cart-item-img"><img src="${item.img || item.image}" alt="${item.name}"></div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-meta"><span class="cart-item-size">Tam: ${item.size || 'M'}</span></div>
                        <div class="cart-item-qty-row">
                            <div class="cart-qty-ctrl">
                                <button class="cart-qty-btn" data-action="minus" data-index="${i}"><i class="fas fa-minus"></i></button>
                                <span class="cart-qty-num">${item.qty || 1}</span>
                                <button class="cart-qty-btn" data-action="plus" data-index="${i}"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="cart-item-price">${fmtP(unitPrice * (item.qty || 1))}</div>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-index="${i}"><i class="fas fa-trash-alt"></i></button>
                </div>`;
            }).join('');

            const subtotal = getSubtotal();
            let discount = 0;
            const discountRow = document.getElementById('cartDiscountRow');
            const discountValue = document.getElementById('cartDiscountValue');

            if (appliedCoupon && appliedCoupon.type === 'percent') {
                discount = subtotal * (appliedCoupon.value / 100);
                if (discountRow) discountRow.style.display = '';
                if (discountValue) discountValue.textContent = `- R$ ${discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            } else {
                if (discountRow) discountRow.style.display = 'none';
            }

            const total = subtotal - discount;
            const pixTotal = total * (1 - (shippingConfig.pixDiscount || 5) / 100);
            if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            if (totalEl) totalEl.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

            // PIX total line
            let pixRow = document.getElementById('cartPixRow');
            if (!pixRow) {
                const totalSection = document.querySelector('.cart-total-section');
                if (totalSection) {
                    const div = document.createElement('div');
                    div.id = 'cartPixRow';
                    div.className = 'cart-pix-total';
                    div.innerHTML = `<span><i class="fas fa-qrcode" style="color:var(--pix-green)"></i> PIX (${shippingConfig.pixDiscount || 5}% OFF):</span><strong id="cartPixTotal" style="color:var(--pix-green)">R$ 0,00</strong>`;
                    totalSection.appendChild(div);
                    pixRow = div;
                }
            }
            const pixTotalEl = document.getElementById('cartPixTotal');
            if (pixTotalEl) pixTotalEl.textContent = `R$ ${pixTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

            body.querySelectorAll('.cart-qty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.index);
                    if (btn.dataset.action === 'minus') {
                        if ((items[idx].qty || 1) > 1) items[idx].qty--;
                        else { items.splice(idx, 1); saveCart(); updateUI(); toast.show('Produto removido', 'Item retirado da sacola'); return; }
                    } else {
                        items[idx].qty = Math.min(10, (items[idx].qty || 1) + 1);
                    }
                    saveCart(); updateUI();
                });
            });

            body.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    items.splice(parseInt(btn.dataset.index), 1);
                    saveCart();
                    updateUI();
                    toast.show('Produto removido', 'Item retirado da sacola');
                });
            });

            updateWhatsAppLink();
        }

        function add(name, price, img, size) {
            // Normalize price to number
            let numPrice;
            if (typeof price === 'number') numPrice = price;
            else numPrice = parseFloat(String(price).replace('R$','').replace(/\./g,'').replace(',','.').trim()) || 0;

            // Check if same product+size already in cart
            const existing = items.find(item => item.name === name && item.size === (size || 'M'));
            if (existing) {
                existing.qty = Math.min(10, (existing.qty || 1) + 1);
            } else {
                items.push({ name, price: numPrice, img, size: size || 'M', qty: 1 });
            }
            saveCart();
            updateUI();
            open();
            toast.show('Adicionado à sacola!', name);
        }

        // Coupon functions (exposed globally)
        window.applyCartCoupon = function() {
            const input = document.getElementById('cartCouponCode');
            const code = input?.value?.trim().toUpperCase();
            if (!code) return;
            const coupon = COUPONS[code];
            if (coupon) {
                appliedCoupon = coupon;
                if (document.getElementById('cartCouponInput')) document.getElementById('cartCouponInput').style.display = 'none';
                if (document.getElementById('cartCouponApplied')) {
                    document.getElementById('cartCouponApplied').style.display = 'flex';
                    document.getElementById('cartCouponName').textContent = coupon.label;
                }
                updateUI();
                toast.show('Cupom aplicado! 🎉', coupon.label);
            } else {
                toast.show('Cupom inválido', 'Verifique o código e tente novamente');
            }
        };

        window.removeCartCoupon = function() {
            appliedCoupon = null;
            if (document.getElementById('cartCouponInput')) document.getElementById('cartCouponInput').style.display = 'flex';
            if (document.getElementById('cartCouponApplied')) document.getElementById('cartCouponApplied').style.display = 'none';
            const input = document.getElementById('cartCouponCode');
            if (input) input.value = '';
            updateUI();
        };

        function buildWhatsAppLink() {
            if (items.length === 0) return '#';
            const fmtBRL = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;
            const subtotal = getSubtotal();
            let discount = 0;
            if (appliedCoupon && appliedCoupon.type === 'percent') {
                discount = subtotal * (appliedCoupon.value / 100);
            }
            const total = subtotal - discount;
            const pixTotal = total * (1 - shippingConfig.pixDiscount / 100);

            let msg = `🛒 *PEDIDO B10 MANTOS*\n`;
            msg += `━━━━━━━━━━━━━━━━━━\n\n`;
            items.forEach((item, i) => {
                const unitVal = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace('R$','').replace(/\./g,'').replace(',','.').trim()) || 0;
                const qty = item.qty || 1;
                msg += `📦 *${i + 1}. ${item.name}*\n`;
                msg += `   📏 Tamanho: ${item.size || 'M'}\n`;
                msg += `   🔢 Quantidade: ${qty}\n`;
                msg += `   💰 Valor: ${fmtBRL(unitVal * qty)}\n\n`;
            });
            msg += `━━━━━━━━━━━━━━━━━━\n`;
            if (appliedCoupon) {
                msg += `🏷️ Cupom: ${appliedCoupon.label}\n`;
                msg += `💸 Desconto: -${fmtBRL(discount)}\n`;
            }
            msg += `💵 *Total: ${fmtBRL(total)}*\n`;
            msg += `💚 *Total no PIX (${shippingConfig.pixDiscount}% OFF): ${fmtBRL(pixTotal)}*\n\n`;
            msg += `━━━━━━━━━━━━━━━━━━\n`;
            msg += `Olá! Gostaria de finalizar este pedido. 😊\n`;
            msg += `Aguardo confirmação de disponibilidade e forma de pagamento.`;

            return `https://wa.me/${storeConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
        }

        function updateWhatsAppLink() {
            const link = document.getElementById('cartWhatsAppCheckout');
            if (link) link.href = buildWhatsAppLink();
        }

        openBtn?.addEventListener('click', (e) => { e.preventDefault(); open(); });
        closeBtn?.addEventListener('click', close);
        overlay?.addEventListener('click', close);

        // Initialize on load
        updateUI();
        updateWhatsAppLink();

        return { add, open, close };
    })();

    // ==========================================
    // ADD TO CART BUTTONS (event delegation for dynamic cards)
    // ==========================================
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;

        const card = btn.closest('.product-card');
        if (!card) return;

        const name = card.querySelector('.product-name a')?.textContent || 'Produto';
        const price = card.querySelector('.price-current')?.textContent || 'R$ 0,00';
        const img = card.querySelector('.product-image')?.src || '';
        const size = card.querySelector('.size-opt.active')?.textContent || 'M';

        // Button animation
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        btn.style.background = '#00c853';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 1500);

        cart.add(name, price, img, size);
    });

    // ==========================================
    // WISHLIST (event delegation for dynamic cards)
    // ==========================================
    (() => {
        const countEl = document.getElementById('wishlistCount');
        let count = 0;

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.wishlist-btn');
            if (!btn) return;

            const isActive = btn.classList.toggle('active');
            const icon = btn.querySelector('i');

            if (isActive) {
                icon.classList.replace('far', 'fas');
                count++;
                toast.show('Favoritado! ❤️', 'Produto adicionado aos favoritos');
            } else {
                icon.classList.replace('fas', 'far');
                count = Math.max(0, count - 1);
            }

            if (countEl) countEl.textContent = count;
        });
    })();

    // ==========================================
    // CATEGORY FILTER TABS
    // ==========================================
    (() => {
        const tabs = document.querySelectorAll('.tab-btn');
        const grid = document.getElementById('destaquesGrid');
        if (!grid) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;
                const cards = grid.querySelectorAll('.product-card');

                cards.forEach((card, i) => {
                    const category = card.dataset.category;
                    const show = filter === 'all' || category === filter;

                    card.style.transition = 'all 0.4s ease';
                    card.style.opacity = show ? '1' : '0';
                    card.style.transform = show ? 'scale(1)' : 'scale(0.8)';
                    card.style.pointerEvents = show ? '' : 'none';

                    if (show) {
                        card.style.transitionDelay = `${i * 0.05}s`;
                    } else {
                        card.style.transitionDelay = '0s';
                    }
                });
            });
        });
    })();

    // ==========================================
    // NEWSLETTER
    // ==========================================
    (() => {
        const form = document.getElementById('newsletterForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input?.value) {
                toast.show('Cadastro realizado! 🎉', 'Use o código B10OFF10 para 10% de desconto');
                input.value = '';
            }
        });
    })();

    // ==========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ==========================================
    (() => {
        const elements = document.querySelectorAll(
            '.product-card, .category-card, .benefit-item, .testimonial-card, .stat-item, .section-header'
        );

        elements.forEach(el => el.classList.add('animate-in'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, i * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(el => observer.observe(el));
    })();

    // ==========================================
    // COUNTER ANIMATION (Stats)
    // ==========================================
    (() => {
        const counters = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count) || 0;
                    const duration = 2000;
                    const start = performance.now();

                    function step(timestamp) {
                        const progress = Math.min((timestamp - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                        el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
                        if (progress < 1) requestAnimationFrame(step);
                    }

                    requestAnimationFrame(step);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    })();

    // ==========================================
    // QUICK VIEW MODAL
    // ==========================================
    (() => {
        const modal = document.getElementById('quickViewModal');
        if (!modal) return;

        const overlay = modal.querySelector('.qv-overlay');
        const closeBtn = modal.querySelector('.qv-close');
        const qvImage = document.getElementById('qvImage');
        const qvCategory = document.getElementById('qvCategory');
        const qvName = document.getElementById('qvName');
        const qvRating = document.getElementById('qvRating');
        const qvPrices = document.getElementById('qvPrices');

        function openModal(card) {
            const img = card.querySelector('.product-image')?.src || '';
            const name = card.querySelector('.product-name a')?.textContent || '';
            const category = card.querySelector('.product-category-link')?.textContent || '';
            const rating = card.querySelector('.product-rating')?.innerHTML || '';
            const prices = card.querySelector('.product-prices')?.innerHTML || '';
            const priceText = card.querySelector('.price-current')?.textContent || '';

            if (qvImage) { qvImage.src = img; qvImage.alt = name; }
            if (qvCategory) qvCategory.textContent = category;
            if (qvName) qvName.textContent = name;
            if (qvRating) qvRating.innerHTML = rating;
            if (qvPrices) qvPrices.innerHTML = prices;

            // Update WhatsApp link
            const qvWA = document.getElementById('qvWhatsApp');
            if (qvWA) {
                const size = modal.querySelector('.size-opt.active')?.textContent || 'M';
                let msg = `Olá! 😊 Tenho interesse em:\n\n`;
                msg += `⚽ *${name}*\n`;
                msg += `📏 Tamanho: *${size}*\n`;
                msg += `💰 Valor: ${priceText}\n\n`;
                msg += `Podem me ajudar a finalizar?`;
                qvWA.href = `https://wa.me/${storeConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.quick-view-btn');
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.product-card');
            if (card) openModal(card);
        });

        closeBtn?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // Size options
        modal.querySelectorAll('.size-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                modal.querySelectorAll('.size-opt').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');

                // Update WhatsApp link with new size
                const qvWA = document.getElementById('qvWhatsApp');
                const name = qvName?.textContent || '';
                const priceText = qvPrices?.querySelector('.price-current')?.textContent || '';
                if (qvWA && name) {
                    let msg = `Olá! 😊 Tenho interesse em:\n\n`;
                    msg += `⚽ *${name}*\n`;
                    msg += `📏 Tamanho: *${opt.textContent}*\n`;
                    msg += `💰 Valor: ${priceText}\n\n`;
                    msg += `Podem me ajudar a finalizar?`;
                    qvWA.href = `https://wa.me/${storeConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
                }
            });
        });

        // QV Add to cart
        const qvAddCart = modal.querySelector('.qv-add-cart');
        qvAddCart?.addEventListener('click', () => {
            const name = qvName?.textContent || 'Produto';
            const priceEl = qvPrices?.querySelector('.price-current');
            const price = priceEl?.textContent || 'R$ 0,00';
            const img = qvImage?.src || '';
            const size = modal.querySelector('.size-opt.active')?.textContent || 'M';

            cart.add(name, price, img, size);
            closeModal();
        });
    })();

    // ==========================================
    // IMAGE LAZY LOADING (Native + Fallback)
    // ==========================================
    (() => {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('loading' in HTMLImageElement.prototype) return; // Native support

        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imgObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imgObserver.observe(img));
    })();

    // ==========================================
    // SMOOTH ANCHOR SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = document.getElementById('header')?.offsetHeight || 80;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // KEYBOARD NAVIGATION (ESC key)
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close cart sidebar
            document.getElementById('cartSidebar')?.classList.remove('open');
            document.getElementById('cartOverlay')?.classList.remove('active');
            // Close mobile nav
            document.getElementById('mainNav')?.classList.remove('open');
            document.getElementById('mobileOverlay')?.classList.remove('active');
            document.getElementById('mobileHamburger')?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    console.log('🏆 B10 Mantos - Site carregado com sucesso!');
});
