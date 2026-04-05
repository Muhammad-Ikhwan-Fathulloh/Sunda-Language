<div align="center"><h1><img src="https://www.google.com/search?q=https://img.shields.io/badge/Sunda-Language-6d28d9%3Fstyle%3Dfor-the-badge%26logo%3Dcodeproject%26logoColor%3Dwhite" alt="Sunda Language Badge" />ᮞᮥᮔ᮪ᮓ ᮜᮔ᮪ᮌᮥᮃᮌᮨ 🌺</h1><p><b>Sampurasun! 🙏</b></p><p><i>"Ngarumat Budaya ku Teknologi"</i></p><p><b>Sunda Language</b> adalah bahasa pemrograman <i>interpreted</i> yang dirancang khusus dengan sintaksis berbasis Bahasa Sunda. Proyek ini bertujuan untuk memperkenalkan logika pemrograman melalui pendekatan kearifan lokal (Nusantara).</p><a href="https://sunda-language.netlify.app/"><img src="https://www.google.com/search?q=https://img.shields.io/badge/Situs_Resmi-6d28d9%3Fstyle%3Dflat-square%26logo%3Dgoogle-chrome%26logoColor%3Dwhite" alt="Website" /></a><a href="https://sunda-language.netlify.app/playground"><img src="https://www.google.com/search?q=https://img.shields.io/badge/Playground-f59e0b%3Fstyle%3Dflat-square%26logo%3Dgoogle-play%26logoColor%3Dwhite" alt="Playground" /></a><a href="https://sunda-language.netlify.app/aksara"><img src="https://www.google.com/search?q=https://img.shields.io/badge/Versi_Aksara-10b981%3Fstyle%3Dflat-square%26logo%3Dpencipta%26logoColor%3Dwhite" alt="Aksara" /></a></div>🚀 Fitur Utama🗣️ Sintaksis Akrab: Menggunakan kata kerja dan instruksi dalam Bahasa Sunda (Lemes & Loma).🛠️ Full Featured: Mendukung variabel, fungsi, pengkondisian, perulangan, hingga OOP (Class).🛡️ Error Handling: Mekanisme coba-cekel (try-catch) yang intuitif.🎨 Tooling: Tersedia ekstensi VS Code untuk syntax highlighting.📥 Instalasi (ᮄᮔ᮪ᮞ᮪ᮒᮜᮞᮤ)Cara 1: Install via pip (Direkomendasikan)pip install -e .
Lajeng jalankeun:sunda examples/hello_world.sunda
Cara 2: Jalankan manual via PythonPastikan Anda berada di direktori root proyek:python src/main.py examples/program_simpel.sunda
💻 Panduan Sintaksis (ᮞᮤᮔ᮪ᮒᮊ᮪ᮞ᮪)1. Tipe Data & VariabelSunda Language mendukung tipe data Dinamis:nyieun nami = "Asep";         # String
nyieun umur = 25;              # Angka
nyieun mahasiswa = leres;      # Boolean (leres/lepat)
nyieun data = kosong;          # Null (kosong)
2. Struktur Kontrol (Upami & Perulangan)# Pengkondisian
upami umur >= 17:
    tampilkeun "Atos tiasa gaduh KTP";
lainna:
    tampilkeun "Teu acan tiasa";
anggeus

# Perulangan (Pikeun)
pikeun i = 1 ti 5 ngajalankeun
    tampilkeun "Iterasi ka: " + i;
anggeus
3. Pungsi (Fungsi)pungsi sapa(nami):
    balikkeun "Wilujeng sumping, " + nami;
anggeus

tampilkeun sapa("Baraya");
4. OOP (Kelas)kelas Jalma:
    pungsi __mimitian__(nami):
        ieu.nami = nami;
    anggeus

    pungsi sebatNami():
        tampilkeun "Nami simkuring nyaeta " + ieu.nami;
    anggeus
anggeus

nyieun asep = anyar Jalma("Asep");
asep.sebatNami();
📖 Kamus Keyword (ᮊᮤᮝᮧᮁᮓ᮪)KeywordSinonimPadanan Inggrisnyieunngadeklarasikeunvar / lettampilkeun-print / console.logupami-iflamun-else iflainnalain lamunelsepikeun-forbari-whilepungsi-functionbalikkeun-returncoba-trycekel-catchanyar-newieu-this / self🛠️ Operator & Konstanta<table width="100%"><tr><td width="30%"><b>Logika</b></td><td><code>jeung</code> (AND), <code>atawa</code> (OR), <code>lain</code> (NOT)</td></tr><tr><td><b>Boolean</b></td><td><code>leres</code> (True), <code>lepat</code> (False)</td></tr><tr><td><b>Aritmatika</b></td><td><code>+</code> <code>-</code> <code>*</code> <code>/</code> <code>%</code></td></tr></table>📂 Struktur Proyek.
├── src/                # Kode sumber Interpreter
│   ├── lexer.py        # Analisis leksikal
│   ├── parser.py       # Analisis sintaksis
│   └── interpreter.py  # Eksekusi kode
├── examples/           # Contoh program (.sunda)
├── sunda-vscode/       # Plugin VS Code
├── setup.py            # Konfigurasi instalasi PIP
└── README.md           # Dokumentasi
🤝 Kontribusi (ᮊᮧᮔ᮪ᮒᮢᮤᮘᮥᮞᮤ)Kami nampi pisan kontribusi ti sadayana pikeun ngembangkeun basa ieu!Fork repositori ieu.Buat cabang (git checkout -b fitur-anyar).Commit parobahan (git commit -m 'Nambahkeun fitur anyar').Push (git push origin fitur-anyar).Pull Request.<div align="center"><p><i>Proyek ini dilisensikan di bawah <b>MIT License</b></i></p><p><b>Hatur nuhun pisan! Mugia mangpaat kanggo urang sadayana! 🙏😊</b></p><p>Sunda Language Team - 2024</p></div>