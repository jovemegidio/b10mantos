/* ========================================
   B10 MANTOS - ADMIN PANEL JAVASCRIPT
   Full CRUD with localStorage persistence
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // DATA STORE (localStorage)
    // ==========================================
    const DB = {
        get(key, fallback) {
            try {
                const data = localStorage.getItem('b10_' + key);
                return data ? JSON.parse(data) : fallback;
            } catch { return fallback; }
        },
        set(key, value) {
            localStorage.setItem('b10_' + key, JSON.stringify(value));
        }
    };

    // Default products
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

    const DEFAULT_ORDERS = [
        { id: 'B10-001', customer: 'Rafael C.', initials: 'RC', product: 'Arsenal FC 2024/2025', value: 138.70, status: 'delivered', date: '2026-02-06' },
        { id: 'B10-002', customer: 'Mariana S.', initials: 'MS', product: 'Liverpool FC 2025/2026', value: 138.70, status: 'delivered', date: '2026-02-05' },
        { id: 'B10-003', customer: 'Lucas P.', initials: 'LP', product: 'Seleção Brasileira 2004', value: 198.70, status: 'shipped', date: '2026-02-04' },
        { id: 'B10-004', customer: 'Amanda R.', initials: 'AR', product: 'Inter de Milão 2024/2025', value: 159.80, status: 'shipped', date: '2026-02-03' },
        { id: 'B10-005', customer: 'Carlos M.', initials: 'CM', product: 'Chelsea FC Total 90', value: 159.80, status: 'pending', date: '2026-02-02' },
        { id: 'B10-006', customer: 'Juliana F.', initials: 'JF', product: 'Portugal Seleção', value: 168.70, status: 'pending', date: '2026-02-01' }
    ];

    const DEFAULT_CUSTOMERS = [
        { name: 'Rafael C.', email: 'rafael@email.com', phone: '(11) 99999-1234', orders: 3, total: 457.10, lastOrder: '2026-02-06' },
        { name: 'Mariana S.', email: 'mariana@email.com', phone: '(21) 98888-5678', orders: 2, total: 298.50, lastOrder: '2026-02-05' },
        { name: 'Lucas P.', email: 'lucas@email.com', phone: '(31) 97777-9012', orders: 5, total: 789.00, lastOrder: '2026-02-04' },
        { name: 'Amanda R.', email: 'amanda@email.com', phone: '(41) 96666-3456', orders: 1, total: 159.80, lastOrder: '2026-02-03' },
        { name: 'Carlos M.', email: 'carlos@email.com', phone: '(51) 95555-7890', orders: 2, total: 319.60, lastOrder: '2026-02-02' },
        { name: 'Juliana F.', email: 'juliana@email.com', phone: '(61) 94444-1234', orders: 1, total: 168.70, lastOrder: '2026-02-01' }
    ];

    // Initialize data
    let products = DB.get('products', DEFAULT_PRODUCTS);
    let reviews = DB.get('reviews', DEFAULT_REVIEWS);
    let orders = DB.get('orders', DEFAULT_ORDERS);
    let customers = DB.get('customers', DEFAULT_CUSTOMERS);
    let credentials = DB.get('credentials', { user: 'bruno', pass: 'bruno123' });
    // Ensure default admin is 'bruno' on first load
    if (credentials.user === 'admin' && credentials.pass === 'admin123') {
        credentials = { user: 'bruno', pass: 'bruno123' };
        DB.set('credentials', credentials);
    }

    function saveAll() {
        try {
            DB.set('products', products);
            DB.set('reviews', reviews);
            DB.set('orders', orders);
            DB.set('customers', customers);
            DB.set('credentials', credentials);
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.code === 22) {
                showToast('Espaço insuficiente! Reduza o tamanho das imagens ou remova produtos antigos.', 'error');
            } else {
                showToast('Erro ao salvar dados: ' + e.message, 'error');
            }
        }
    }

    // ==========================================
    // TOAST
    // ==========================================
    function showToast(msg, type = 'success') {
        const existing = document.querySelector('.admin-toast');
        if (existing) existing.remove();

        const t = document.createElement('div');
        t.className = `admin-toast ${type}`;
        t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${msg}`;
        document.body.appendChild(t);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => t.classList.add('show'));
        });

        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => t.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // LOGIN
    // ==========================================
    const loginScreen = document.getElementById('loginScreen');
    const adminWrapper = document.getElementById('adminWrapper');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Check if already logged in
    if (DB.get('loggedIn', false)) {
        loginScreen.style.display = 'none';
        adminWrapper.style.display = 'flex';
        loadAdminAvatar();
    }

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;

        if (user === credentials.user && pass === credentials.pass) {
            DB.set('loggedIn', true);
            loginScreen.style.display = 'none';
            adminWrapper.style.display = 'flex';
            loadAdminAvatar();
            renderAll();
        } else {
            loginError.style.display = 'block';
            setTimeout(() => { loginError.style.display = 'none'; }, 3000);
        }
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        DB.set('loggedIn', false);
        loginScreen.style.display = 'flex';
        adminWrapper.style.display = 'none';
    });

    // ==========================================
    // SIDEBAR NAVIGATION
    // ==========================================
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.admin-section');
    const sectionTitle = document.getElementById('sectionTitle');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sec = link.dataset.section;

            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            document.getElementById('sec-' + sec)?.classList.add('active');

            sectionTitle.textContent = link.textContent.trim();

            // Close sidebar on mobile
            document.getElementById('adminSidebar')?.classList.remove('open');
        });
    });

    // Sidebar toggle (mobile)
    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
        document.getElementById('adminSidebar')?.classList.toggle('open');
    });

    // ==========================================
    // MODAL
    // ==========================================
    const modal = document.getElementById('adminModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalSave = document.getElementById('modalSave');
    let currentModalAction = null;

    function openModal(title, bodyHTML, onSave) {
        modalTitle.textContent = title;
        modalBody.innerHTML = bodyHTML;
        currentModalAction = onSave;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        currentModalAction = null;
        // Stop any active webcam stream
        const video = document.getElementById('cameraPreviewVideo');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(t => t.stop());
            video.srcObject = null;
        }
    }

    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.getElementById('modalCancel')?.addEventListener('click', closeModal);
    document.getElementById('modalOverlay')?.addEventListener('click', closeModal);

    modalSave?.addEventListener('click', () => {
        if (currentModalAction) currentModalAction();
    });

    // ==========================================
    // RENDER PRODUCTS TABLE
    // ==========================================
    function renderProducts(filter = '') {
        const tbody = document.getElementById('productsBody');
        if (!tbody) return;

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(filter.toLowerCase())
        );

        tbody.innerHTML = filtered.map(p => `
            <tr>
                <td><img src="${p.image}" alt="${p.name}" class="product-thumb"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td><strong style="color:#059669">R$ ${p.price.toFixed(2).replace('.', ',')}</strong></td>
                <td>${p.originalPrice ? '<s style="color:#94a3b8">R$ ' + p.originalPrice.toFixed(2).replace('.', ',') + '</s>' : '—'}</td>
                <td><span class="status-badge ${p.status}">${p.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn" onclick="editProduct(${p.id})" title="Editar"><i class="fas fa-pen"></i></button>
                        <button class="action-btn delete" onclick="deleteProduct(${p.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Product CRUD
    function buildProductModalHTML(p = null) {
        const isEdit = !!p;
        const name = p ? p.name : '';
        const category = p ? p.category : 'Clubes Europeus';
        const price = p ? p.price : '';
        const originalPrice = p ? p.originalPrice : 0;
        const image = p ? p.image : '';
        const status = p ? p.status : 'active';
        const isBase64 = image.startsWith('data:');

        return `
            <div class="modal-image-preview" id="imagePreviewWrap" style="text-align:center;margin-bottom:16px;${image ? '' : 'display:none'}">
                <img id="imagePreview" src="${image}" alt="Preview" style="max-width:140px;max-height:140px;border-radius:12px;object-fit:cover;border:2px solid #e2e8f0">
                <button type="button" id="removeImageBtn" style="display:block;margin:8px auto 0;font-size:11px;color:#ef4444;background:none;border:none;cursor:pointer;font-weight:600" title="Remover imagem"><i class="fas fa-trash-alt"></i> Remover imagem</button>
            </div>
            <div class="form-group">
                <label>Nome do Produto</label>
                <input type="text" id="editPName" value="${name}" placeholder="Ex: Real Madrid 2025/2026">
            </div>
            <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="form-group">
                    <label>Categoria</label>
                    <select id="editPCategory">
                        <option ${category === 'Clubes Europeus' ? 'selected' : ''}>Clubes Europeus</option>
                        <option ${category === 'Seleções' ? 'selected' : ''}>Seleções</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="editPStatus">
                        <option value="active" ${status === 'active' ? 'selected' : ''}>✅ Ativo</option>
                        <option value="inactive" ${status === 'inactive' ? 'selected' : ''}>❌ Inativo</option>
                    </select>
                </div>
            </div>
            <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="form-group">
                    <label>Preço Atual (R$)</label>
                    <input type="number" id="editPPrice" value="${price}" placeholder="159.80" step="0.01" min="0">
                </div>
                <div class="form-group">
                    <label>Preço Original (R$) <small style="color:#94a3b8;font-weight:400">0 = sem desconto</small></label>
                    <input type="number" id="editPOriginal" value="${originalPrice}" step="0.01" min="0">
                </div>
            </div>
            <div id="discountPreview" style="margin-bottom:12px"></div>
            <div class="form-group">
                <label>Imagem do Produto</label>
                <div class="image-upload-tabs">
                    <button type="button" class="img-tab ${isBase64 ? '' : 'active'}" data-tab="url"><i class="fas fa-link"></i> URL</button>
                    <button type="button" class="img-tab ${isBase64 ? 'active' : ''}" data-tab="upload"><i class="fas fa-upload"></i> Arquivo</button>
                    <button type="button" class="img-tab" data-tab="camera"><i class="fas fa-camera"></i> Câmera</button>
                </div>
                <div class="img-tab-content" id="tabUrl" style="${isBase64 ? 'display:none' : ''}">
                    <input type="text" id="editPImage" value="${isBase64 ? '' : image}" placeholder="https://cdn.example.com/imagem.webp">
                </div>
                <div class="img-tab-content" id="tabUpload" style="${isBase64 ? '' : 'display:none'}">
                    <div class="upload-drop-zone" id="uploadDropZone">
                        <input type="file" id="editPFile" accept="image/*" style="display:none">
                        <div class="drop-zone-content">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Arraste a imagem aqui ou <span class="drop-zone-click">clique para selecionar</span></p>
                            <small>JPG, PNG ou WEBP • Máx 2MB</small>
                        </div>
                        <div class="drop-zone-file" id="dropZoneFile" style="display:none">
                            <i class="fas fa-check-circle"></i>
                            <span id="dropZoneFileName">imagem.jpg</span>
                            <button type="button" id="dropZoneClear" title="Remover"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                </div>
                <div class="img-tab-content" id="tabCamera" style="display:none">
                    <div class="camera-zone" id="cameraZone">
                        <input type="file" id="editPCamera" accept="image/*" capture="environment" style="display:none">
                        <video id="cameraPreviewVideo" autoplay playsinline style="display:none;width:100%;max-height:260px;border-radius:10px;background:#000"></video>
                        <canvas id="cameraCanvas" style="display:none"></canvas>
                        <div class="camera-placeholder" id="cameraPlaceholder">
                            <i class="fas fa-camera"></i>
                            <p id="cameraMainText">Tirar foto do produto</p>
                            <small id="cameraSubText">Use a câmera do celular ou webcam</small>
                            <div class="camera-buttons" id="cameraButtons">
                                <button type="button" class="btn-camera-action" id="btnStartCamera"><i class="fas fa-video"></i> Abrir Webcam</button>
                                <button type="button" class="btn-camera-action secondary" id="btnMobileCamera"><i class="fas fa-mobile-alt"></i> Câmera do Celular</button>
                            </div>
                        </div>
                        <div class="camera-controls" id="cameraControls" style="display:none">
                            <button type="button" class="btn-camera-capture" id="btnCapture"><i class="fas fa-circle"></i></button>
                            <button type="button" class="btn-camera-stop" id="btnStopCamera"><i class="fas fa-times"></i> Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
            <input type="hidden" id="editPImageData" value="${image}">
        `;
    }

    function setupProductModalListeners() {
        const imgInput = document.getElementById('editPImage');
        const fileInput = document.getElementById('editPFile');
        const imageDataInput = document.getElementById('editPImageData');
        const preview = document.getElementById('imagePreview');
        const previewWrap = document.getElementById('imagePreviewWrap');
        const removeBtn = document.getElementById('removeImageBtn');
        const priceInput = document.getElementById('editPPrice');
        const originalInput = document.getElementById('editPOriginal');
        const discountPreview = document.getElementById('discountPreview');
        const dropZone = document.getElementById('uploadDropZone');
        const dropZoneFile = document.getElementById('dropZoneFile');
        const dropZoneFileName = document.getElementById('dropZoneFileName');
        const dropZoneClear = document.getElementById('dropZoneClear');
        const dropZoneContent = dropZone?.querySelector('.drop-zone-content');

        // ---- Image Tab Switching ----
        document.querySelectorAll('.img-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.img-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const selected = tab.dataset.tab;
                document.getElementById('tabUrl').style.display = selected === 'url' ? '' : 'none';
                document.getElementById('tabUpload').style.display = selected === 'upload' ? '' : 'none';
                document.getElementById('tabCamera').style.display = selected === 'camera' ? '' : 'none';
                // Stop webcam when switching away from camera tab
                if (selected !== 'camera') stopWebcam();
            });
        });

        // ---- Webcam / Camera ----
        let cameraStream = null;
        const video = document.getElementById('cameraPreviewVideo');
        const cameraCanvas = document.getElementById('cameraCanvas');
        const cameraPlaceholder = document.getElementById('cameraPlaceholder');
        const cameraControls = document.getElementById('cameraControls');
        const cameraInput = document.getElementById('editPCamera');
        const btnStartCamera = document.getElementById('btnStartCamera');
        const btnMobileCamera = document.getElementById('btnMobileCamera');
        const btnCapture = document.getElementById('btnCapture');
        const btnStopCamera = document.getElementById('btnStopCamera');

        function stopWebcam() {
            if (cameraStream) {
                cameraStream.getTracks().forEach(t => t.stop());
                cameraStream = null;
            }
            if (video) video.style.display = 'none';
            if (cameraControls) cameraControls.style.display = 'none';
            if (cameraPlaceholder) cameraPlaceholder.style.display = '';
        }

        // Start webcam (desktop or supported mobile browsers)
        btnStartCamera?.addEventListener('click', async () => {
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
                video.srcObject = cameraStream;
                video.style.display = 'block';
                cameraPlaceholder.style.display = 'none';
                cameraControls.style.display = 'flex';
            } catch (err) {
                showToast('Não foi possível acessar a câmera. Verifique as permissões.', 'error');
                console.error('Camera error:', err);
            }
        });

        // Mobile camera button – uses native file input with capture
        btnMobileCamera?.addEventListener('click', () => {
            cameraInput?.click();
        });

        // Process photo from mobile camera input
        cameraInput?.addEventListener('change', () => {
            if (cameraInput.files.length > 0) {
                processFile(cameraInput.files[0]);
                // Switch visual feedback
                const urlTab = document.querySelector('.img-tab[data-tab="upload"]');
                if (urlTab) {
                    document.querySelectorAll('.img-tab').forEach(t => t.classList.remove('active'));
                    urlTab.classList.add('active');
                    document.getElementById('tabUrl').style.display = 'none';
                    document.getElementById('tabUpload').style.display = '';
                    document.getElementById('tabCamera').style.display = 'none';
                }
            }
        });

        // Capture photo from webcam
        btnCapture?.addEventListener('click', () => {
            if (!video || !video.videoWidth) return;
            cameraCanvas.width = video.videoWidth;
            cameraCanvas.height = video.videoHeight;
            const ctx = cameraCanvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            // Resize to max 600px to save space
            const MAX = 600;
            let w = cameraCanvas.width, h = cameraCanvas.height;
            if (w > MAX || h > MAX) {
                if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                else { w = Math.round(w * MAX / h); h = MAX; }
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = w;
                tempCanvas.height = h;
                tempCanvas.getContext('2d').drawImage(cameraCanvas, 0, 0, w, h);
                var dataUrl = tempCanvas.toDataURL('image/webp', 0.82);
            } else {
                var dataUrl = cameraCanvas.toDataURL('image/webp', 0.82);
            }

            showPreview(dataUrl);
            if (imgInput) imgInput.value = '';
            stopWebcam();

            const sizeKB = Math.round(dataUrl.length * 0.75 / 1024);
            showToast(`Foto capturada! (${w}×${h}, ~${sizeKB}KB)`, 'success');
        });

        // Stop webcam
        btnStopCamera?.addEventListener('click', stopWebcam);

        // ---- Preview Updater ----
        function showPreview(src) {
            if (src) {
                preview.src = src;
                previewWrap.style.display = '';
                imageDataInput.value = src;
            }
        }

        function clearPreview() {
            preview.src = '';
            previewWrap.style.display = 'none';
            imageDataInput.value = '';
        }

        // ---- URL Input ----
        imgInput?.addEventListener('input', () => {
            const url = imgInput.value.trim();
            if (url) {
                preview.onerror = () => { previewWrap.style.display = 'none'; };
                showPreview(url);
            } else {
                clearPreview();
            }
        });

        // ---- File Processing ----
        function processFile(file) {
            if (!file) return;

            // Validate type
            if (!file.type.startsWith('image/')) {
                showToast('Arquivo precisa ser uma imagem (JPG, PNG, WEBP)', 'error');
                return;
            }

            // Validate size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                showToast('Imagem muito grande. Máximo: 2MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Resize to max 600px to save localStorage space
                    const MAX = 600;
                    let w = img.width, h = img.height;
                    if (w > MAX || h > MAX) {
                        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                        else { w = Math.round(w * MAX / h); h = MAX; }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    const dataUrl = canvas.toDataURL('image/webp', 0.82);

                    showPreview(dataUrl);

                    // Show file name in drop zone
                    if (dropZoneContent) dropZoneContent.style.display = 'none';
                    if (dropZoneFile) {
                        dropZoneFile.style.display = 'flex';
                        dropZoneFileName.textContent = file.name;
                    }

                    // Clear URL field since we're using upload
                    if (imgInput) imgInput.value = '';

                    const sizeKB = Math.round(dataUrl.length * 0.75 / 1024);
                    showToast(`Imagem carregada! (${w}×${h}, ~${sizeKB}KB)`, 'success');
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                showToast('Erro ao ler o arquivo', 'error');
            };
            reader.readAsDataURL(file);
        }

        // ---- File Input Click ----
        dropZone?.addEventListener('click', (e) => {
            if (e.target.closest('#dropZoneClear')) return;
            fileInput?.click();
        });

        fileInput?.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                processFile(fileInput.files[0]);
            }
        });

        // ---- Drag & Drop ----
        dropZone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone?.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone?.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
        });

        // ---- Clear uploaded file ----
        dropZoneClear?.addEventListener('click', (e) => {
            e.stopPropagation();
            clearPreview();
            if (fileInput) fileInput.value = '';
            if (dropZoneContent) dropZoneContent.style.display = '';
            if (dropZoneFile) dropZoneFile.style.display = 'none';
        });

        // ---- Remove image button ----
        removeBtn?.addEventListener('click', () => {
            clearPreview();
            if (imgInput) imgInput.value = '';
            if (fileInput) fileInput.value = '';
            if (dropZoneContent) dropZoneContent.style.display = '';
            if (dropZoneFile) dropZoneFile.style.display = 'none';
        });

        // ---- Discount Preview ----
        function updateDiscount() {
            const price = parseFloat(priceInput?.value) || 0;
            const original = parseFloat(originalInput?.value) || 0;
            if (original > price && price > 0) {
                const pct = Math.round(((original - price) / original) * 100);
                discountPreview.innerHTML = `<div style="padding:8px 12px;background:#dcfce7;border-radius:8px;font-size:12px;font-weight:600;color:#16a34a"><i class="fas fa-tag"></i> Desconto: ${pct}% (economia de R$ ${(original - price).toFixed(2).replace('.', ',')})</div>`;
            } else {
                discountPreview.innerHTML = '';
            }
        }

        priceInput?.addEventListener('input', updateDiscount);
        originalInput?.addEventListener('input', updateDiscount);
        updateDiscount();
    }

    function getProductFormData() {
        // imageData has the final value: base64 from upload OR URL from text field
        const imageData = document.getElementById('editPImageData')?.value || '';
        const urlValue = document.getElementById('editPImage')?.value.trim() || '';
        // Prefer hidden field (already set by upload/URL listeners), fallback to URL input
        const finalImage = imageData || urlValue;

        return {
            name: document.getElementById('editPName')?.value.trim() || '',
            category: document.getElementById('editPCategory')?.value || 'Clubes Europeus',
            price: parseFloat(document.getElementById('editPPrice')?.value) || 0,
            originalPrice: parseFloat(document.getElementById('editPOriginal')?.value) || 0,
            image: finalImage,
            status: document.getElementById('editPStatus')?.value || 'active'
        };
    }

    window.editProduct = function(id) {
        const p = products.find(x => x.id === id);
        if (!p) return;

        openModal('Editar Produto', buildProductModalHTML(p), () => {
            const data = getProductFormData();
            if (!data.name) { showToast('Nome é obrigatório', 'error'); return; }
            if (data.price <= 0) { showToast('Preço deve ser maior que zero', 'error'); return; }

            p.name = data.name;
            p.category = data.category;
            p.price = data.price;
            p.originalPrice = data.originalPrice;
            p.image = data.image;
            p.status = data.status;
            saveAll();
            renderProducts();
            renderDashboard();
            closeModal();
            showToast('Produto atualizado com sucesso!');
        });

        setTimeout(setupProductModalListeners, 50);
    };

    window.deleteProduct = function(id) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;
        products = products.filter(p => p.id !== id);
        saveAll();
        renderProducts();
        showToast('Produto excluído', 'info');
    };

    document.getElementById('addProductBtn')?.addEventListener('click', () => {
        openModal('Novo Produto', buildProductModalHTML(), () => {
            const data = getProductFormData();
            if (!data.name) { showToast('Nome é obrigatório', 'error'); return; }
            if (data.price <= 0) { showToast('Preço deve ser maior que zero', 'error'); return; }

            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({
                id: newId,
                name: data.name,
                category: data.category,
                price: data.price,
                originalPrice: data.originalPrice,
                image: data.image,
                status: data.status,
                sales: 0
            });
            saveAll();
            renderProducts();
            renderDashboard();
            closeModal();
            showToast('Produto criado com sucesso!');
        });

        setTimeout(setupProductModalListeners, 50);
    });

    document.getElementById('productSearch')?.addEventListener('input', (e) => {
        renderProducts(e.target.value);
    });

    // ==========================================
    // RENDER REVIEWS
    // ==========================================
    function renderReviews(filter = '') {
        const grid = document.getElementById('reviewsGrid');
        if (!grid) return;

        const filtered = reviews.filter(r =>
            r.author.toLowerCase().includes(filter.toLowerCase()) ||
            r.text.toLowerCase().includes(filter.toLowerCase())
        );

        grid.innerHTML = filtered.map(r => {
            const starsHTML = Array.from({ length: 5 }, (_, i) => {
                if (i + 1 <= Math.floor(r.stars)) return '<i class="fas fa-star"></i>';
                if (i + 0.5 < r.stars) return '<i class="fas fa-star-half-alt"></i>';
                return '<i class="far fa-star"></i>';
            }).join('');

            return `
            <div class="review-card">
                <div class="review-actions">
                    <button class="action-btn" onclick="editReview(${r.id})" title="Editar"><i class="fas fa-pen"></i></button>
                    <button class="action-btn delete" onclick="deleteReview(${r.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>
                <div class="review-card-header">
                    <div class="review-avatar">${r.initials}</div>
                    <div class="review-author">
                        <strong>${r.author}</strong>
                        <span>${r.location} • ${formatDate(r.date)}</span>
                    </div>
                </div>
                <div class="review-stars">${starsHTML}</div>
                <div class="review-text">"${r.text}"</div>
                <span class="review-product"><i class="fas fa-tshirt"></i> ${r.product}</span>
            </div>`;
        }).join('');
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        const diff = Math.floor((new Date() - d) / 86400000);
        if (diff === 0) return 'Hoje';
        if (diff === 1) return 'Ontem';
        if (diff < 7) return `há ${diff} dias`;
        if (diff < 30) return `há ${Math.floor(diff / 7)} semana(s)`;
        return d.toLocaleDateString('pt-BR');
    }

    function buildReviewModalHTML(r = null) {
        const isEdit = !!r;
        const author = r ? r.author : '';
        const initials = r ? r.initials : '';
        const location = r ? r.location : '';
        const stars = r ? r.stars : 5;
        const text = r ? r.text : '';
        const product = r ? r.product : '';

        return `
            <div class="form-row" style="display:grid;grid-template-columns:2fr 1fr;gap:12px">
                <div class="form-group">
                    <label>Nome do Autor</label>
                    <input type="text" id="editRAuthor" value="${author}" placeholder="Nome do cliente">
                </div>
                <div class="form-group">
                    <label>Iniciais</label>
                    <input type="text" id="editRInitials" value="${initials}" placeholder="RC" maxlength="2" style="text-transform:uppercase">
                </div>
            </div>
            <div class="form-group">
                <label>Localidade</label>
                <input type="text" id="editRLocation" value="${location}" placeholder="S\u00e3o Paulo, SP">
            </div>
            <div class="form-group">
                <label>Nota (clique na estrela, clique novamente para meia estrela)</label>
                <div class="star-selector" id="starSelector" data-rating="${stars}">
                    ${[1,2,3,4,5].map(i => {
                        let cls = '';
                        if (i <= Math.floor(stars)) cls = 'full';
                        else if (i - 0.5 === stars) cls = 'half';
                        return `<span class="star-pick ${cls}" data-val="${i}"><i class="fas fa-star full-icon"></i><i class="fas fa-star-half-alt half-icon"></i><i class="far fa-star empty-icon"></i></span>`;
                    }).join('')}
                    <span class="star-rating-value" id="starRatingValue" style="margin-left:8px;font-weight:700;font-size:16px;color:var(--admin-primary)">${stars}</span>
                </div>
            </div>
            <div class="form-group">
                <label>Texto da Avalia\u00e7\u00e3o</label>
                <textarea id="editRText" rows="3" placeholder="Texto da avalia\u00e7\u00e3o...">${text}</textarea>
            </div>
            <div class="form-group">
                <label>Produto Avaliado</label>
                <select id="editRProduct">
                    ${products.map(p => `<option ${p.name === product ? 'selected' : ''}>${p.name}</option>`).join('')}
                </select>
            </div>
        `;
    }

    function setupStarSelector() {
        const container = document.getElementById('starSelector');
        const valueEl = document.getElementById('starRatingValue');
        if (!container) return;

        let currentRating = parseFloat(container.dataset.rating) || 5;

        function renderStars() {
            container.querySelectorAll('.star-pick').forEach(span => {
                const val = parseInt(span.dataset.val);
                span.classList.remove('full', 'half');
                if (val <= Math.floor(currentRating)) {
                    span.classList.add('full');
                } else if (val - 0.5 === currentRating) {
                    span.classList.add('half');
                }
            });
            container.dataset.rating = currentRating;
            if (valueEl) valueEl.textContent = currentRating % 1 === 0 ? currentRating + '.0' : currentRating;
        }

        container.querySelectorAll('.star-pick').forEach(span => {
            span.addEventListener('click', () => {
                const val = parseInt(span.dataset.val);
                // If clicking same whole star, toggle to half; if half, toggle to full
                if (currentRating === val) {
                    currentRating = val - 0.5;
                } else if (currentRating === val - 0.5) {
                    currentRating = val;
                } else {
                    currentRating = val;
                }
                renderStars();
            });
        });

        renderStars();
    }

    function getReviewRating() {
        const container = document.getElementById('starSelector');
        return parseFloat(container?.dataset.rating) || 5;
    }

    window.editReview = function(id) {
        const r = reviews.find(x => x.id === id);
        if (!r) return;

        openModal('Editar Avalia\u00e7\u00e3o', buildReviewModalHTML(r), () => {
            const author = document.getElementById('editRAuthor')?.value.trim();
            if (!author) { showToast('Autor \u00e9 obrigat\u00f3rio', 'error'); return; }

            r.author = author;
            r.initials = document.getElementById('editRInitials')?.value.toUpperCase() || author.substring(0, 2).toUpperCase();
            r.location = document.getElementById('editRLocation')?.value || '';
            r.stars = getReviewRating();
            r.text = document.getElementById('editRText')?.value || '';
            r.product = document.getElementById('editRProduct')?.value || '';

            saveAll();
            renderReviews();
            renderDashboard();
            closeModal();
            showToast('Avalia\u00e7\u00e3o atualizada!');
        });

        setTimeout(setupStarSelector, 50);
    };

    window.deleteReview = function(id) {
        if (!confirm('Excluir esta avaliação?')) return;
        reviews = reviews.filter(r => r.id !== id);
        saveAll();
        renderReviews();
        showToast('Avaliação excluída', 'info');
    };

    document.getElementById('addReviewBtn')?.addEventListener('click', () => {
        openModal('Nova Avalia\u00e7\u00e3o', buildReviewModalHTML(), () => {
            const author = document.getElementById('editRAuthor')?.value.trim();
            if (!author) { showToast('Autor \u00e9 obrigat\u00f3rio', 'error'); return; }

            const text = document.getElementById('editRText')?.value.trim();
            if (!text) { showToast('Texto da avalia\u00e7\u00e3o \u00e9 obrigat\u00f3rio', 'error'); return; }

            const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;

            reviews.push({
                id: newId,
                author,
                initials: document.getElementById('editRInitials')?.value.toUpperCase() || author.substring(0, 2).toUpperCase(),
                location: document.getElementById('editRLocation')?.value || 'Brasil',
                stars: getReviewRating(),
                text,
                product: document.getElementById('editRProduct')?.value || '',
                date: new Date().toISOString().split('T')[0]
            });
            saveAll();
            renderReviews();
            renderDashboard();
            closeModal();
            showToast('Avalia\u00e7\u00e3o criada com sucesso!');
        });

        setTimeout(setupStarSelector, 50);
    });

    document.getElementById('reviewSearch')?.addEventListener('input', (e) => {
        renderReviews(e.target.value);
    });

    // ==========================================
    // RENDER ORDERS
    // ==========================================
    function renderOrders(statusFilter = 'all') {
        const tbody = document.getElementById('ordersBody');
        if (!tbody) return;

        const statusLabels = { pending: 'Pendente', shipped: 'Enviado', delivered: 'Entregue' };
        const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

        tbody.innerHTML = filtered.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>
                    <div style="display:flex;align-items:center;gap:10px">
                        <div class="order-avatar">${o.initials}</div>
                        ${o.customer}
                    </div>
                </td>
                <td>${o.product}</td>
                <td><strong>R$ ${o.value.toFixed(2).replace('.', ',')}</strong></td>
                <td><span class="status-badge ${o.status}">${statusLabels[o.status]}</span></td>
                <td>${new Date(o.date).toLocaleDateString('pt-BR')}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn" onclick="changeOrderStatus('${o.id}')" title="Alterar Status"><i class="fas fa-exchange-alt"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.changeOrderStatus = function(id) {
        const order = orders.find(o => o.id === id);
        if (!order) return;

        const statusLabels = { pending: 'Pendente', shipped: 'Enviado', delivered: 'Entregue' };
        const statusIcons = { pending: 'clock', shipped: 'truck', delivered: 'check-circle' };
        const statusColors = { pending: '#f59e0b', shipped: '#3b82f6', delivered: '#10b981' };
        const allStatuses = ['pending', 'shipped', 'delivered'];

        const optionsHTML = allStatuses.map(s => {
            const isCurrent = s === order.status;
            return `
                <label class="status-option ${isCurrent ? 'current' : ''}" style="display:flex;align-items:center;gap:12px;padding:14px 16px;border:2px solid ${isCurrent ? statusColors[s] : '#e2e8f0'};border-radius:10px;cursor:pointer;transition:all 0.2s;margin-bottom:8px;${isCurrent ? 'background:' + statusColors[s] + '15' : ''}">
                    <input type="radio" name="orderStatus" value="${s}" ${isCurrent ? 'checked' : ''} style="display:none">
                    <div style="width:36px;height:36px;border-radius:50%;background:${statusColors[s]}20;display:flex;align-items:center;justify-content:center">
                        <i class="fas fa-${statusIcons[s]}" style="color:${statusColors[s]};font-size:16px"></i>
                    </div>
                    <div style="flex:1">
                        <div style="font-weight:700;font-size:14px;color:#1e293b">${statusLabels[s]}</div>
                        <div style="font-size:11px;color:#94a3b8">${s === 'pending' ? 'Aguardando processamento' : s === 'shipped' ? 'Pedido enviado ao cliente' : 'Pedido entregue com sucesso'}</div>
                    </div>
                    ${isCurrent ? '<span style="font-size:11px;font-weight:700;color:' + statusColors[s] + ';background:' + statusColors[s] + '20;padding:3px 8px;border-radius:20px">Atual</span>' : ''}
                </label>
            `;
        }).join('');

        openModal(`Alterar Status — ${order.id}`, `
            <div style="margin-bottom:16px;padding:12px 14px;background:#f8fafc;border-radius:10px;font-size:13px;color:#64748b">
                <strong>${order.customer}</strong> — ${order.product}<br>
                <span>R$ ${order.value.toFixed(2).replace('.', ',')} • ${new Date(order.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div id="statusOptions">
                ${optionsHTML}
            </div>
        `, () => {
            const selected = document.querySelector('input[name="orderStatus"]:checked');
            if (!selected) return;

            const newStatus = selected.value;
            if (newStatus === order.status) {
                closeModal();
                return;
            }

            order.status = newStatus;
            saveAll();
            renderOrders();
            renderDashboard();
            closeModal();
            showToast(`Pedido ${order.id} \u2192 ${statusLabels[newStatus]}`);
        });

        // Add click highlight
        setTimeout(() => {
            document.querySelectorAll('.status-option').forEach(label => {
                label.addEventListener('click', () => {
                    document.querySelectorAll('.status-option').forEach(l => {
                        l.style.borderColor = '#e2e8f0';
                        l.style.background = '';
                    });
                    const radio = label.querySelector('input[type="radio"]');
                    const color = statusColors[radio.value];
                    label.style.borderColor = color;
                    label.style.background = color + '15';
                });
            });
        }, 50);
    };

    // Order filter buttons
    document.querySelectorAll('#sec-orders .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#sec-orders .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderOrders(btn.dataset.filter);
        });
    });

    // ==========================================
    // RENDER CUSTOMERS
    // ==========================================
    function renderCustomers(filter = '') {
        const tbody = document.getElementById('customersBody');
        const countEl = document.getElementById('customerCount');
        if (!tbody) return;

        const filtered = customers.filter(c =>
            c.name.toLowerCase().includes(filter.toLowerCase()) ||
            c.email.toLowerCase().includes(filter.toLowerCase())
        );

        if (countEl) countEl.textContent = `${filtered.length} clientes`;

        tbody.innerHTML = filtered.map(c => `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.email}</td>
                <td><a href="https://wa.me/55${c.phone.replace(/\D/g, '')}" target="_blank" style="color:#25d366;font-weight:600">${c.phone}</a></td>
                <td>${c.orders}</td>
                <td><strong>R$ ${c.total.toFixed(2).replace('.', ',')}</strong></td>
                <td>${new Date(c.lastOrder).toLocaleDateString('pt-BR')}</td>
            </tr>
        `).join('');
    }

    document.getElementById('customerSearch')?.addEventListener('input', (e) => {
        renderCustomers(e.target.value);
    });

    // ==========================================
    // RENDER DASHBOARD
    // ==========================================
    function renderDashboard() {
        // Stats
        const ordersEl = document.getElementById('statOrders');
        const revenueEl = document.getElementById('statRevenue');
        const productsEl = document.getElementById('statProducts');
        const ratingEl = document.getElementById('statRating');

        if (ordersEl) ordersEl.textContent = orders.length;
        if (productsEl) productsEl.textContent = products.filter(p => p.status === 'active').length;

        const totalRevenue = orders.reduce((sum, o) => sum + o.value, 0);
        if (revenueEl) revenueEl.textContent = `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

        const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1) : '0';
        if (ratingEl) ratingEl.textContent = avgRating;

        // Top products
        const topList = document.getElementById('topProductsList');
        if (topList) {
            const sorted = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
            topList.innerHTML = sorted.map((p, i) => `
                <div class="top-product-item">
                    <div class="top-product-rank">${i + 1}</div>
                    <img src="${p.image}" alt="${p.name}" class="top-product-img">
                    <div class="top-product-info">
                        <strong>${p.name}</strong>
                        <span>R$ ${p.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <span class="top-product-sales">${p.sales} vendas</span>
                </div>
            `).join('');
        }

        // Recent orders
        const recentList = document.getElementById('recentOrdersList');
        if (recentList) {
            const recent = orders.slice(0, 5);
            recentList.innerHTML = recent.map(o => `
                <div class="recent-order-item">
                    <div class="order-avatar">${o.initials}</div>
                    <div class="order-info">
                        <strong>${o.customer}</strong>
                        <span>${o.product} • ${new Date(o.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <span class="order-amount">R$ ${o.value.toFixed(2).replace('.', ',')}</span>
                </div>
            `).join('');
        }
    }

    // ==========================================
    // SETTINGS (with localStorage persistence)
    // ==========================================
    const DEFAULT_SETTINGS = {
        store: {
            name: 'B10 Mantos',
            slogan: 'A Elite das Camisas de Futebol',
            cnpj: 'XX.XXX.XXX/0001-XX',
            email: 'bruno.teles2@icloud.com',
            whatsapp: '5511954555972',
            instagram: '@b10mantos'
        },
        shipping: {
            freeShipping: 299.90,
            pixDiscount: 5,
            maxInstallments: 2,
            newsletterCoupon: 'B10OFF10',
            couponDiscount: 10
        },
        appearance: {
            primaryColor: '#ff4500',
            announcementText: '🔥 LANÇAMENTO: Novas camisas 2025/2026 disponíveis!\n⚡ FRETE GRÁTIS acima de R$ 299,90\n💳 Parcele em até 2x sem juros',
            heroTitle1: 'Vista o Seu Manto Sagrado',
            heroTitle2: 'Até 13% OFF em Camisas Selecionadas'
        }
    };

    let settings = DB.get('settings', DEFAULT_SETTINGS);

    // Ensure all keys exist (backwards compat)
    if (!settings.store) settings.store = DEFAULT_SETTINGS.store;
    if (!settings.shipping) settings.shipping = DEFAULT_SETTINGS.shipping;
    if (!settings.appearance) settings.appearance = DEFAULT_SETTINGS.appearance;

    function saveSettings() {
        DB.set('settings', settings);
    }

    // Load settings into form fields
    function loadSettingsUI() {
        // Store
        const s = settings.store;
        setVal('storeName', s.name);
        setVal('storeSlogan', s.slogan);
        setVal('storeCNPJ', s.cnpj);
        setVal('storeEmail', s.email);
        setVal('storeWhatsApp', s.whatsapp);
        setVal('storeInstagram', s.instagram);

        // Shipping
        const sh = settings.shipping;
        setVal('freeShipping', sh.freeShipping);
        setVal('pixDiscount', sh.pixDiscount);
        setVal('maxInstallments', sh.maxInstallments);
        setVal('newsletterCoupon', sh.newsletterCoupon);
        setVal('couponDiscount', sh.couponDiscount);

        // Appearance
        const ap = settings.appearance;
        setVal('primaryColor', ap.primaryColor);
        setVal('announcementText', ap.announcementText);
        setVal('heroTitle1', ap.heroTitle1);
        setVal('heroTitle2', ap.heroTitle2);
        const colorHex = document.getElementById('colorHex');
        if (colorHex) colorHex.textContent = ap.primaryColor;

        // Security
        setVal('adminUser', credentials.user);

        // Avatar preview in settings
        loadSettingsAvatar();
    }

    function setVal(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value ?? '';
    }

    function getVal(id) {
        return document.getElementById(id)?.value ?? '';
    }

    // Store form
    document.getElementById('settingsStoreForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = getVal('storeName').trim();
        if (!name) { showToast('Nome da loja é obrigatório', 'error'); return; }

        settings.store = {
            name,
            slogan: getVal('storeSlogan'),
            cnpj: getVal('storeCNPJ'),
            email: getVal('storeEmail'),
            whatsapp: getVal('storeWhatsApp'),
            instagram: getVal('storeInstagram')
        };
        saveSettings();
        showToast('Dados da loja salvos com sucesso!');
    });

    // Shipping form
    document.getElementById('settingsShippingForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        settings.shipping = {
            freeShipping: parseFloat(getVal('freeShipping')) || 0,
            pixDiscount: parseInt(getVal('pixDiscount')) || 0,
            maxInstallments: parseInt(getVal('maxInstallments')) || 1,
            newsletterCoupon: getVal('newsletterCoupon').trim().toUpperCase(),
            couponDiscount: parseInt(getVal('couponDiscount')) || 0
        };
        saveSettings();
        showToast('Configurações de frete e pagamento salvas!');
    });

    // Appearance form
    document.getElementById('settingsAppearanceForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        settings.appearance = {
            primaryColor: getVal('primaryColor'),
            announcementText: getVal('announcementText'),
            heroTitle1: getVal('heroTitle1'),
            heroTitle2: getVal('heroTitle2')
        };
        saveSettings();
        showToast('Configurações de aparência salvas!');
    });

    document.getElementById('primaryColor')?.addEventListener('input', (e) => {
        document.getElementById('colorHex').textContent = e.target.value;
    });

    // Security form
    document.getElementById('settingsSecurityForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = getVal('adminUser').trim();
        const newPass = getVal('newPassword');
        const confirmPass = getVal('confirmPassword');

        if (!newUser) { showToast('Usuário é obrigatório', 'error'); return; }
        if (newPass && newPass.length < 4) { showToast('Senha deve ter pelo menos 4 caracteres', 'error'); return; }
        if (newPass && newPass !== confirmPass) { showToast('Senhas não coincidem', 'error'); return; }

        credentials.user = newUser;
        if (newPass) credentials.pass = newPass;
        DB.set('credentials', credentials);

        // Clear password fields
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        showToast('Credenciais atualizadas com sucesso!');
    });

    // Avatar upload in settings
    document.getElementById('avatarUpload')?.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { showToast('Selecione uma imagem válida', 'error'); return; }
        if (file.size > 1024 * 1024) { showToast('Imagem muito grande. Máximo: 1MB', 'error'); return; }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const MAX = 200;
                let w = img.width, h = img.height;
                if (w > MAX || h > MAX) {
                    if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                    else { w = Math.round(w * MAX / h); h = MAX; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/webp', 0.85);
                saveAdminPhoto(dataUrl);
                // Update settings page avatar too
                const settingsAvatar = document.getElementById('settingsAvatar');
                if (settingsAvatar) settingsAvatar.innerHTML = `<img src="${dataUrl}" alt="Admin" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Load settings avatar preview
    function loadSettingsAvatar() {
        const savedPhoto = DB.get('adminPhoto', null);
        const settingsAvatar = document.getElementById('settingsAvatar');
        if (settingsAvatar && savedPhoto) {
            settingsAvatar.innerHTML = `<img src="${savedPhoto}" alt="Admin" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        }
    }

    // ==========================================
    // ADMIN AVATAR
    // ==========================================
    function loadAdminAvatar() {
        const avatar = document.getElementById('adminAvatar');
        if (!avatar) return;
        const savedPhoto = DB.get('adminPhoto', null);
        const greeting = document.querySelector('.admin-greeting strong');
        if (greeting) greeting.textContent = credentials.user.charAt(0).toUpperCase() + credentials.user.slice(1);
        if (savedPhoto) {
            avatar.innerHTML = `<img src="${savedPhoto}" alt="Admin" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        } else {
            const initials = credentials.user.substring(0, 2).toUpperCase();
            avatar.textContent = initials;
        }
    }

    function saveAdminPhoto(dataUrl) {
        try {
            DB.set('adminPhoto', dataUrl);
            loadAdminAvatar();
            showToast('Foto de perfil atualizada!');
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.code === 22) {
                showToast('Imagem muito grande para localStorage. Tente uma menor.', 'error');
            }
        }
    }

    // ==========================================
    // RENDER ALL
    // ==========================================
    function renderAll() {
        renderDashboard();
        renderProducts();
        renderReviews();
        renderOrders();
        renderCustomers();
        loadSettingsUI();
        loadAdminAvatar();
    }

    renderAll();

    console.log('⚙️ B10 Mantos Admin Panel - Loaded');
});
