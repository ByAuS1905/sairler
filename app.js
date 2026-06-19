// Hasan Aybaba Anadolu Lisesi - Şairlerimiz Karekod Projesi
// Uygulama Mantığı ve Karekod Motoru

let allPoets = [];
let currentPeriodFilter = 'all';
let searchQuery = '';

const SETTINGS_KEY = 'poet_project_settings';

// 1. Tema Ayarları (Gece / Gündüz)
function initTheme() {
    const savedTheme = localStorage.getItem('poet-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeIcon('dark');
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon('light');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('poet-theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark ? 'dark' : 'light');
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    if (theme === 'dark') {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    } else {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    }
}

// 2. Sistem Ayarları Yönetimi
function getSettings() {
    // Varsayılan canlı klasör yolu (yerelde çalışırken kendi klasörü)
    const defaultUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '') + '/';
    const defaults = {
        baseUrl: defaultUrl,
        target: 'direct' // Varsayılan olarak doğrudan PDF linkini ('direct') seçtik, mobilde en sorunsuz çalışan yöntemdir.
    };
    
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
        try {
            return { ...defaults, ...JSON.parse(saved) };
        } catch (e) {
            return defaults;
        }
    }
    return defaults;
}

function saveSettings() {
    const domainInput = document.getElementById('settings-domain').value.trim();
    const targetSelect = document.getElementById('settings-target').value;
    
    if (!domainInput) {
        showToast("Lütfen geçerli bir URL girin.", "error");
        return;
    }
    
    // URL'nin sonuna eğik çizgi ekle
    let cleanUrl = domainInput;
    if (!cleanUrl.endsWith('/')) {
        cleanUrl += '/';
    }
    
    const settings = {
        baseUrl: cleanUrl,
        target: targetSelect
    };
    
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    showToast("Ayarlar başarıyla kaydedildi!");
    
    // Admin listesindeki linkleri / karekodları güncelle
    renderAdminTable();
}

// 3. Yönlendirme Linki Oluşturucu
function getRedirectionUrl(poet) {
    const settings = getSettings();
    if (settings.target === 'direct') {
        // Doğrudan PDF dosyasına yönlendirme yap (YENİ PENCEREDE DOSYA AÇIMI İÇİN EN UYGUNDUR)
        return `${settings.baseUrl}pdfs/${poet.pdfFile}`;
    } else {
        // İndis sayfası üzerinden parametreli linke yönlendir
        return `${settings.baseUrl}index.html?poet=${poet.id}`;
    }
}

// 4. Veritabanı Yükleme
async function loadPoetData() {
    try {
        const res = await fetch('poets.json');
        if (!res.ok) throw new Error("Dosya okunamadı.");
        allPoets = await res.json();
    } catch (e) {
        console.error("Şair listesi yüklenemedi:", e);
        allPoets = [];
    }
}

// 5. Sekmeler Arası Geçiş
function switchTab(tabName) {
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.tab-nav-btn').forEach(btn => btn.classList.remove('active'));
    
    if (tabName === 'catalog') {
        document.getElementById('tab-catalog').classList.add('active');
        document.querySelector('[onclick="switchTab(\'catalog\')"]').classList.add('active');
        renderCatalog();
    } else if (tabName === 'admin') {
        document.getElementById('tab-admin').classList.add('active');
        document.querySelector('[onclick="switchTab(\'admin\')"]').classList.add('active');
        renderAdminTable();
    }
}

// 6. Şair Dönemlerini Çıkarma ve Filtreleri Çizme
function renderPeriodFilters() {
    const container = document.getElementById('filter-container');
    const defaultBtn = container.querySelector('[data-period="all"]');
    container.innerHTML = '';
    container.appendChild(defaultBtn);
    
    const periods = [...new Set(allPoets.map(p => p.period))];
    periods.forEach(period => {
        const btn = document.createElement('button');
        btn.className = 'filter-chip';
        btn.setAttribute('data-period', period);
        btn.textContent = period;
        container.appendChild(btn);
    });
}

