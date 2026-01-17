const appState = {
    role: null, // 'admin', 'dosen', 'mahasiswa'
    user: null,
    isLoggedIn: false
};

// Data Simulasi
const studentsData = [
    { id: '1', nama: 'Budi Santoso', ipk: 3.8, status: 'Aman', score: '95%', trend: 'Stabil' },
    { id: '2', nama: 'Siti Aminah', ipk: 2.1, status: 'Waspada', score: '62%', trend: 'Menurun' },
    { id: '3', nama: 'Rian Hidayat', ipk: 1.8, status: 'Kritis', score: '35%', trend: 'Anjlok' }
];

function init() {
    if (!appState.isLoggedIn) {
        renderLogin();
    } else {
        renderDashboard();
    }
}

// 1. HALAMAN LOGIN SSO
function renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-container">
            <div class="login-card">
                <i data-lucide="shield-check" style="width: 48px; height: 48px; color: var(--primary); margin-bottom: 1rem;"></i>
                <h2 style="margin-bottom: 0.5rem;">SmartAcademic SSO</h2>
                <p style="color: #64748b; margin-bottom: 2rem;">Silakan login dengan akun institusi Anda</p>
                <button class="btn btn-primary" onclick="login('dosen', 'Dr. Aris Setiawan')" style="margin-bottom: 0.8rem;">Login sebagai Dosen</button>
                <button class="btn btn-outline" onclick="login('admin', 'Super Admin')" style="width: 100%; margin-bottom: 0.8rem;">Login sebagai Admin</button>
                <button class="btn btn-outline" onclick="login('mahasiswa', 'Rian Hidayat')" style="width: 100%;">Login sebagai Mahasiswa</button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function login(role, name) {
    appState.role = role;
    appState.user = name;
    appState.isLoggedIn = true;
    renderDashboard();
}

function logout() {
    appState.isLoggedIn = false;
    renderLogin();
}

// 2. ROUTER DASHBOARD
function renderDashboard() {
    const app = document.getElementById('app');
    let content = '';

    if (appState.role === 'admin') content = renderAdminView();
    else if (appState.role === 'dosen') content = renderDosenView();
    else content = renderMahasiswaView();

    app.innerHTML = `
        <nav>
            <div style="display: flex; align-items: center; gap: 10px;">
                <i data-lucide="cpu" style="color: var(--primary)"></i>
                <h2 style="font-size: 1.2rem;">SmartAcademic <b>EWS</b></h2>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 0.9rem; color: #64748b;">${appState.user} (${appState.role.toUpperCase()})</span>
                <button class="btn btn-outline" onclick="logout()" style="padding: 0.4rem 0.8rem;">Logout</button>
            </div>
        </nav>
        <div class="content">${content}</div>
    `;
    
    if (appState.role !== 'admin') initCharts();
    lucide.createIcons();
}

// 3. TAMPILAN ADMIN (SIMULASI UPLOAD DATASET)
// 3. TAMPILAN ADMIN (FORM INPUT DATASET & PEMILIHAN MODEL)
function renderAdminView() {
    return `
        <div class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;">
                <i data-lucide="database" style="color: var(--primary)"></i>
                <h3>Antarmuka Pengumpulan Dataset Mahasiswa</h3>
            </div>
            
            <div style="background: #f1f5f9; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Pilih Algoritma Klasifikasi:</label>
                <select id="algoSelect" class="btn btn-outline" style="width: 100%; background: white; margin-bottom: 1rem;">
                    <option value="SVM">Support Vector Machine (SVM) - Terpilih di Perancangan</option>
                    <option value="RandomForest">Random Forest Classifier</option>
                    <option value="NaiveBayes">Naïve Bayes</option>
                </select>

                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Unggah File Dataset (.csv / .xlsx):</label>
                <div class="upload-area" id="dropZone" onclick="document.getElementById('fileInput').click()">
                    <i data-lucide="file-up" style="width: 32px; height: 32px; color: var(--primary); margin-bottom: 0.5rem;"></i>
                    <p id="fileNameDisplay">Klik untuk memilih file dataset mahasiswa</p>
                    <input type="file" id="fileInput" hidden onchange="handleFileSelect(this)">
                </div>
            </div>

            <button class="btn btn-primary" onclick="processAI()">
                <i data-lucide="play" style="width: 16px; height: 16px; display: inline; vertical-align: middle;"></i> 
                Mulai Training Model AI
            </button>
        </div>

        <div id="aiStatus" class="card" style="display: none; border-left: 5px solid var(--success); background: #f0fdf4;">
            <h4 id="statusTitle">Memproses Model...</h4>
            <div style="width: 100%; background: #e2e8f0; height: 10px; border-radius: 5px; margin: 10px 0;">
                <div id="progressBar" style="width: 0%; background: var(--success); height: 100%; border-radius: 5px; transition: 0.5s;"></div>
            </div>
            <p id="statusDesc" style="font-size: 0.85rem; color: #166534;"></p>
        </div>
    `;
}

