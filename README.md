<div align="center">
<h1><img src="https://img.shields.io/badge/Sunda-Language-6d28d9?style=for-the-badge&logo=codeproject&logoColor=white" alt="Sunda Language Badge" align="middle" /> ᮞᮥᮔ᮪ᮓ ᮜᮔ᮪ᮌᮥᮃᮌᮨ 🌺</h1>
<p><b>Sampurasun! 🙏</b></p>
<p><i>"Ngarumat Budaya ku Teknologi"</i></p>
<p><b>Sunda Language</b> adalah bahasa pemrograman <i>interpreted</i> yang dirancang khusus dengan sintaksis berbasis Bahasa Sunda. Proyek ini bertujuan untuk memperkenalkan logika pemrograman melalui pendekatan kearifan lokal (Nusantara).</p>

<a href="https://sunda-language.netlify.app/"><img src="https://img.shields.io/badge/Situs_Resmi-6d28d9?style=flat-square&logo=google-chrome&logoColor=white" alt="Website" /></a>
<a href="https://sunda-language.netlify.app/playground"><img src="https://img.shields.io/badge/Playground-f59e0b?style=flat-square&logo=google-play&logoColor=white" alt="Playground" /></a>
<a href="https://sunda-language.netlify.app/aksara"><img src="https://img.shields.io/badge/Versi_Aksara-10b981?style=flat-square&logo=pencipta&logoColor=white" alt="Aksara" /></a>
</div>

---

## 🚀 Fitur Utama
- **🗣️ Sintaksis Akrab:** Menggunakan kata kerja dan instruksi dalam Bahasa Sunda (Lemes & Loma).
- **🛠️ Full Featured:** Mendukung variabel, fungsi, pengkondisian, perulangan, hingga OOP (Class).
- **🛡️ Error Handling:** Mekanisme coba-cekel (try-catch) yang intuitif.
- **🎨 Tooling:** Tersedia ekstensi VS Code untuk syntax highlighting.

---

## 📥 Instalasi (ᮄᮔ᮪ᮞ᮪ᮒᮜᮞᮤ)

### Cara 1: Install via pip (Direkomendasikan)
```bash
pip install -e .
```
Lajeng jalankeun:
```bash
sunda examples/hello_world.sunda
```

### Cara 2: Jalankan manual via Python
Pastikan Anda berada di direktori root proyek:
```bash
python src/main.py examples/program_simpel.sunda
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

---

## 📖 Kamus Keyword (ᮊᮤᮝᮧᮁᮓ᮪)

| Keyword | Sinonim | Padanan Inggris |
|---|---|---|
| `nyieun` | `ngadeklarasikeun` | `var` / `let` |
| `tampilkeun` | - | `print` / `console.log` |
| `upami` | - | `if` |
| `lamun` | - | `else if` |
| `lainna` | `lain lamun` | `else` |
| `pikeun` | - | `for` |
| `bari` | - | `while` |
| `pungsi` | - | `function` |
| `balikkeun` | - | `return` |
| `coba` | - | `try` |
| `cekel` | - | `catch` |
| `anyar` | - | `new` |
| `ieu` | - | `this` / `self` |

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
├── src/                # Kode sumber Interpreter
│   ├── lexer.py        # Analisis leksikal
│   ├── parser.py       # Analisis sintaksis
│   └── interpreter.py  # Eksekusi kode
├── examples/           # Contoh program (.sunda)
├── sunda-vscode/       # Plugin VS Code
├── setup.py            # Konfigurasi instalasi PIP
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
<p>Sunda Language Team - 2024</p>
</div>