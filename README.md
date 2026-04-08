<div align="center">
<h1><img src="https://img.shields.io/badge/Sunda-Language-6d28d9?style=for-the-badge&logo=codeproject&logoColor=white" alt="Sunda Language Badge" align="middle" /> ᮞᮥᮔ᮪ᮓ ᮜᮔ᮪ᮌᮥᮃᮌᮨ 🌺</h1>
<p><b>Sampurasun! 🙏</b></p>
<p><i>"Ngarumat Budaya ku Teknologi"</i></p>
<p><b>Sunda Language</b> adalah bahasa pemrograman <i>interpreted</i> yang dirancang khusus dengan sintaksis berbasis Bahasa Sunda. Proyek ini bertujuan untuk memperkenalkan logika pemrograman melalui pendekatan kearifan lokal (Nusantara).</p>

<a href="https://sunda-language.netlify.app/"><img src="https://img.shields.io/badge/Situs_Resmi-6d28d9?style=flat-square&logo=google-chrome&logoColor=white" alt="Website" /></a>
<a href="https://sunda-language.netlify.app/playground"><img src="https://img.shields.io/badge/Playground-f59e0b?style=flat-square&logo=google-play&logoColor=white" alt="Playground" /></a>
<a href="https://sunda-language.netlify.app/aksara"><img src="https://img.shields.io/badge/Versi_Aksara-10b981?style=flat-square&logo=pencipta&logoColor=white" alt="Aksara" /></a>
<a href="https://pypi.org/project/sunda-language/"><img src="https://img.shields.io/badge/PyPI-Install-3776AB?style=flat-square&logo=python&logoColor=white" alt="PyPI" /></a>
</div>

---

## 🚀 Fitur Utama
- **🗣️ Sintaksis Akrab:** Menggunakan kata kerja dan instruksi dalam Bahasa Sunda (Lemes & Loma).
- **🛠️ Full Featured:** Mendukung variabel, fungsi, pengkondisian, perulangan, hingga OOP (Class).
- **🛡️ Error Handling:** Mekanisme coba-cekel (try-catch) yang intuitif.
- **🎨 Tooling:** Tersedia ekstensi VS Code untuk syntax highlighting.

---

## 📥 Instalasi (ᮄᮔ᮪ᮞ᮪ᮒᮜᮞᮤ)