// 7. Şair Kataloğu Grid Görünümünü Çizme
function renderCatalog() {
    const grid = document.getElementById('poet-grid');
    grid.innerHTML = '';
    
    const filtered = allPoets.filter(poet => {
        const matchesPeriod = currentPeriodFilter === 'all' || poet.period === currentPeriodFilter;
        const matchesSearch = poet.name.toLowerCase().includes(searchQuery) || 
                              poet.period.toLowerCase().includes(searchQuery) ||
                              poet.description.toLowerCase().includes(searchQuery);
        return matchesPeriod && matchesSearch;
    });
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1rem; opacity:0.6;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
                <p style="font-weight:600; font-size:1.1rem;">Aradığınız şair bulunamadı.</p>
                <p style="font-size:0.9rem; margin-top:5px;">Lütfen farklı kelimelerle arama yapın.</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(poet => {
        const card = document.createElement('div');
        card.className = 'poet-card';
        card.innerHTML = `
            <div class="poet-period">${poet.period}</div>
            <h3 class="poet-name">${poet.name}</h3>
            <p class="poet-desc">${poet.description}</p>
            <div class="poet-actions">
                <span class="poet-file-info" title="${poet.pdfFile}">📄 ${poet.pdfFile}</span>
                <div style="display:flex; gap:8px;">
                    <button class="poet-btn-qr" title="Karekodu Gör" onclick="openQrModal('${poet.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="10" height="10" x="3" y="3" rx="2"/><rect width="10" height="10" x="11" y="11" rx="2"/><path d="M3 17h6"/><path d="M17 3h6"/><path d="M17 8h6"/><path d="M17 13h1"/><path d="M22 13h1"/><path d="M13 17h1"/><path d="M13 22h1"/><path d="M8 21H3"/><path d="M8 17H7"/><path d="M7 22H3"/><path d="M17 17h6v5h-6z"/></svg>
                    </button>
                    <!-- YENİ SEKMEDE PDF AÇMAK İÇİN DOĞRUDAN ANCHOR BAĞLANTISI KULLANILDI -->
                    <a href="pdfs/${poet.pdfFile}" target="_blank" class="poet-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        PDF'i Oku
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 8. Tekli Karekod Önizleme Modalı
function openQrModal(poetId) {
    const poet = allPoets.find(p => p.id === poetId);
    if (!poet) return;
    
    document.getElementById('qr-modal-name').textContent = poet.name;
    document.getElementById('qr-modal-period').textContent = poet.period;
    
    const holder = document.getElementById('qr-canvas-holder');
    holder.innerHTML = '<canvas id="single-qr-canvas"></canvas>';
    
    const qrUrl = getRedirectionUrl(poet);
    const canvas = document.getElementById('single-qr-canvas');
    
    QRCode.toCanvas(canvas, qrUrl, {
        width: 170,
        margin: 1,
        color: {
            dark: '#1e3a8a',
            light: '#ffffff'
        }
    }, (err) => {
        if (err) console.error("Karekod çizim hatası:", err);
    });
    
    // Link kopyalama butonu
    const copyBtn = document.getElementById('qr-modal-copy-btn');
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(qrUrl);
        showToast("Bağlantı adresi kopyalandı!");
    };
    
    // Tekli basım butonu
    const printBtn = document.getElementById('qr-modal-print-btn');
    printBtn.onclick = () => {
        printSingleQrLabel(poet);
    };
    
    document.getElementById('qr-modal').classList.add('active');
}

function closeQrModal() {
    document.getElementById('qr-modal').classList.remove('active');
}

// Tek Bir Karekod Etiketini Yazdırma
function printSingleQrLabel(poet) {
    const qrUrl = getRedirectionUrl(poet);
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>${poet.name} - Karekod Etiket</title>
            <style>
                body {
                    font-family: 'Inter', system-ui, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #ffffff;
                }
                .label-box {
                    border: 2px dashed #000000;
                    padding: 15px;
                    width: 300px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-radius: 6px;
                }
                .info {
                    flex-grow: 1;
                }
                .school {
                    font-size: 9px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #555555;
                    border-bottom: 1px solid #000;
                    padding-bottom: 2px;
                    margin-bottom: 5px;
                }
                .title {
                    font-family: Georgia, serif;
                    font-size: 14px;
                    font-weight: bold;
                    color: #000;
                }
                .period {
                    font-size: 11px;
                    font-style: italic;
                    color: #444;
                }
                .qr-wrapper {
                    width: 85px;
                    height: 85px;
                }
            </style>
        </head>
        <body>
            <div class="label-box">
                <div class="info">
                    <div class="school">Hasan Aybaba Anadolu Lisesi</div>
                    <div class="title">${poet.name}</div>
                    <div class="period">${poet.period}</div>
                </div>
                <div class="qr-wrapper">
                    <canvas id="p-canvas"></canvas>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js"><\/script>
            <script>
                window.onload = function() {
                    const canvas = document.getElementById('p-canvas');
                    QRCode.toCanvas(canvas, "${qrUrl}", {
                        width: 85,
                        margin: 1
                    }, function() {
                        window.print();
                        setTimeout(() => window.close(), 500);
                    });
                }
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// 9. Admin Listesi Tablosunu Doldurma
function renderAdminTable() {
    const tbody = document.getElementById('print-table-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    allPoets.forEach(poet => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="checkbox-col">
                <input type="checkbox" class="poet-print-checkbox" data-id="${poet.id}" checked>
            </td>
            <td><strong>${poet.name}</strong></td>
            <td><span class="filter-chip" style="font-size:0.75rem; padding:2px 8px; cursor:default;">${poet.period}</span></td>
            <td><code style="font-size:0.8rem; color:var(--accent);">${poet.pdfFile}</code></td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleAllCheckboxes(checkedState) {
    document.querySelectorAll('.poet-print-checkbox').forEach(cb => cb.checked = checkedState);
}

// 10. Toplu A4 Karekod Çıktısı Alma Motoru
async function printSelectedQrs() {
    const checkedBoxes = document.querySelectorAll('.poet-print-checkbox:checked');
    const selectedIds = Array.from(checkedBoxes).map(cb => cb.getAttribute('data-id'));
    
    if (selectedIds.length === 0) {
        showToast("Lütfen yazdırılacak şairleri seçin.", "error");
        return;
    }
    
    const output = document.getElementById('print-grid-output');
    output.innerHTML = ''; // Temizle
    
    // Her seçilen şair için çıktı etiket hücresi oluştur
    for (const id of selectedIds) {
        const poet = allPoets.find(p => p.id === id);
        if (!poet) continue;
        
        const cell = document.createElement('div');
        cell.className = 'print-sticker-card';
        cell.innerHTML = `
            <div class="sticker-info">
                <div class="sticker-school">H.A.A.L. Edebiyat Projesi</div>
                <div class="sticker-poet">${poet.name}</div>
                <div class="sticker-period">${poet.period}</div>
            </div>
            <div class="sticker-qr-holder">
                <canvas id="sticker-canvas-${poet.id}"></canvas>
            </div>
        `;
        output.appendChild(cell);
        
        // Karekodu çiz
        const canvas = document.getElementById(`sticker-canvas-${poet.id}`);
        const qrUrl = getRedirectionUrl(poet);
        
        // Eşzamanlı çizimi bekle (canvas genişliği ayarla)
        await new Promise((resolve) => {
            QRCode.toCanvas(canvas, qrUrl, {
                width: 75,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }, () => resolve());
        });
    }
    
    // Yazdır
    window.print();
}

// 11. Bildirim Sistemi
function showToast(msg, type = 'success') {
    let t = document.getElementById('app-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'app-toast';
        t.className = 'toast';
        document.body.appendChild(t);
    }
    t.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        <span>${msg}</span>
    `;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// DOM Yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
    // Temayı Yükle
    initTheme();
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
    
    // Ayarları form alanına doldur
    const settings = getSettings();
    document.getElementById('settings-domain').value = settings.baseUrl;
    document.getElementById('settings-target').value = settings.target;
    
    // Şair verisini çek
    await loadPoetData();
    
    // Kataloğu ve filtreleri hazırla
    renderPeriodFilters();
    renderCatalog();
    
    // Arama ve filtre dinleyicileri
    document.getElementById('search-input').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderCatalog();
    });
    
    document.getElementById('filter-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-chip')) {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            currentPeriodFilter = e.target.getAttribute('data-period');
            renderCatalog();
        }
    });
});

// Modalların dışına tıklayınca kapanma desteği
window.onclick = function(event) {
    const qrModal = document.getElementById('qr-modal');
    if (event.target === qrModal) {
        closeQrModal();
    }
};