// Fungsi simulasi interaksi
function handleFileSelect(input) {
    const fileName = input.files[0].name;
    document.getElementById('fileNameDisplay').innerText = "File terpilih: " + fileName;
}

function processAI() {
    const algo = document.getElementById('algoSelect').value;
    const statusDiv = document.getElementById('aiStatus');
    const progressBar = document.getElementById('progressBar');
    const statusDesc = document.getElementById('statusDesc');
    
    statusDiv.style.display = 'block';
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += 25;
        progressBar.style.width = progress + '%';
        
        if(progress === 25) statusDesc.innerText = "Melakukan Pre-processing & Handling Missing Values...";
        if(progress === 50) statusDesc.innerText = `Mengaplikasikan Algoritma ${algo}...`;
        if(progress === 75) statusDesc.innerText = "Validasi Model dengan K-Fold Cross Validation...";
        if(progress === 100) {
            clearInterval(interval);
            statusDesc.innerText = `Model ${algo} berhasil dilatih! Akurasi: 94.2%`;
            document.getElementById('statusTitle').innerText = "Training Selesai ✅";
            alert(`Sukses! Dataset telah diproses menggunakan ${algo}.`);
        }
    }, 800);
}

function simulateUpload() {
    alert("Mengunggah Dataset... Sistem akan melakukan Pre-processing, SMOTE, dan Hyperparameter Tuning secara otomatis[cite: 79, 93].");
}

// 4. TAMPILAN DOSEN
function renderDosenView() {
    return `
        <div class="stats-grid">
            <div class="card"><h3>Total Bimbingan</h3><p style="font-size: 2rem; font-weight: 700;">42</p></div>
            <div class="card"><h3>Berisiko Kritis</h3><p style="font-size: 2rem; font-weight: 700; color: var(--danger);">5</p></div>
            <div class="card" style="grid-column: span 2"><canvas id="riskChart" height="150"></canvas></div>
        </div>
        <div class="card">
            <h3>Daftar Mahasiswa Bimbingan [cite: 65]</h3>
            <table>
                <thead><tr><th>Nama</th><th>IPK</th><th>Status AI</th><th>Aksi</th></tr></thead>
                <tbody>
                    ${studentsData.map(s => `
                        <tr>
                            <td>${s.nama}</td><td>${s.ipk}</td>
                            <td><span class="badge ${s.status === 'Aman' ? 'bg-safe' : s.status === 'Waspada' ? 'bg-warning' : 'bg-danger'}">${s.status}</span></td>
                            <td><button class="btn btn-outline" onclick="alert('Membuka detail Insight AI...')">Detail</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 5. TAMPILAN MAHASISWA
function renderMahasiswaView() {
    const me = studentsData[2]; // Simulasi login sebagai Rian (Kritis)
    return `
        <div class="card" style="margin-bottom: 2rem; text-align: center; border-top: 5px solid var(--danger);">
            <h2 style="color: var(--danger)">Status Akademik: ${me.status}</h2>
            <p>Berdasarkan analisis AI, performa Anda memerlukan perhatian segera[cite: 26].</p>
        </div>
        <div class="stats-grid">
            <div class="card"><h3>IPK Saat Ini</h3><p style="font-size: 2rem; font-weight: 700;">${me.ipk}</p></div>
            <div class="card"><h3>Prediksi Kelulusan</h3><p style="font-size: 1.5rem; font-weight: 700; color: var(--warning);">Terlambat (Sms 10+)</p></div>
        </div>
        <div class="card" style="background: #fff7ed;">
            <h3>Saran AI (Personalized Tutoring) [cite: 19]</h3><br>
            <ul style="padding-left: 1.5rem; line-height: 1.8;">
                <li>Tingkatkan kehadiran pada mata kuliah "Algoritma" (Sekarang: 40%).</li>
                <li>Ikuti sesi bimbingan tambahan dengan Dosen Pembimbing minggu ini.</li>
                <li>Fokus pada perbaikan nilai di semester ini untuk menghindari status Drop Out.</li>
            </ul>
        </div>
    `;
}

function initCharts() {
    const ctx = document.getElementById('riskChart')?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lulus Tepat', 'Terlambat', 'Drop Out'],
            datasets: [{ label: 'Distribusi Prediksi AI', data: [25, 12, 5], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Jalankan aplikasi
init();