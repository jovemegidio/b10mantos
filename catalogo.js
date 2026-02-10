/* ========================================
   B10 MANTOS - CATÁLOGO DINÂMICO
   Carrega produtos do localStorage (admin)
   e renderiza nas páginas de catálogo
   ======================================== */

(function () {
    'use strict';

    // ==========================================
    // DEFAULT PRODUCTS (fallback se localStorage vazio)
    // ==========================================
    const DEFAULT_PRODUCTS = [
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

    const DEFAULT_REVIEWS = [
        { id: 1, author: 'Rafael C.', location: 'São Paulo, SP', initials: 'RC', stars: 5, text: 'Qualidade absurda! Não consegui diferenciar da original. Tecido impecável e os detalhes são perfeitos. Super recomendo!', product: 'Arsenal FC 2024/2025', date: '2026-02-06' },
        { id: 2, author: 'Mariana S.', location: 'Rio de Janeiro, RJ', initials: 'MS', stars: 5, text: 'Entrega rápida e o atendimento pelo WhatsApp foi sensacional. Camisa chegou perfeita, já quero comprar outra!', product: 'Liverpool FC 2025/2026', date: '2026-02-04' },
        { id: 3, author: 'Lucas P.', location: 'Belo Horizonte, MG', initials: 'LP', stars: 4.5, text: 'Melhor custo-benefício que encontrei. Qualidade 1:1 de verdade, material premium. Já comprei 3 camisas e todas vieram impecáveis.', product: 'Seleção Brasileira 2004', date: '2026-02-02' }
    ];

    // ==========================================
    // LOAD DATA FROM LOCALSTORAGE
    // ==========================================
    function getProducts() {
        try {
            const data = localStorage.getItem('b10_products');
            const products = data ? JSON.parse(data) : DEFAULT_PRODUCTS;
            return products.filter(p => p.status === 'active');
        } catch { return DEFAULT_PRODUCTS; }
    }

    function getReviews() {
        try {
            const data = localStorage.getItem('b10_reviews');
            return data ? JSON.parse(data) : DEFAULT_REVIEWS;
        } catch { return DEFAULT_REVIEWS; }
    }

    // ==========================================
    // LOAD SETTINGS FROM ADMIN
    // ==========================================
    const siteSettings = (() => {
        try {
            const data = localStorage.getItem('b10_settings');
            return data ? JSON.parse(data) : {};
        } catch { return {}; }
    })();

    const pixDiscount = siteSettings.shipping?.pixDiscount ?? 5;
    const maxInstallments = siteSettings.shipping?.maxInstallments ?? 2;

    // ==========================================
    // HELPERS
    // ==========================================
    function formatPrice(value) {
        return 'R$ ' + Number(value).toFixed(2).replace('.', ',');
    }

    function calcPix(price) {
        return formatPrice(price * (1 - pixDiscount / 100));
    }

    function calcInstallment(price) {
        return formatPrice(price / maxInstallments);
    }

    function calcDiscount(original, current) {
        if (!original || original <= current) return 0;
        return Math.round(((original - current) / original) * 100);
    }

    function getCategoryFilter(cat) {
        if (!cat) return 'clube';
        return cat.toLowerCase().includes('sele') ? 'selecao' : 'clube';
    }

    function getStarsHTML(rating) {
        let html = '';
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.25;
        for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
        if (half) html += '<i class="fas fa-star-half-alt"></i>';
        const empty = 5 - full - (half ? 1 : 0);
        for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
        return html;
    }

    // ==========================================
    // CARD RENDERERS
    // ==========================================

    /**
     * Catalog card (todos-produtos, lancamentos, camisas-selecao, modelo-jogador, modelo-torcedor)
     */
    function renderCatalogCard(product, options = {}) {
        const discount = calcDiscount(product.originalPrice, product.price);
        const catFilter = getCategoryFilter(product.category);
        const regionFilter = getRegionFilter(product);

        let badges = '';
        if (options.badge === 'player') {
            badges = '<span class="product-badge badge-player">Player</span>';
        } else if (options.badge === 'fan') {
            badges = '<span class="product-badge badge-fan">Fan</span>';
        } else if (discount > 0) {
            badges = `<span class="product-badge badge-sale">-${discount}%</span>`;
        } else if (product.sales >= 30) {
            badges = '<span class="product-badge badge-fire">🔥 Hot</span>';
        } else if (product.sales <= 20) {
            badges = '<span class="product-badge badge-new">Novo</span>';
        }

        let priceHTML = '';
        if (product.originalPrice && product.originalPrice > product.price) {
            priceHTML = `<span class="price-old">${formatPrice(product.originalPrice)}</span>
                            <span class="price-current">${formatPrice(product.price)}</span>`;
        } else {
            priceHTML = `<span class="price-current">${formatPrice(product.price)}</span>`;
        }

        let savingsBadge = '';
        if (options.showSavings && product.originalPrice && product.originalPrice > product.price) {
            savingsBadge = `<div class="savings-badge"><i class="fas fa-piggy-bank"></i> Você economiza ${formatPrice(product.originalPrice - product.price)}</div>`;
        }

        const dataAttrs = options.dataCategory
            ? ` data-category="${options.dataCategory}"`
            : ` data-category="${catFilter}"`;

        return `
            <div class="product-card"${dataAttrs} data-price="${product.price}" data-name="${product.name}">
                <div class="product-img-wrap">
                    ${badges}
                    <a href="produto.html?id=${product.id}"><img src="${product.image}" alt="${product.name}" loading="lazy"></a>
                    <div class="product-actions">
                        <button class="action-btn" title="Visualização rápida"><i class="far fa-eye"></i></button>
                        <button class="action-btn" title="Favoritar"><i class="far fa-heart"></i></button>
                        <button class="action-btn" title="Compartilhar"><i class="fas fa-share-alt"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category === 'Seleções' ? 'Seleções' : 'Clubes'}</span>
                    <h3 class="product-name"><a href="produto.html?id=${product.id}">${product.name}</a></h3>
                    <div class="product-rating">${getStarsHTML(4.5)} <span>(${product.sales || 0})</span></div>
                    <div class="product-prices">
                        ${priceHTML}
                    </div>
                    <span class="product-installment">ou ${maxInstallments}x de ${calcInstallment(product.price)}</span>
                    ${savingsBadge}
                    <a href="produto.html?id=${product.id}" class="btn-add-cart"><i class="fas fa-eye"></i> Ver Produto</a>
                </div>
            </div>`;
    }

    /**
     * Homepage card (destaques, novidades, promocoes sections on index.html)
     */
    function renderHomeCard(product, options = {}) {
        const discount = calcDiscount(product.originalPrice, product.price);

        let badge = '';
        if (options.badge) {
            badge = `<span class="product-badge ${options.badge}">${options.badgeText || ''}</span>`;
        } else if (discount > 0) {
            badge = `<span class="product-badge sale">-${discount}%</span>`;
        } else if (product.sales >= 30) {
            badge = '<span class="product-badge special">Retrô</span>';
        } else {
            badge = '<span class="product-badge new">Novo</span>';
        }

        let priceHTML = '';
        if (product.originalPrice && product.originalPrice > product.price) {
            priceHTML = `<span class="price-old">${formatPrice(product.originalPrice)}</span><span class="price-current">${formatPrice(product.price)}</span>`;
        } else {
            priceHTML = `<span class="price-current">${formatPrice(product.price)}</span>`;
        }

        const catLabel = product.category === 'Seleções' ? 'Seleções' : 'Clubes Europeus';
        const dataCategory = product.category === 'Seleções' ? 'selecoes' : 'clubes';

        return `
                <div class="product-card" data-category="${dataCategory}">
                    <div class="product-image-wrapper">
                        ${badge}
                        <button class="wishlist-btn" aria-label="Favoritar"><i class="far fa-heart"></i></button>
                        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                        <div class="product-overlay"><button class="quick-view-btn"><i class="far fa-eye"></i> Visualização rápida</button></div>
                        <div class="product-sizes"><span>P</span><span>M</span><span>G</span><span>GG</span></div>
                    </div>
                    <div class="product-info">
                        <a href="produto.html?id=${product.id}" class="product-category-link">${catLabel}</a>
                        <h3 class="product-name"><a href="produto.html?id=${product.id}">${product.name}</a></h3>
                        <div class="product-rating"><div class="stars">${getStarsHTML(4.5)}</div><span class="rating-count">(${product.sales || 0})</span></div>
                        <div class="product-prices">${priceHTML}</div>
                        <div class="product-payment-info">
                            <span class="product-installment"><i class="far fa-credit-card"></i> ${maxInstallments}x de ${calcInstallment(product.price)} s/ juros</span>
                            <span class="product-pix"><i class="fab fa-pix"></i> ${calcPix(product.price)} <em>no PIX (${pixDiscount}% OFF)</em></span>
                        </div>
                        <button class="add-to-cart-btn"><i class="fas fa-shopping-bag"></i> Adicionar à Sacola</button>
                    </div>
                </div>`;
    }

    // ==========================================
    // REGION HELPER (for camisas-selecao filters)
    // ==========================================
    function getRegionFilter(product) {
        const name = (product.name || '').toLowerCase();
        if (name.includes('brasil') || name.includes('méxico') || name.includes('mexico') || name.includes('argentina') || name.includes('estados unidos') || name.includes('colombi')) {
            return 'americas';
        }
        return 'europa';
    }

    // ==========================================
    // TESTIMONIAL RENDERER
    // ==========================================
    function renderTestimonial(review) {
        const starsHTML = getStarsHTML(review.stars || 5);
        const products = getProducts();
        const matchProduct = products.find(p => p.name === review.product);
        const productImg = matchProduct ? matchProduct.image : '';
        const days = Math.max(1, Math.floor((Date.now() - new Date(review.date).getTime()) / 86400000));
        const timeText = days === 1 ? 'há 1 dia' : days < 7 ? `há ${days} dias` : `há ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`;

        return `
                <div class="testimonial-card">
                    <div class="testimonial-header">
                        <div class="testimonial-stars">${starsHTML}</div>
                        <span class="verified-badge"><i class="fas fa-check-circle"></i> Compra verificada</span>
                    </div>
                    <p>"${review.text}"</p>
                    ${productImg ? `<div class="testimonial-product-tag"><img src="${productImg}" alt=""><span>${review.product}</span></div>` : ''}
                    <div class="testimonial-author">
                        <div class="author-avatar">${review.initials || review.author.charAt(0)}</div>
                        <div><strong>${review.author}</strong><span>${review.location || ''} • ${timeText}</span></div>
                    </div>
                </div>`;
    }

    // ==========================================
    // PAGE RENDERERS
    // ==========================================

    /**
     * todos-produtos.html
     */
    function renderTodosProdutos() {
        const grid = document.getElementById('catalogGrid');
        if (!grid || !document.querySelector('.page-title')?.textContent?.includes('Todos os Produtos')) return;

        const products = getProducts();
        grid.innerHTML = products.map(p => renderCatalogCard(p)).join('');

        const countEl = document.getElementById('productCount');
        if (countEl) countEl.textContent = products.length;

        // Filter & sort
        setupCatalogFilters(grid, countEl);
    }

    /**
     * lancamentos.html
     */
    function renderLancamentos() {
        const grid = document.querySelector('[data-catalog="lancamentos"]');
        if (!grid) return;

        const products = getProducts();
        // Show newest / highest-id products (most recently added)
        const sorted = [...products].sort((a, b) => b.id - a.id).slice(0, 8);
        grid.innerHTML = sorted.map(p => renderCatalogCard(p)).join('');

        const countEl = grid.closest('.catalog-section')?.querySelector('.catalog-count span');
        if (countEl) countEl.textContent = sorted.length;
    }

    /**
     * camisas-selecao.html
     */
    function renderSelecoes() {
        const grid = document.querySelector('[data-catalog="selecoes"]');
        if (!grid) return;

        const products = getProducts().filter(p => p.category === 'Seleções');
        grid.innerHTML = products.map(p => renderCatalogCard(p, {
            dataCategory: getRegionFilter(p)
        })).join('');

        const countEl = grid.closest('.catalog-section')?.querySelector('.catalog-count span');
        if (countEl) countEl.textContent = products.length;

        // Filter chips for europa/americas
        setupRegionFilters(grid, countEl);
    }

    /**
     * modelo-jogador.html
     */
    function renderModeloJogador() {
        const grid = document.querySelector('[data-catalog="jogador"]');
        if (!grid) return;

        const products = getProducts();
        // Show a curated mix: clubs first, then selections
        const jogador = products.slice(0, Math.min(products.length, 8));
        grid.innerHTML = jogador.map(p => renderCatalogCard(p, { badge: 'player' })).join('');

        const countEl = grid.closest('.catalog-section')?.querySelector('.catalog-count span');
        if (countEl) countEl.textContent = jogador.length;
    }

    /**
     * modelo-torcedor.html
     */
    function renderModeloTorcedor() {
        const grid = document.querySelector('[data-catalog="torcedor"]');
        if (!grid) return;

        const products = getProducts();
        const torcedor = products.slice(0, Math.min(products.length, 8));
        grid.innerHTML = torcedor.map(p => renderCatalogCard(p, { badge: 'fan' })).join('');

        const countEl = grid.closest('.catalog-section')?.querySelector('.catalog-count span');
        if (countEl) countEl.textContent = torcedor.length;
    }

    /**
     * promocoes.html
     */
    function renderPromocoes() {
        const grid = document.querySelector('[data-catalog="promocoes"]');
        if (!grid) return;

        const products = getProducts().filter(p => p.originalPrice && p.originalPrice > p.price);
        grid.innerHTML = products.map(p => renderCatalogCard(p, { showSavings: true })).join('');

        const countEl = grid.closest('.catalog-section')?.querySelector('.catalog-count span');
        if (countEl) countEl.textContent = products.length;
    }

    /**
     * index.html — Destaques section
     */
    function renderHomeDestaques() {
        const grid = document.getElementById('destaquesGrid');
        if (!grid) return;

        const products = getProducts();
        // Top 4 by sales
        const top = [...products].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 4);
        grid.innerHTML = top.map(p => renderHomeCard(p)).join('');
    }

    /**
     * index.html — Novidades section
     */
    function renderHomeNovidades() {
        const grid = document.getElementById('novidadesGrid');
        if (!grid) return;

        const products = getProducts();
        // Products 5-8 by newest ID
        const sorted = [...products].sort((a, b) => b.id - a.id);
        const novidades = sorted.slice(0, 4);
        grid.innerHTML = novidades.map(p => renderHomeCard(p, { badge: 'new', badgeText: 'Novo' })).join('');
    }

    /**
     * index.html — More Novidades section
     */
    function renderHomeNovidades2() {
        const grid = document.getElementById('novidadesGrid2');
        if (!grid) return;

        const products = getProducts();
        const sorted = [...products].sort((a, b) => b.id - a.id);
        const novidades = sorted.slice(4, 8);
        grid.innerHTML = novidades.map(p => renderHomeCard(p, { badge: 'new', badgeText: 'Novo' })).join('');
    }

    /**
     * index.html — Promoções section
     */
    function renderHomePromocoes() {
        const grid = document.getElementById('promocoesGrid');
        if (!grid) return;

        const products = getProducts().filter(p => p.originalPrice && p.originalPrice > p.price);
        const promos = products.slice(0, 4);
        grid.innerHTML = promos.map(p => renderHomeCard(p)).join('');
    }

    /**
     * index.html — Testimonials section
     */
    function renderHomeTestimonials() {
        const grid = document.getElementById('testimonialsGrid');
        if (!grid) return;

        const reviews = getReviews();
        grid.innerHTML = reviews.slice(0, 3).map(r => renderTestimonial(r)).join('');
    }

    // ==========================================
    // FILTER & SORT HELPERS
    // ==========================================
    function setupCatalogFilters(grid, countEl) {
        const filterChips = document.querySelectorAll('.filter-chip');
        const sortSelect = document.getElementById('sortSelect');

        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const filter = chip.dataset.filter;
                let visible = 0;
                grid.querySelectorAll('.product-card').forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = '';
                        visible++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                if (countEl) countEl.textContent = visible;
            });
        });

        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                const cards = Array.from(grid.querySelectorAll('.product-card')).filter(c => c.style.display !== 'none');
                cards.sort((a, b) => {
                    switch (sortSelect.value) {
                        case 'menor-preco': return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                        case 'maior-preco': return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                        case 'nome-az': return a.dataset.name.localeCompare(b.dataset.name);
                        default: return 0;
                    }
                });
                cards.forEach(c => grid.appendChild(c));
            });
        }
    }

    function setupRegionFilters(grid, countEl) {
        const filterChips = grid.closest('.catalog-section')?.querySelectorAll('.filter-chip');
        if (!filterChips) return;

        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const filter = chip.dataset.filter;
                let visible = 0;
                grid.querySelectorAll('.product-card').forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = '';
                        visible++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                if (countEl) countEl.textContent = visible;
            });
        });
    }

    // ==========================================
    // INIT
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        // Catalog pages
        renderTodosProdutos();
        renderLancamentos();
        renderSelecoes();
        renderModeloJogador();
        renderModeloTorcedor();
        renderPromocoes();

        // Index page
        renderHomeDestaques();
        renderHomeNovidades();
        renderHomeNovidades2();
        renderHomePromocoes();
        renderHomeTestimonials();
    });

})();