Basa pemrograman ieu parantos mimiti aya dina **[PyPI](https://pypi.org/project/sunda-language/)**.

### Cara 1: Install via pip (Direkomendasikan)
```bash
pip install sunda-language
```
Lajeng jalankeun:
```bash
sunda examples/hello_world.sunda
```

### Cara 2: Jalankan manual via Python
Pastikan Anda berada di direktori root proyek:
```bash
python -m sunda_language examples/program_simpel.sunda
```

### Cara 3: Google Colab (Notebook)
Sunda Language ogé tiasa pisan dijalankeun ngagunakeun Google Colab atawa Jupyter Notebook.

Dina sel kode, jalankeun pamasangan paket ieu:
```python
!pip install sunda-language
```

Damel file kode program Sunda-na nganggo magics `%%writefile`:
```python
%%writefile program.sunda
nyieun nami = "Colab";
tampilkeun "Halo ti " + nami + "!";
```

Jalankeun file éta nganggo pre-fix `!`:
```python
!sunda program.sunda
```

---

## 💻 Panduan Sintaksis (ᮞᮤᮔ᮪ᮒᮊ᮪ᮞ᮪)

### 1. Tipe Data & Variabel
Sunda Language mendukung tipe data Dinamis:
```sunda
nyieun nami = "Asep";         # String
nyieun umur = 25;              # Angka
nyieun mahasiswa = leres;      # Boolean (leres/lepat)
nyieun data = kosong;          # Null (kosong)
```

### 2. Struktur Kontrol (Upami & Perulangan)
**Pengkondisian:**
```sunda
upami umur >= 17:
    tampilkeun "Atos tiasa gaduh KTP";
lainna:
    tampilkeun "Teu acan tiasa";
anggeus
```

**Perulangan (Pikeun):**
```sunda
pikeun i = 1 ti 5 ngajalankeun
    tampilkeun "Iterasi ka: " + i;
anggeus
```

### 3. Pungsi (Fungsi)
```sunda
pungsi sapa(nami):
    balikkeun "Wilujeng sumping, " + nami;
anggeus

tampilkeun sapa("Baraya");
```

### 4. OOP (Kelas)
```sunda
kelas Jalma:
    pungsi __mimitian__(nami):
        ieu.nami = nami;
    anggeus

    pungsi sebatNami():
        tampilkeun "Nami simkuring nyaeta " + ieu.nami;
    anggeus
anggeus

nyieun asep = anyar Jalma("Asep");
asep.sebatNami();
```

### 5. Input User (Tanya)
Gunakeun perintah `tanya` atanapi `mangga_eusian` pikeun ménta input ti pamaké:
```sunda
tanya nami;
tampilkeun "Halo " + nami;
```

### 6. Ngolah Kasalahan (Try-Catch)
Tangkap *error* (kasalahan) nuju runtime sangkan program moal *crash*:
```sunda
coba:
    nyieun hasil = 10 / 0;
cekel e:
    tampilkeun "Aya kasalahan: " + e;
tungtungna:
    tampilkeun "Beres diolah.";
anggeus
```

---

## 📜 Koding Nganggo Aksara Sunda (ᮊᮧᮓᮤᮀ ᮍᮀᮌᮧ ᮃᮊ᮪ᮞᮛ ᮞᮥᮔ᮪ᮓ)

Sunda Language nampi pisan ngetik langsung nganggo naskah **Aksara Sunda**. Ieu conto-conto kode anu tiasa dijalankeun di [Aksara Playground](https://sunda-language.netlify.app/aksara):

### 1. Hello World (ᮠᮜᮧ ᮞᮥᮔ᮪ᮓ)
```sunda
ᮒᮙ᮪ᮕᮤᮜ᮪ᮊᮩᮔ᮪ "ᮠᮜᮧ ᮞᮥᮔ᮪ᮓ! 🌺";
```

### 2. Variabel & Angka Sunda (᮱-᮹)
```sunda
ᮑᮤᮉᮔ᮪ ᮃ = ᮱᮰;
ᮑᮤᮉᮔ᮪ ᮘ = ᮵;
ᮒᮙ᮪ᮕᮤᮜ᮪ᮊᮩᮔ᮪ ᮃ + ᮘ;
```

### 3. Kondisi (ᮅᮕᮙᮤ)
```sunda
ᮑᮤᮉᮔ᮪ ᮃ = ᮱᮰;
ᮅᮕᮙᮤ ᮃ > ᮵:
    ᮒᮙ᮪ᮕᮤᮜ᮪ᮊᮩᮔ᮪ "ᮜᮨᮥᮙ᮪ᮕᮒ᮪ ᮃ ";
ᮃᮀᮌᮩᮞ᮪
```

### 4. Perulangan (ᮕᮤᮊᮩᮔ᮪)
```sunda
ᮕᮤᮊᮩᮔ᮪ ᮄ = ᮱ ᮒᮤ ᮳ ᮍᮏᮜᮔ᮪ᮊᮩᮔ᮪
    ᮒᮙ᮪ᮕᮤᮜ᮪ᮊᮩᮔ᮪ ᮄ;
ᮃᮀᮌᮩᮞ᮪
```

### 5. Pungsi (ᮕᮥᮀᮞᮤ)
```sunda
ᮕᮥᮀᮞᮤ ᮒᮙ᮪ᮘᮠ᮪(ᮃ, ᮘ):
    ᮘᮜᮤᮊ᮪ᮊᮩᮔ᮪ ᮃ + ᮘ;
ᮃᮀᮌᮩᮞ᮪

ᮒᮙ᮪ᮕᮤᮜ᮪ᮊᮩᮔ᮪ ᮒᮙ᮪ᮘᮠ᮪(᮱᮰, ᮵);
```

### 6. Input (ᮒᮑ)
```sunda
ᮒᮙ᮪ᮕᮤᮜ᮪ᮊᮩᮔ᮪ "ᮞᮠ ᮔᮙᮤ ᮃᮔ᮪ᮏᮩᮔ᮪?";
ᮒᮑ ᮔᮙᮤ;
ᮒᮙ᮪ᮕᮤᮜ᮪ᮊᮩᮔ᮪ "ᮠᮜᮧ, " + ᮔᮙᮤ;
```

---

## 📖 Kamus Keyword (ᮊᮤᮝᮧᮁᮓ᮪)

| Keyword      | Sinonim            | Padanan Inggris         |
| ------------ | ------------------ | ----------------------- |
| `nyieun`     | `ngadeklarasikeun` | `var` / `let`           |
| `tampilkeun` | -                  | `print` / `console.log` |
| `upami`      | -                  | `if`                    |
| `lamun`      | -                  | `else if`               |
| `lainna`     | `lain lamun`       | `else`                  |
| `pikeun`     | -                  | `for`                   |
| `bari`       | -                  | `while`                 |
| `pungsi`     | -                  | `function`              |
| `balikkeun`  | -                  | `return`                |
| `coba`       | -                  | `try`                   |
| `cekel`      | -                  | `catch`                 |
| `anyar`      | -                  | `new`                   |
| `ieu`        | -                  | `this` / `self`         |

---

## 📖 Kamus Sunda - Indonesia (Terjemahan)

Kamus leutik kanggo daptar kosa kata nu digunakeun dina struktur basa pamrograman ieu.
*Sumber rujukan utama: [SundaDigi Kamus](https://sundadigi.com/kamus) sareng padanan umum Aksara.*

| Basa Sunda                    | Bahasa Indonesia                              |
| ----------------------------- | --------------------------------------------- |
| `nyieun` / `ngadeklarasikeun` | Membuat / Mendeklarasikan                     |
| `tampilkeun`                  | Tampilkan / Perlihatkan                       |
| `tanya` / `mangga_eusian`     | Tanya / Silakan isi (Input)                   |
| `upami`                       | Jikalau / Seandainya / Jika                   |
| `lamun`                       | Kalau / Misal                                 |
| `lainna` / `lain lamun`       | Lainnya / Atau Kalau (Sebaliknya)             |
| `pikeun`                      | Untuk (Bagi)                                  |
| `ti ... nepi`                 | Dari ... Sampai (Rentang)                     |
| `bari`                        | Sambil / Selagi (While)                       |
| `ngajalankeun`                | Menjalankan                                   |
| `anggeus`                     | Selesai / Tamat                               |
| `pungsi` / `fungsi`           | Fungsi                                        |
| `balikkeun`                   | Kembalikan (Return)                           |
| `leres`                       | Benar / Lurus                                 |
| `lepat`                       | Salah / Keliru                                |
| `jeung`                       | Dan                                           |
| `atawa`                       | Atau                                          |
| `lain`                        | Bukan                                         |
| `kosong`                      | Kosong / Hampa                                |
| `coba`                        | Coba                                          |
| `cekel`                       | Pegang / Tangkap (Catch)                      |
| `tungtungna`                  | Pada akhirnya / Ujungnya (Finally)            |
| `balangkeun`                  | Lemparkan (Throw)                             |
| `kelas`                       | Kelas                                         |
| `anyar`                       | Baru                                          |
| `ieu`                         | Ini (Konteks merujuk pada objek/diri sendiri) |
| `turunan`                     | Keturunan (Extends/Inherits)                  |
| `eureun`                      | Berhenti                                      |
| `teraskeun`                   | Teruskan / Lanjutkan                          |

---

## 🛠️ Operator & Konstanta

<table width="100%">
  <tr>
    <td width="30%"><b>Logika</b></td>
    <td><code>jeung</code> (AND), <code>atawa</code> (OR), <code>lain</code> (NOT)</td>
  </tr>
  <tr>
    <td><b>Boolean</b></td>
    <td><code>leres</code> (True), <code>lepat</code> (False)</td>
  </tr>
  <tr>
    <td><b>Aritmatika</b></td>
    <td><code>+</code> <code>-</code> <code>*</code> <code>/</code> <code>%</code></td>
  </tr>
</table>

---

## 📂 Struktur Proyek

```text
.
├── sunda_language/     # Kode sumber Interpreter
│   ├── __init__.py     # Metadata proyek
│   ├── lexer.py        # Analisis leksikal
│   ├── sunda_parser.py # Analisis sintaksis
│   ├── interpreter.py  # Eksekusi kode
│   └── __main__.py     # Titik masuk eksekusi (CLI)
├── examples/           # Contoh program (.sunda)
├── sunda-vscode/       # Plugin VS Code
├── pyproject.toml      # Konfigurasi instalasi PIP modern
├── MANIFEST.in         # Konfigurasi pengepakan distribusi
└── README.md           # Dokumentasi
```

---

## 🤝 Kontribusi (ᮊᮧᮔ᮪ᮒᮢᮤᮘᮥᮞᮤ)

Kami nampi pisan kontribusi ti sadayana pikeun ngembangkeun basa ieu!
1. Fork repositori ieu.
2. Buat cabang (`git checkout -b fitur-anyar`).
3. Commit parobahan (`git commit -m 'Nambahkeun fitur anyar'`).
4. Push (`git push origin fitur-anyar`).
5. Pull Request.

<div align="center">
<p><i>Proyek ini dilisensikan di bawah <b>MIT License</b></i></p>
<p><b>Hatur nuhun pisan! Mugia mangpaat kanggo urang sadayana! 🙏😊</b></p>
<p>Sunda Language Team &copy; <noscript>2025 - 2026</noscript></p>
</div>