# **Sunda Language** 🌺

**Sunda Language** adalah bahasa pemrograman sederhana dengan sintaksis menggunakan bahasa Sunda. Bahasa ini dirancang untuk memberikan pengalaman pemrograman dengan menggunakan bahasa daerah yang dikenal di Indonesia, khususnya di wilayah Jawa Barat.

---

## **Instalasi**

### Cara 1: Install via pip (Direkomendasikan)
```bash
pip install -e .
```

Setelah install, Anda bisa langsung jalankan:
```bash
sunda examples/hello_world.sunda
```

### Cara 2: Jalankan langsung
```bash
python src/main.py examples/hello_world.sunda
```

### Cara 3: Pakai batch file (Windows)
```bash
run-sunda examples/hello_world.sunda
```

---

## **VS Code Extension (Syntax Highlighting)**

Supaya kode `.sunda` berwarna di VS Code:

```powershell
# Windows (PowerShell)
Copy-Item -Recurse sunda-vscode "$env:USERPROFILE\.vscode\extensions\sunda-language"
```

```bash
# macOS / Linux
cp -r sunda-vscode ~/.vscode/extensions/sunda-language
```

Restart VS Code, lalu buka file `.sunda` → kode akan berwarna! 🎨

---

## **Sintaks Sunda**

### **1. Deklarasi Variabel**
```sunda
nyieun angka = 10;
nyieun nama = "Sunda";
nyieun aktif = leres;
```

### **2. Tampilkeun (Print)**
```sunda
tampilkeun "Halo Sunda!";
tampilkeun angka;
```

### **3. Pengkondisian (Upami / Lamun / Lainna)**
```sunda
upami angka == 10:
    tampilkeun "sampurna";
lamun angka == 9:
    tampilkeun "ampir";
lainna:
    tampilkeun "kirang";
anggeus
```

### **4. Perulangan For (Pikeun)**
```sunda
pikeun i = 1 ti 5 ngajalankeun
    tampilkeun i;
anggeus
```

### **5. Perulangan While (Bari)**
```sunda
nyieun counter = 1;
bari counter <= 3 ngajalankeun
    tampilkeun counter;
    counter = counter + 1;
anggeus
```

### **6. Pungsi**
```sunda
pungsi tambah(a, b):
    balikkeun a + b;
anggeus

nyieun hasil = tambah(10, 5);
tampilkeun hasil;
```

### **7. Input**
```sunda
tanya nama;
tampilkeun nama;
```

---

## **Daftar Keyword**

| Keyword                       | Arti                | Contoh                           |
| ----------------------------- | ------------------- | -------------------------------- |
| `nyieun` / `ngadeklarasikeun` | Deklarasi variabel  | `nyieun x = 10;`                 |
| `tampilkeun`                  | Print / Cetak       | `tampilkeun x;`                  |
| `tanya` / `mangga_eusian`     | Input dari user     | `tanya nama;`                    |
| `upami`                       | If (jika)           | `upami x == 10:`                 |
| `lamun`                       | Else if (atau jika) | `lamun x == 5:`                  |
| `lainna` / `lain lamun`       | Else (lainnya)      | `lainna:`                        |
| `pikeun`                      | For loop            | `pikeun i = 1 ti 5 ngajalankeun` |
| `bari`                        | While loop          | `bari x < 10 ngajalankeun`       |
| `ngajalankeun`                | Run / Jalankan      | (penutup kondisi loop)           |
| `anggeus`                     | End / Selesai       | (penutup blok)                   |
| `pungsi`                      | Definisi pungsi     | `pungsi tambah(a, b):`           |
| `balikkeun`                   | Return              | `balikkeun a + b;`               |
| `leres`                       | True (benar)        | `nyieun aktif = leres;`          |
| `lepat`                       | False (salah)       | `nyieun aktif = lepat;`          |

---

## **Operator**

| Operator                    | Keterangan   |
| --------------------------- | ------------ |
| `+` `-` `*` `/` `%`         | Aritmatika   |
| `==` `!=` `<` `>` `<=` `>=` | Perbandingan |
| `=`                         | Assignment   |

---

## **Lisensi**

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

## **Kontribusi**

1. **Fork repositori ini**
2. **Buat cabang baru** - `git checkout -b nama-fitur`
3. **Lakukan commit** - `git commit -am 'Menambahkan fitur baru'`
4. **Push ke cabang Anda** - `git push origin nama-fitur`
5. **Buat Pull Request**

Hatur nuhun pisan! 😊

---