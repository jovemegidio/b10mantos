/* ========================================
   B10 MANTOS - CHECKOUT JS (WhatsApp)
   Fluxo: Revisão → Cadastro → Endereço → WhatsApp
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Load admin settings
    const siteSettings = (() => {
        try {
            const data = localStorage.getItem('b10_settings');
            return data ? JSON.parse(data) : {};
        } catch { return {}; }
    })();

    const waNumber = (siteSettings.store?.whatsapp || '5511954555972').replace(/\D/g, '');
    const pixDiscount = siteSettings.shipping?.pixDiscount ?? 5;

    const fmt = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;
    let cartItems = JSON.parse(localStorage.getItem('b10_cart') || '[]');
    let couponCode = '';
    let currentStep = 1;
    let loggedCustomer = JSON.parse(localStorage.getItem('b10_loggedCustomer') || 'null');

    const COUPONS = {
        'B10OFF10': { type: 'percent', value: 10, label: '10% OFF' },
        'B10OFF15': { type: 'percent', value: 15, label: '15% OFF' },
        'FRETEGRATIS': { type: 'freeShipping', value: 0, label: 'Frete Grátis' },
        'PRIMEIRACOMPRA': { type: 'percent', value: 10, label: '10% primeira compra' }
    };

    // ── Parse price string → number ──
    function parsePrice(str) {
        if (typeof str === 'number') return str;
        const n = parseFloat(String(str).replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        return isNaN(n) ? 0 : n;
    }

    // ── Redirect if empty cart ──
    if (cartItems.length === 0) {
        const formsEl = document.querySelector('.checkout-forms');
        const summaryEl = document.getElementById('checkoutSummary');
        if (formsEl) formsEl.innerHTML = `
            <div style="text-align:center;padding:80px 0">
                <i class="fas fa-shopping-bag" style="font-size:56px;color:#cbd5e1;margin-bottom:20px;display:block"></i>
                <h2 style="margin-bottom:8px;">Sua sacola está vazia</h2>
                <p style="color:#64748b;margin:10px 0 24px">Adicione produtos antes de finalizar.</p>
                <a href="index.html" class="btn btn-primary btn-lg" style="display:inline-flex;align-items:center;gap:8px;"><i class="fas fa-store"></i> Ir para a Loja</a>
            </div>`;
        if (summaryEl) summaryEl.style.display = 'none';
        return;
    }

    // ── Update PIX labels with dynamic discount ──
    const pixLbl = document.getElementById('sumPixLabel');
    if (pixLbl) pixLbl.textContent = `Total no PIX (${pixDiscount}% OFF)`;
    const pixBanner = document.getElementById('sumPixBanner');
    if (pixBanner) pixBanner.innerHTML = `<i class="fab fa-pix"></i> Ganhe ${pixDiscount}% de desconto pagando via PIX`;

    // ── Render cart items in Step 1 ──
    function renderCartReview() {
        const container = document.getElementById('ckCartItems');
        if (!container) return;
        container.innerHTML = cartItems.map((item, i) => {
            const unitPrice = parsePrice(item.price);
            const priceDisplay = fmt(unitPrice * (item.qty || 1));
            return `
            <div class="ck-cart-item" data-index="${i}">
                <div class="ck-cart-img"><img src="${item.img || item.image}" alt="${item.name}"></div>
                <div class="ck-cart-info">
                    <h4>${item.name}</h4>
                    <div class="ck-cart-meta">
                        <span class="ck-size"><i class="fas fa-ruler"></i> Tamanho: <strong>${item.size || 'M'}</strong></span>
                        <span class="ck-qty-ctrl">
                            <button type="button" class="qty-minus" data-i="${i}"><i class="fas fa-minus"></i></button>
                            <span class="ck-qty-num">${item.qty || 1}</span>
                            <button type="button" class="qty-plus" data-i="${i}"><i class="fas fa-plus"></i></button>
                        </span>
                    </div>
                    <div class="ck-cart-price">${priceDisplay}</div>
                </div>
                <button type="button" class="ck-cart-remove" data-i="${i}" title="Remover"><i class="fas fa-trash-alt"></i></button>
            </div>`;
        }).join('');

        // Quantity controls
        container.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.i);
                if ((cartItems[idx].qty || 1) > 1) { cartItems[idx].qty--; } else { cartItems.splice(idx, 1); }
                saveAndRefresh();
            });
        });
        container.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.i);
                cartItems[idx].qty = (cartItems[idx].qty || 1) + 1;
                saveAndRefresh();
            });
        });
        container.querySelectorAll('.ck-cart-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                cartItems.splice(parseInt(btn.dataset.i), 1);
                saveAndRefresh();
            });
        });
    }

    // ── Render summary sidebar items ──
    function renderSummary() {
        const container = document.getElementById('summaryItems');
        if (!container) return;
        container.innerHTML = cartItems.map(item => {
            const unitPrice = parsePrice(item.price);
            return `
            <div class="summary-item">
                <img src="${item.img || item.image}" alt="${item.name}">
                <div class="summary-item-info">
                    <strong>${item.name}</strong>
                    <span>Tam: ${item.size || 'M'} • Qtd: ${item.qty || 1}</span>
                </div>
                <span class="summary-item-price">${fmt(unitPrice * (item.qty || 1))}</span>
            </div>`;
        }).join('');
    }

    // ── Update totals ──
    function updateTotals() {
        const subtotal = cartItems.reduce((s, item) => s + parsePrice(item.price) * (item.qty || 1), 0);
        let discount = 0;

        if (couponCode && COUPONS[couponCode]) {
            const c = COUPONS[couponCode];
            if (c.type === 'percent') discount = subtotal * (c.value / 100);
        }

        const total = subtotal - discount;
        const pixTotal = total * (1 - pixDiscount / 100);

        const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
        setTxt('sumSubtotal', fmt(subtotal));
        setTxt('sumTotal', fmt(total));
        setTxt('sumPixTotal', fmt(pixTotal));

        if (discount > 0) {
            const dr = document.getElementById('sumDiscountRow');
            if (dr) dr.style.display = 'flex';
            setTxt('sumDiscount', `- ${fmt(discount)}`);
        } else {
            const dr = document.getElementById('sumDiscountRow');
            if (dr) dr.style.display = 'none';
        }
    }

    function saveAndRefresh() {
        localStorage.setItem('b10_cart', JSON.stringify(cartItems));
        if (cartItems.length === 0) { location.reload(); return; }
        renderCartReview();
        renderSummary();
        updateTotals();
    }

    // ── Step Navigation ──
    function goToStep(step) {
        currentStep = step;
        document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
        document.getElementById(`checkStep${step}`)?.classList.add('active');
        document.querySelectorAll('.step-ind').forEach(s => {
            const n = parseInt(s.dataset.step);
            s.classList.toggle('active', n <= step);
            s.classList.toggle('completed', n < step);
        });
        // Show customer badge in step 3
        if (step === 3 && loggedCustomer) {
            const badge = document.getElementById('loggedCustomerBadge');
            if (badge) {
                badge.style.display = 'flex';
                document.getElementById('badgeName').textContent = loggedCustomer.name;
                document.getElementById('badgeEmail').textContent = loggedCustomer.email;
            }
            // Pre-fill address from last order if available
            if (loggedCustomer.lastAddress) {
                const la = loggedCustomer.lastAddress;
                if (la.cep) document.getElementById('ckCEP').value = la.cep;
                if (la.city) document.getElementById('ckCity').value = la.city;
                if (la.state) document.getElementById('ckState').value = la.state;
                if (la.neighbor) document.getElementById('ckNeighbor').value = la.neighbor;
                if (la.address) document.getElementById('ckAddress').value = la.address;
                if (la.number) document.getElementById('ckNumber').value = la.number;
                if (la.comp) document.getElementById('ckComp').value = la.comp;
            }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Step 1 → 2
    document.getElementById('goToStep2Btn')?.addEventListener('click', () => {
        goToStep(2);
        // If already logged in, show "welcome back"
        if (loggedCustomer) {
            document.getElementById('authTabs').style.display = 'none';
            document.getElementById('authRegister').classList.remove('active');
            document.getElementById('authLogin').classList.remove('active');
            const loggedPanel = document.getElementById('authLoggedIn');
            loggedPanel.style.display = 'block';
            document.getElementById('welcomeBackName').textContent = `Olá, ${loggedCustomer.name}! 👋`;
            document.getElementById('welcomeBackEmail').textContent = loggedCustomer.email;
        }
    });

    // Back buttons
    document.getElementById('backToStep1from2')?.addEventListener('click', () => goToStep(1));
    document.getElementById('backToStep1from2b')?.addEventListener('click', () => goToStep(1));
    document.getElementById('backToStep2')?.addEventListener('click', () => goToStep(2));

    // Auth tabs toggle
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById('authRegister').classList.toggle('active', target === 'register');
            document.getElementById('authLogin').classList.toggle('active', target === 'login');
        });
    });

    // ── Customer Accounts (localStorage) ──
    function getAccounts() {
        try { return JSON.parse(localStorage.getItem('b10_accounts') || '[]'); }
        catch { return []; }
    }
    function saveAccounts(accounts) {
        localStorage.setItem('b10_accounts', JSON.stringify(accounts));
    }

    // REGISTER
    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName')?.value.trim();
        const phone = document.getElementById('regPhone')?.value.trim();
        const email = document.getElementById('regEmail')?.value.trim();
        const cpf = document.getElementById('regCPF')?.value.trim();
        const birth = document.getElementById('regBirth')?.value;
        const pass = document.getElementById('regPass')?.value;
        const passConfirm = document.getElementById('regPassConfirm')?.value;
        const errEl = document.getElementById('regError');
        const errSpan = errEl?.querySelector('span');

        if (!name || !phone || !email || !pass) {
            errSpan.textContent = 'Preencha todos os campos obrigatórios (*)';
            errEl.style.display = 'flex'; return;
        }
        if (pass.length < 4) {
            errSpan.textContent = 'Senha deve ter pelo menos 4 caracteres';
            errEl.style.display = 'flex'; return;
        }
        if (pass !== passConfirm) {
            errSpan.textContent = 'As senhas não coincidem';
            errEl.style.display = 'flex'; return;
        }

        const accounts = getAccounts();
        if (accounts.find(a => a.email === email)) {
            errSpan.textContent = 'Esse e-mail já está cadastrado. Faça login.';
            errEl.style.display = 'flex'; return;
        }

        errEl.style.display = 'none';

        const newAccount = {
            id: Date.now(),
            name, phone, email, cpf, birth, pass,
            createdAt: new Date().toISOString(),
            orders: 0, total: 0
        };
        accounts.push(newAccount);
        saveAccounts(accounts);

        // Also save to admin customers
        let adminCustomers = JSON.parse(localStorage.getItem('b10_customers') || '[]');
        adminCustomers.push({
            name, email, phone,
            cpf, birth,
            orders: 0, total: 0,
            lastOrder: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('b10_customers', JSON.stringify(adminCustomers));

        // Login the customer
        loggedCustomer = { name, phone, email, cpf };
        localStorage.setItem('b10_loggedCustomer', JSON.stringify(loggedCustomer));

        goToStep(3);
    });

    // LOGIN
    document.getElementById('loginFormCK')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginId = document.getElementById('loginId')?.value.trim();
        const loginPass = document.getElementById('loginPassCK')?.value;
        const errEl = document.getElementById('loginErrorCK');
        const errSpan = errEl?.querySelector('span');

        if (!loginId || !loginPass) {
            errSpan.textContent = 'Preencha e-mail/WhatsApp e senha';
            errEl.style.display = 'flex'; return;
        }

        const accounts = getAccounts();
        const found = accounts.find(a =>
            (a.email === loginId || a.phone === loginId) && a.pass === loginPass
        );

        if (!found) {
            errSpan.textContent = 'E-mail/WhatsApp ou senha incorretos';
            errEl.style.display = 'flex'; return;
        }

        errEl.style.display = 'none';
        loggedCustomer = { name: found.name, phone: found.phone, email: found.email, cpf: found.cpf, lastAddress: found.lastAddress };
        localStorage.setItem('b10_loggedCustomer', JSON.stringify(loggedCustomer));

        goToStep(3);
    });

    // Continue as logged in user
    document.getElementById('continueLoggedIn')?.addEventListener('click', () => goToStep(3));

    // Logout
    document.getElementById('logoutCKBtn')?.addEventListener('click', () => {
        loggedCustomer = null;
        localStorage.removeItem('b10_loggedCustomer');
        document.getElementById('authTabs').style.display = '';
        document.getElementById('authLoggedIn').style.display = 'none';
        document.getElementById('authRegister').classList.add('active');
        document.querySelector('.auth-tab[data-tab="register"]')?.classList.add('active');
        document.querySelector('.auth-tab[data-tab="login"]')?.classList.remove('active');
    });

    // ── Form submit → Build WhatsApp & go to Step 4 ──
    document.getElementById('customerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Customer data from registration/login
        const name = loggedCustomer?.name || 'Cliente';
        const phone = loggedCustomer?.phone || '';
        const email = loggedCustomer?.email || '';

        // Address from form
        const cep = document.getElementById('ckCEP')?.value.trim();
        const city = document.getElementById('ckCity')?.value.trim();
        const state = document.getElementById('ckState')?.value.trim();
        const neighbor = document.getElementById('ckNeighbor')?.value.trim();
        const address = document.getElementById('ckAddress')?.value.trim();
        const number = document.getElementById('ckNumber')?.value.trim();
        const comp = document.getElementById('ckComp')?.value.trim();

        if (!cep || !city || !state || !neighbor || !address || !number) {
            const errEl = document.getElementById('formError');
            if (errEl) errEl.style.display = 'flex';
            return;
        }

        const errEl = document.getElementById('formError');
        if (errEl) errEl.style.display = 'none';

        // Compute totals
        const subtotal = cartItems.reduce((s, item) => s + parsePrice(item.price) * (item.qty || 1), 0);
        let discount = 0;
        if (couponCode && COUPONS[couponCode] && COUPONS[couponCode].type === 'percent') {
            discount = subtotal * (COUPONS[couponCode].value / 100);
        }
        const total = subtotal - discount;
        const pixTotal = total * (1 - pixDiscount / 100);

        // Build WhatsApp message
        let msg = `🛒 *PEDIDO B10 MANTOS*\n`;
        msg += `━━━━━━━━━━━━━━━━━━\n\n`;

        cartItems.forEach((item, i) => {
            const unitPrice = parsePrice(item.price);
            const qty = item.qty || 1;
            msg += `📦 *${i + 1}. ${item.name}*\n`;
            msg += `   📏 Tamanho: ${item.size || 'M'}\n`;
            msg += `   🔢 Quantidade: ${qty}\n`;
            msg += `   💰 Valor: ${fmt(unitPrice * qty)}\n\n`;
        });

        msg += `━━━━━━━━━━━━━━━━━━\n`;
        if (couponCode) {
            msg += `🏷️ Cupom: ${couponCode} (${COUPONS[couponCode].label})\n`;
            msg += `💸 Desconto: -${fmt(discount)}\n`;
        }
        msg += `💵 *Subtotal: ${fmt(subtotal)}*\n`;
        if (discount > 0) msg += `✅ *Total com desconto: ${fmt(total)}*\n`;
        msg += `💚 *Total no PIX (${pixDiscount}% OFF): ${fmt(pixTotal)}*\n\n`;

        msg += `━━━━━━━━━━━━━━━━━━\n`;
        msg += `👤 *DADOS DO CLIENTE*\n`;
        msg += `━━━━━━━━━━━━━━━━━━\n`;
        msg += `📝 Nome: ${name}\n`;
        msg += `📱 WhatsApp: ${phone}\n`;
        if (email) msg += `📧 E-mail: ${email}\n`;
        msg += `\n`;

        msg += `📍 *ENDEREÇO DE ENTREGA*\n`;
        msg += `━━━━━━━━━━━━━━━━━━\n`;
        msg += `${address}, ${number}`;
        if (comp) msg += ` - ${comp}`;
        msg += `\n`;
        msg += `${neighbor} - ${city}/${state}\n`;
        msg += `CEP: ${cep}\n\n`;

        msg += `Olá! Gostaria de finalizar este pedido. 😊\n`;
        msg += `Qual a forma de pagamento disponível?`;

        const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

        // Set final WhatsApp button
        const finalBtn = document.getElementById('finalWhatsAppBtn');
        if (finalBtn) finalBtn.href = waLink;

        // Build order review box
        const reviewBox = document.getElementById('orderReviewBox');
        if (reviewBox) {
            reviewBox.innerHTML = `
                <div class="confirm-detail-item">
                    <i class="fas fa-user"></i>
                    <div><strong>${name}</strong><span>${phone}</span></div>
                </div>
                <div class="confirm-detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div><strong>${address}, ${number}${comp ? ' - ' + comp : ''}</strong><span>${neighbor} - ${city}/${state} • CEP: ${cep}</span></div>
                </div>
                <div class="confirm-detail-item">
                    <i class="fas fa-shopping-bag"></i>
                    <div><strong>${cartItems.length} ${cartItems.length === 1 ? 'produto' : 'produtos'}</strong><span>Total: ${fmt(total)} • PIX: ${fmt(pixTotal)}</span></div>
                </div>
            `;
        }

        // Save order to localStorage for admin panel
        const orderId = 'B10-' + String(Math.floor(Math.random() * 9000) + 1000);
        let orders = JSON.parse(localStorage.getItem('b10_orders') || '[]');
        const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        cartItems.forEach(item => {
            orders.push({
                id: orderId, customer: name, initials,
                product: item.name, value: parsePrice(item.price) * (item.qty || 1),
                status: 'pending', date: new Date().toISOString().split('T')[0]
            });
        });
        localStorage.setItem('b10_orders', JSON.stringify(orders));
        localStorage.setItem('b10_last_order', JSON.stringify({
            id: orderId, date: new Date().toISOString(),
            items: cartItems, status: 'pending',
            customer: { name, phone, email, address: `${address}, ${number}`, city, state, cep }
        }));

        // Clear cart
        localStorage.removeItem('b10_cart');

        // Save address to customer account for next time
        if (loggedCustomer) {
            loggedCustomer.lastAddress = { cep, city, state, neighbor, address, number, comp };
            localStorage.setItem('b10_loggedCustomer', JSON.stringify(loggedCustomer));
            // Also update in accounts DB
            const accounts = getAccounts();
            const acc = accounts.find(a => a.email === loggedCustomer.email);
            if (acc) {
                acc.lastAddress = loggedCustomer.lastAddress;
                acc.orders = (acc.orders || 0) + 1;
                saveAccounts(accounts);
            }
        }

        goToStep(4);
    });

    // ── Coupon ──
    document.getElementById('ckCouponApply')?.addEventListener('click', () => {
        const input = document.getElementById('ckCouponInput');
        const code = input?.value.trim().toUpperCase();
        if (!code) return;
        if (COUPONS[code]) {
            couponCode = code;
            const wrap = document.getElementById('ckCouponWrap');
            if (wrap) wrap.style.display = 'none';
            const applied = document.getElementById('ckCouponApplied');
            if (applied) { applied.style.display = 'flex'; }
            const txt = document.getElementById('ckCouponText');
            if (txt) txt.textContent = `${code} — ${COUPONS[code].label}`;
            updateTotals();
        } else {
            input.style.borderColor = '#ef4444';
            input.focus();
            setTimeout(() => { input.style.borderColor = ''; }, 2000);
        }
    });

    document.getElementById('ckCouponRemove')?.addEventListener('click', () => {
        couponCode = '';
        const wrap = document.getElementById('ckCouponWrap');
        if (wrap) wrap.style.display = 'flex';
        const applied = document.getElementById('ckCouponApplied');
        if (applied) applied.style.display = 'none';
        const input = document.getElementById('ckCouponInput');
        if (input) input.value = '';
        updateTotals();
    });

    // Enter key in coupon input
    document.getElementById('ckCouponInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); document.getElementById('ckCouponApply')?.click(); }
    });

    // ── Input Masks ──
    // Phone mask helper
    function phoneMask(el) {
        if (!el) return;
        el.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 11) v = v.substring(0, 11);
            if (v.length > 6) v = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
            else if (v.length > 2) v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
            this.value = v;
        });
    }
    phoneMask(document.getElementById('ckPhone'));
    phoneMask(document.getElementById('regPhone'));

    // CPF mask
    document.getElementById('regCPF')?.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        if (v.length > 9) v = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6, 9)}-${v.substring(9)}`;
        else if (v.length > 6) v = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6)}`;
        else if (v.length > 3) v = `${v.substring(0, 3)}.${v.substring(3)}`;
        this.value = v;
    });

    // CEP mask
    document.getElementById('ckCEP')?.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '');
        if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5, 8);
        this.value = v;
    });

    // ── Auto-fill address from CEP (ViaCEP) ──
    document.getElementById('ckCEP')?.addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(r => r.json())
            .then(data => {
                if (data.erro) return;
                if (data.logradouro) document.getElementById('ckAddress').value = data.logradouro;
                if (data.bairro) document.getElementById('ckNeighbor').value = data.bairro;
                if (data.localidade) document.getElementById('ckCity').value = data.localidade;
                if (data.uf) document.getElementById('ckState').value = data.uf;
            })
            .catch(() => {});
    });

    // ── Init ──
    renderCartReview();
    renderSummary();
    updateTotals();
});
