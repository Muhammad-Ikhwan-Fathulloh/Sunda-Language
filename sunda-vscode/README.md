# Sunda Language - VS Code Extension

Ékstensi VS Code pikeun syntax highlighting Basa Pamrograman Sunda 🌺

## Cara Install

### Cara 1: Install langsung ti folder
1. Buka VS Code
2. Tekan `Ctrl+Shift+P` -> ketik `Extensions: Install from VSIX...`
3. Atawa langsung copy folder `sunda-vscode` ka:
   - **Windows**: `%USERPROFILE%\.vscode\extensions\sunda-language`
   - **macOS/Linux**: `~/.vscode/extensions/sunda-language`
4. Restart VS Code

### Cara 2: Copy manual
```bash
# Windows (PowerShell)
Copy-Item -Recurse sunda-vscode "$env:USERPROFILE\.vscode\extensions\sunda-language"

# macOS / Linux
cp -r sunda-vscode ~/.vscode/extensions/sunda-language
```

Then restart VS Code.

## Fitur
- ✅ Syntax highlighting pikeun keywords (`nyieun`, `upami`, `tampilkeun`, dll.)
- ✅ Warna pikeun strings, numbers, booleans
- ✅ Highlight fungsi jeung operators
- ✅ Auto-closing brackets jeung quotes
- ✅ File association pikeun `.sunda`
