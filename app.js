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
    if (appState.role === 'dosen') initCharts();
    if (appState.role === 'mahasiswa') initStudentChart(); // Tambahkan baris ini
    lucide.createIcons();
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
// 4. TAMPILAN DOSEN (DIPERBARUI)
function renderDosenView() {
    return `
        <div class="stats-grid">
            <div class="card"><h3>Total Bimbingan</h3><p style="font-size: 2rem; font-weight: 700;">42</p></div>
            <div class="card"><h3>Berisiko Kritis</h3><p style="font-size: 2rem; font-weight: 700; color: var(--danger);">5</p></div>
            <div class="card" style="grid-column: span 2"><canvas id="riskChart" height="150"></canvas></div>
        </div>
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Daftar Mahasiswa Bimbingan</h3>
                <span style="font-size: 0.8rem; color: #64748b;">Algoritma Aktif: <b>SVM</b></span>
            </div>
            <table>
                <thead><tr><th>Nama</th><th>IPK</th><th>Status AI</th><th>Aksi</th></tr></thead>
                <tbody>
                    ${studentsData.map(s => `
                        <tr>
                            <td>${s.nama}</td><td>${s.ipk}</td>
                            <td><span class="badge ${s.status === 'Aman' ? 'bg-safe' : s.status === 'Waspada' ? 'bg-warning' : 'bg-danger'}">${s.status}</span></td>
                            <td><button class="btn btn-outline" onclick="viewAIDetail('${s.id}')">
                                <i data-lucide="brain-circuit" style="width:14px; vertical-align:middle;"></i> Detail AI
                            </button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 5. FUNGSI BARU: VISUALISASI OUTPUT AI (DETAIL INSIGHT)
function viewAIDetail(id) {
    const s = studentsData.find(x => x.id === id);
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <nav>
            <button class="btn btn-outline" onclick="renderDashboard()">← Kembali ke Daftar</button>
            <h2 style="font-size: 1.1rem;">AI Decision Support: ${s.nama}</h2>
        </nav>
        <div class="content">
            <div class="stats-grid">
                <div class="card" style="grid-column: span 2;">
                    <h3>Visualisasi Output AI (Radar Chart)</h3>
                    <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1rem;">Perbandingan fitur mahasiswa terhadap rata-rata lulus tepat waktu.</p>
                    <div style="height: 300px;"><canvas id="aiRadarChart"></canvas></div>
                </div>

                <div class="card">
                    <h3>Hasil Prediksi AI</h3>
                    <div style="text-align: center; padding: 1.5rem 0;">
                        <div style="font-size: 0.8rem; color: #64748b;">Probabilitas ${s.status}</div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: ${s.status === 'Aman' ? 'var(--success)' : 'var(--danger)'}">${s.score}</div>
                        <p>Status: <b>${s.status.toUpperCase()}</b></p>
                    </div>
                    <div class="ai-insight" style="background: #f8fafc; border-left-color: var(--primary);">
                        <small><b>Faktor Dominan (SVM Weight):</b></small>
                        <ul style="font-size: 0.8rem; margin-top: 5px; padding-left: 15px;">
                            <li>Kehadiran Kumulatif (-0.45)</li>
                            <li>SKS Lulus Semester 1-4 (-0.38)</li>
                            <li>IPK Terakhir (+0.12)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>Rekomendasi Intervensi Dosen</h3>
                <p style="margin: 10px 0; color: #475569;">Berdasarkan pola data, mahasiswa ini memerlukan:</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <span class="badge bg-warning">Konseling Akademik</span>
                    <span class="badge bg-danger">Evaluasi SKS Terlambat</span>
                    <span class="badge bg-safe">Pendampingan Peer-Review</span>
                </div>
                <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e2e8f0;">
                <button class="btn btn-primary" onclick="alert('Rencana Intervensi Terkirim ke Mahasiswa!')">Kirim Feedback ke Mahasiswa</button>
            </div>
        </div>
    `;

    // Inisialisasi Radar Chart untuk Detail AI
    const ctx = document.getElementById('aiRadarChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Kehadiran', 'IPK', 'SKS Lulus', 'Keaktifan', 'Lama Studi'],
            datasets: [{
                label: s.nama,
                data: s.status === 'Aman' ? [90, 85, 95, 70, 90] : [40, 50, 45, 30, 40],
                fill: true,
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderColor: 'var(--primary)',
                pointBackgroundColor: 'var(--primary)',
            }, {
                label: 'Rata-rata Lulus Tepat Waktu',
                data: [85, 80, 85, 75, 80],
                fill: true,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'var(--success)',
                pointBackgroundColor: 'var(--success)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { r: { suggestMin: 0, suggestMax: 100 } }
        }
    });
    lucide.createIcons();
}

// 5. TAMPILAN MAHASISWA (VERSI KOMPLEKS & ANALITIK)
function renderMahasiswaView() {
    const me = studentsData[2]; // Simulasi sebagai Rian Hidayat (Status Kritis)
    
    return `
        <div class="card" style="margin-bottom: 1.5rem; border-left: 8px solid var(--danger); background: #fff1f2;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="color: #991b1b; margin-bottom: 5px;">Peringatan Dini Akademik</h2>
                    <p style="color: #b91c1c;">Sistem AI mendeteksi risiko tinggi pada kelulusan Anda. Segera lakukan konsultasi.</p>
                </div>
                <div style="text-align: right;">
                    <span class="badge bg-danger" style="font-size: 1.2rem; padding: 0.5rem 1.5rem;">STATUS: ${me.status.toUpperCase()}</span>
                </div>
            </div>
        </div>

        <div class="stats-grid">
            <div class="card">
                <h3 style="font-size: 0.9rem; color: #64748b;">IPK SAAT INI</h3>
                <p style="font-size: 2.2rem; font-weight: 800; color: var(--dark);">${me.ipk}</p>
                <span style="color: var(--danger); font-size: 0.8rem;">▼ 0.2 dari semester lalu</span>
            </div>
            
            <div class="card">
                <h3 style="font-size: 0.9rem; color: #64748b;">PREDIKSI KELULUSAN</h3>
                <p style="font-size: 1.8rem; font-weight: 800; color: var(--warning);">Semester 12</p>
                <span style="color: #64748b; font-size: 0.8rem;">Target Institusi: Semester 8</span>
            </div>

            <div class="card" style="grid-column: span 2;">
                <h3>Analisis Gap Performa (AI Insight)</h3>
                <div style="height: 250px;"><canvas id="studentRadarChart"></canvas></div>
            </div>
        </div>

        <div class="stats-grid" style="margin-top: 1.5rem;">
            <div class="card" style="grid-column: span 2;">
                <h3>Rencana Aksi Perbaikan (Personalized Tutoring)</h3>
                <div style="margin-top: 1rem;">
                    <div style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 1rem; padding: 10px; background: #f8fafc; border-radius: 8px;">
                        <i data-lucide="alert-circle" style="color: var(--warning)"></i>
                        <div>
                            <p style="font-weight: 600;">Prioritas 1: Perbaikan Kehadiran</p>
                            <p style="font-size: 0.85rem; color: #64748b;">Kehadiran Anda di Matakuliah "Basis Data" saat ini 45%. Naikkan ke 75% untuk menghindari auto-fail.</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 1rem; padding: 10px; background: #f8fafc; border-radius: 8px;">
                        <i data-lucide="book-open" style="color: var(--primary)"></i>
                        <div>
                            <p style="font-weight: 600;">Prioritas 2: Pemenuhan SKS</p>
                            <p style="font-size: 0.85rem; color: #64748b;">Anda tertinggal 12 SKS dari peta jalan kurikulum. Disarankan mengambil semester pendek.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>Bantuan & Dukungan</h3>
                <p style="font-size: 0.85rem; color: #64748b; margin: 10px 0;">Hubungi dosen pembimbing Anda untuk mendiskusikan hasil prediksi ini.</p>
                <button class="btn btn-primary" style="margin-bottom: 10px;" onclick="alert('Permintaan bimbingan dikirim ke Dr. Aris Setiawan')">Jadwalkan Bimbingan</button>
                <button class="btn btn-outline" style="width: 100%;">Unduh Draft Rencana Studi</button>
            </div>
        </div>
    `;
}

// Tambahkan inisialisasi grafik khusus mahasiswa di dalam fungsi initCharts atau buat fungsi baru
function initStudentChart() {
    const ctx = document.getElementById('studentRadarChart')?.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Kehadiran', 'Nilai Tugas', 'Nilai Ujian', 'Keaktifan', 'Kesesuaian SKS'],
            datasets: [{
                label: 'Performa Anda',
                data: [45, 60, 40, 30, 50],
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'var(--danger)',
                pointBackgroundColor: 'var(--danger)',
            }, {
                label: 'Standar Kelulusan Tepat Waktu',
                data: [85, 80, 80, 75, 90],
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'var(--success)',
                pointBackgroundColor: 'var(--success)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { r: { suggestMin: 0, suggestMax: 100 } }
        }
    });
}

// Pastikan fungsi initCharts memanggil initStudentChart
// Perbarui fungsi renderDashboard untuk memanggil initStudentChart jika role adalah mahasiswa

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

