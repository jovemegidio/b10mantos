/* ========================================
   B10 MANTOS - PRODUCT DETAIL PAGE JS
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

    const pixDiscount = siteSettings.shipping?.pixDiscount ?? 5;
    const maxInstallments = siteSettings.shipping?.maxInstallments ?? 2;
    const waNumber = (siteSettings.store?.whatsapp || '5511954555972').replace(/\D/g, '');

    // Products database (same as admin)
    const PRODUCTS = JSON.parse(localStorage.getItem('b10_products')) || [
        { id: 1, name: 'Arsenal FC 2024/2025', category: 'Clubes Europeus', price: 138.70, originalPrice: 158.80, image: 'https://cdn.offstoreimages.me/compressed/d826d0d5154eb8aa21be0e1d2c1a58de.webp', status: 'active', sales: 24 },
        { id: 2, name: 'Inter de Milão 2024/2025', category: 'Clubes Europeus', price: 159.80, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/2ee05aa1c0cf71ac3ad55ee855121ee4.webp', status: 'active', sales: 18 },
        { id: 3, name: 'Liverpool FC 2025/2026', category: 'Clubes Europeus', price: 138.70, originalPrice: 159.80, image: 'https://cdn.offstoreimages.me/compressed/52b04e3691d3baa1e6a018668aeba9b3.webp', status: 'active', sales: 31 },
        { id: 4, name: 'Arsenal 2023/2024', category: 'Clubes Europeus', price: 159.80, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/460dbbff0abe2ad4020af59e2c6fc0e5.webp', status: 'active', sales: 22 },
        { id: 5, name: 'Chelsea FC Total 90 (T90)', category: 'Clubes Europeus', price: 159.80, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/615eb85002d84b375506011e607e4fa7.webp', status: 'active', sales: 27 },
        { id: 6, name: 'Seleção Brasileira 2004', category: 'Seleções', price: 198.70, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/5645acdbf278a6c4580c36788b729a0e.webp', status: 'active', sales: 45 },
        { id: 7, name: 'Juventus 2024/2025', category: 'Clubes Europeus', price: 139.80, originalPrice: 159.80, image: 'https://cdn.offstoreimages.me/compressed/328506c96ac799cc4b2a6d0081883454.webp', status: 'active', sales: 17 },
        { id: 8, name: 'Portugal Seleção', category: 'Seleções', price: 168.70, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/4fe275c773e4982829ee870243222b30.webp', status: 'active', sales: 19 },
        { id: 9, name: 'México Seleção', category: 'Seleções', price: 168.70, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/f5f398930df3847d5017cf80ddb23c4a.webp', status: 'active', sales: 14 },
        { id: 10, name: 'México Seleção Away', category: 'Seleções', price: 168.70, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/2bc54bb3b8ceb9d2f3de33a7c305db5f.webp', status: 'active', sales: 16 },
        { id: 11, name: 'Tottenham Hotspur', category: 'Clubes Europeus', price: 159.80, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/56bae4931fa3c56494ee2702b5d12a82.webp', status: 'active', sales: 12 },
        { id: 12, name: 'Itália Seleção', category: 'Seleções', price: 159.80, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/7363172c8f5f13b9e54eb2ea61fac015.webp', status: 'active', sales: 29 },
        { id: 13, name: 'Portugal Seleção Away', category: 'Seleções', price: 159.80, originalPrice: 179.80, image: 'https://cdn.offstoreimages.me/compressed/29d9425563a0d980eb463532433ef026.webp', status: 'active', sales: 26 },
        { id: 14, name: 'Itália Seleção Away', category: 'Seleções', price: 159.80, originalPrice: 0, image: 'https://cdn.offstoreimages.me/compressed/42a343b967f65bbd9f8d87769e2071d8.webp', status: 'active', sales: 21 }
    ];

    const REVIEWS = JSON.parse(localStorage.getItem('b10_reviews')) || [
        { id: 1, author: 'Rafael C.', location: 'São Paulo, SP', initials: 'RC', stars: 5, text: 'Qualidade absurda! Não consegui diferenciar da original.', product: 'Arsenal FC 2024/2025', date: '2026-02-06' },
        { id: 2, author: 'Mariana S.', location: 'Rio de Janeiro, RJ', initials: 'MS', stars: 5, text: 'Entrega rápida e o atendimento foi sensacional.', product: 'Liverpool FC 2025/2026', date: '2026-02-04' },
        { id: 3, author: 'Lucas P.', location: 'Belo Horizonte, MG', initials: 'LP', stars: 5, text: 'Melhor custo-benefício. Qualidade 1:1 de verdade.', product: 'Seleção Brasileira 2004', date: '2026-02-02' }
    ];

    // Get product from URL
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) {
        document.querySelector('.pdp-section').innerHTML = '<div class="container" style="padding:80px 0;text-align:center"><h2>Produto não encontrado</h2><p>O produto que você procura não existe ou foi removido.</p><a href="todos-produtos.html" class="btn btn-primary" style="margin-top:20px">Ver Todos os Produtos</a></div>';
        return;
    }

    let selectedSize = 'M';
    let quantity = 1;

    // Fill page
    document.title = `${product.name} | B10 Mantos`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${product.name} - Camisa tailandesa 1:1 premium. R$ ${product.price.toFixed(2).replace('.', ',')}. Compre na B10 Mantos.`);

    const fmt = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;
    const pdpName = document.getElementById('pdpName');
    const pdpCategory = document.getElementById('pdpCategory');
    const pdpMainImage = document.getElementById('pdpMainImage');
    const pdpPriceCurrent = document.getElementById('pdpPriceCurrent');
    const pdpPriceOld = document.getElementById('pdpPriceOld');
    const pdpDiscount = document.getElementById('pdpDiscount');
    const pdpPixPrice = document.getElementById('pdpPixPrice');
    const pdpInstallment = document.getElementById('pdpInstallment');
    const pdpBadge = document.getElementById('pdpBadge');
    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

    pdpName.textContent = product.name;
    pdpCategory.textContent = product.category;
    pdpMainImage.src = product.image;
    pdpMainImage.alt = product.name;
    breadcrumbCurrent.textContent = product.name;

    pdpPriceCurrent.textContent = fmt(product.price);
    pdpPixPrice.textContent = fmt(product.price * (1 - pixDiscount / 100));
    pdpInstallment.textContent = `${maxInstallments}x de ${fmt(product.price / maxInstallments)}`;

    if (product.originalPrice > 0) {
        pdpPriceOld.textContent = fmt(product.originalPrice);
        pdpPriceOld.style.display = '';
        const disc = Math.round((1 - product.price / product.originalPrice) * 100);
        pdpDiscount.textContent = `-${disc}%`;
        pdpDiscount.style.display = '';
        pdpBadge.textContent = `-${disc}%`;
        pdpBadge.className = 'pdp-badge sale';
    } else {
        pdpPriceOld.style.display = 'none';
        pdpDiscount.style.display = 'none';
        pdpBadge.textContent = 'Novo';
        pdpBadge.className = 'pdp-badge new';
    }

    // Thumbs
    const thumbs = document.getElementById('pdpThumbs');
    thumbs.innerHTML = `
        <div class="pdp-thumb active"><img src="${product.image}" alt="Frente"></div>
        <div class="pdp-thumb"><img src="${product.image}" alt="Costas" style="transform:scaleX(-1)"></div>
        <div class="pdp-thumb"><img src="${product.image}" alt="Detalhe" style="filter:brightness(1.1)"></div>
    `;
    thumbs.querySelectorAll('.pdp-thumb').forEach(t => {
        t.addEventListener('click', () => {
            thumbs.querySelectorAll('.pdp-thumb').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            pdpMainImage.src = t.querySelector('img').src;
        });
    });

    // Size selector
    document.querySelectorAll('.pdp-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pdp-size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
            updateWhatsAppLink();
        });
    });

    // Quantity
    const qtyInput = document.getElementById('pdpQty');
    document.getElementById('qtyMinus')?.addEventListener('click', () => {
        quantity = Math.max(1, quantity - 1);
        qtyInput.value = quantity;
        updateWhatsAppLink();
    });
    document.getElementById('qtyPlus')?.addEventListener('click', () => {
        quantity = Math.min(10, quantity + 1);
        qtyInput.value = quantity;
        updateWhatsAppLink();
    });

    // Shipping calculator
    const cepInput = document.getElementById('cepInput');
    cepInput?.addEventListener('input', () => {
        let v = cepInput.value.replace(/\D/g, '');
        if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5, 8);
        cepInput.value = v;
        updateWhatsAppLink();
    });

    document.getElementById('calcShipping')?.addEventListener('click', () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length < 8) { alert('CEP inválido'); return; }

        const result = document.getElementById('shippingResult');
        result.style.display = 'block';

        // Simulate shipping based on region
        const region = parseInt(cep.charAt(0));
        const basePac = 19.90 + (region > 3 ? 10 : 0);
        const baseSedex = 34.90 + (region > 3 ? 15 : 0);

        document.getElementById('shippingPac').textContent = fmt(basePac);
        document.getElementById('shippingSedex').textContent = fmt(baseSedex);

        if (product.price * quantity >= 299.90) {
            document.getElementById('shippingFree').style.display = 'flex';
        }
    });

    // Add to cart
    document.getElementById('pdpAddCart')?.addEventListener('click', () => {
        let cartItems = JSON.parse(localStorage.getItem('b10_cart') || '[]');

        // Check if same product+size already in cart
        const existing = cartItems.find(item => item.id === product.id && item.size === selectedSize);
        if (existing) {
            existing.qty = Math.min(10, existing.qty + quantity);
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.image,
                image: product.image,
                size: selectedSize,
                qty: quantity
            });
        }

        localStorage.setItem('b10_cart', JSON.stringify(cartItems));

        // Update badge
        const badge = document.getElementById('cartBadge');
        if (badge) badge.textContent = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

        // Feedback
        const btn = document.getElementById('pdpAddCart');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        btn.style.background = '#10b981';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
    });

    // WhatsApp link (dynamic - updates with size & quantity)
    function updateWhatsAppLink() {
        const whatsBtn = document.getElementById('pdpWhatsApp');
        if (!whatsBtn) return;
        const cepVal = document.getElementById('cepInput')?.value || '';
        let msg = `Olá! 😊 Tenho interesse em:\n\n`;
        msg += `⚽ *${product.name}*\n`;
        msg += `📏 Tamanho: *${selectedSize}*\n`;
        msg += `🔢 Quantidade: *${quantity}*\n`;
        msg += `💰 Valor unitário: ${fmt(product.price)}\n`;
        if (quantity > 1) msg += `💵 Total: ${fmt(product.price * quantity)}\n`;
        msg += `💚 Total no PIX (${pixDiscount}% OFF): ${fmt(product.price * quantity * (1 - pixDiscount / 100))}\n`;
        if (cepVal.replace(/\D/g, '').length >= 5) msg += `📍 CEP: ${cepVal}\n`;
        msg += `\nPodem me ajudar a finalizar?`;
        whatsBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    }
    updateWhatsAppLink();

    // Zoom
    document.getElementById('pdpZoom')?.addEventListener('click', () => {
        const modal = document.getElementById('zoomModal');
        document.getElementById('zoomImage').src = pdpMainImage.src;
        modal.classList.add('active');
    });
    document.getElementById('zoomClose')?.addEventListener('click', () => document.getElementById('zoomModal').classList.remove('active'));
    document.getElementById('zoomOverlay')?.addEventListener('click', () => document.getElementById('zoomModal').classList.remove('active'));

    // Tabs
    document.querySelectorAll('.pdp-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pdp-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.pdp-tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
        });
    });

    // Reviews for this product
    const productReviews = REVIEWS.filter(r => r.product === product.name);
    const tabCount = document.getElementById('tabReviewCount');
    if (tabCount) tabCount.textContent = productReviews.length;

    const reviewAvg = document.getElementById('reviewAvg');
    const reviewTotal = document.getElementById('reviewTotalText');
    if (productReviews.length > 0) {
        const avg = (productReviews.reduce((s, r) => s + r.stars, 0) / productReviews.length).toFixed(1);
        if (reviewAvg) reviewAvg.textContent = avg;
        if (reviewTotal) reviewTotal.textContent = `${productReviews.length} avaliação(ões)`;
    }

    const reviewsList = document.getElementById('pdpReviewsList');
    if (reviewsList) {
        if (productReviews.length === 0) {
            reviewsList.innerHTML = '<p class="no-reviews">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>';
        } else {
            reviewsList.innerHTML = productReviews.map(r => `
                <div class="pdp-review-item">
                    <div class="review-item-header">
                        <div class="review-item-avatar">${r.initials}</div>
                        <div>
                            <strong>${r.author}</strong>
                            <span>${r.location} • ${new Date(r.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <span class="verified-badge"><i class="fas fa-check-circle"></i> Verificado</span>
                    </div>
                    <div class="review-item-stars">${'<i class="fas fa-star"></i>'.repeat(Math.floor(r.stars))}${r.stars % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}</div>
                    <p>${r.text}</p>
                </div>
            `).join('');
        }
    }

    // Write review modal
    document.getElementById('writeReviewBtn')?.addEventListener('click', () => {
        document.getElementById('reviewFormModal').style.display = 'flex';
    });
    document.getElementById('rfmClose')?.addEventListener('click', () => {
        document.getElementById('reviewFormModal').style.display = 'none';
    });
    document.getElementById('rfmOverlay')?.addEventListener('click', () => {
        document.getElementById('reviewFormModal').style.display = 'none';
    });

    // Star rating in review form
    let rfRating = 5;
    document.querySelectorAll('#rfStars i').forEach(star => {
        star.addEventListener('click', () => {
            rfRating = parseInt(star.dataset.val);
            document.querySelectorAll('#rfStars i').forEach((s, i) => {
                s.classList.toggle('active', i < rfRating);
            });
        });
    });

    document.getElementById('reviewForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rfName').value;
        const city = document.getElementById('rfCity').value;
        const text = document.getElementById('rfText').value;
        const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

        let reviews = JSON.parse(localStorage.getItem('b10_reviews') || '[]');
        const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;

        reviews.push({
            id: newId, author: name, location: city, initials, stars: rfRating,
            text, product: product.name, date: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('b10_reviews', JSON.stringify(reviews));

        document.getElementById('reviewFormModal').style.display = 'none';
        alert('Avaliação enviada com sucesso! Obrigado pelo seu feedback.');
        location.reload();
    });

    // Related products
    const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
    const relGrid = document.getElementById('relatedProducts');
    if (relGrid && related.length > 0) {
        relGrid.innerHTML = related.map(p => `
            <div class="product-card">
                <div class="product-image-wrapper">
                    ${p.originalPrice > 0 ? `<span class="product-badge sale">-${Math.round((1 - p.price / p.originalPrice) * 100)}%</span>` : '<span class="product-badge new">Novo</span>'}
                    <a href="produto.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy"></a>
                    <div class="product-sizes"><span>P</span><span>M</span><span>G</span><span>GG</span></div>
                </div>
                <div class="product-info">
                    <a href="#" class="product-category-link">${p.category}</a>
                    <h3 class="product-name"><a href="produto.html?id=${p.id}">${p.name}</a></h3>
                    <div class="product-prices">
                        ${p.originalPrice > 0 ? `<span class="price-old">${fmt(p.originalPrice)}</span>` : ''}
                        <span class="price-current">${fmt(p.price)}</span>
                    </div>
                    <div class="product-payment-info">
                        <span class="product-pix"><i class="fab fa-pix"></i> ${fmt(p.price * (1 - pixDiscount / 100))} <em>no PIX (${pixDiscount}% OFF)</em></span>
                    </div>
                    <a href="produto.html?id=${p.id}" class="add-to-cart-btn"><i class="fas fa-eye"></i> Ver Produto</a>
                </div>
            </div>
        `).join('');
    }

    // Cookie consent
    if (!localStorage.getItem('b10_cookie_consent')) {
        document.getElementById('cookieConsent')?.classList.add('show');
    }
    document.getElementById('cookieAccept')?.addEventListener('click', () => {
        localStorage.setItem('b10_cookie_consent', 'accepted');
        document.getElementById('cookieConsent')?.classList.remove('show');
    });
    document.getElementById('cookieReject')?.addEventListener('click', () => {
        localStorage.setItem('b10_cookie_consent', 'rejected');
        document.getElementById('cookieConsent')?.classList.remove('show');
    });
});
