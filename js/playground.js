// ========== PLAYGROUND CONTROLLER ==========

const EXAMPLES = {
  hello_world: `tampilkeun "Halo Sunda! 🌺";\ntampilkeun "Wilujeng sumping di Basa Pamrograman Sunda!";`,
  kalkulator: `tampilkeun "=== Kalkulator Sunda ===";\n\nnyieun a = 20;\nnyieun b = 4;\n\nnyieun tambah = a + b;\nnyieun kurang = a - b;\nnyieun kali = a * b;\nnyieun bagi = a / b;\nnyieun modulo = a % b;\n\ntampilkeun "a = 20, b = 4";\ntampilkeun "a + b =";\ntampilkeun tambah;\ntampilkeun "a - b =";\ntampilkeun kurang;\ntampilkeun "a * b =";\ntampilkeun kali;\ntampilkeun "a / b =";\ntampilkeun bagi;\ntampilkeun "a % b =";\ntampilkeun modulo;\n\nupami tambah > 20:\n    tampilkeun "Hasil tambah leuwih ti 20";\nlainna:\n    tampilkeun "Hasil tambah kirang ti atawa sarua jeung 20";\nanggeus`,
  upami: `nyieun angka = 9;\n\nupami angka == 10:\n    tampilkeun "sampurna";\nlamun angka == 9:\n    tampilkeun "ampir sampurna";\nlainna:\n    tampilkeun "kirang";\nanggeus`,
  pikeun: `tampilkeun "=== Loop Pikeun ===";\n\npikeun i = 1 ti 5 ngajalankeun\n    tampilkeun i;\nanggeus\n\ntampilkeun "=== Loop Bari ===";\n\nnyieun counter = 1;\nbari counter <= 3 ngajalankeun\n    tampilkeun counter;\n    counter = counter + 1;\nanggeus`,
  fungsi: `fungsi tambah(a, b):\n    balikkeun a + b;\nanggeus\n\nfungsi kali(a, b):\n    balikkeun a * b;\nanggeus\n\nfungsi salam(nama):\n    tampilkeun "Halo, ";\n    tampilkeun nama;\n    balikkeun leres;\nanggeus\n\nnyieun hasil_tambah = tambah(10, 5);\ntampilkeun "10 + 5 =";\ntampilkeun hasil_tambah;\n\nnyieun hasil_kali = kali(4, 3);\ntampilkeun "4 * 3 =";\ntampilkeun hasil_kali;\n\nsalam("Sunda");`,
  rekursi: `fungsi faktorial(n):\n    upami n <= 1:\n        balikkeun 1;\n    anggeus\n    balikkeun n * faktorial(n - 1);\nanggeus\n\nfungsi fibonacci(n):\n    upami n <= 0:\n        balikkeun 0;\n    anggeus\n    upami n == 1:\n        balikkeun 1;\n    anggeus\n    balikkeun fibonacci(n - 1) + fibonacci(n - 2);\nanggeus\n\ntampilkeun "=== Faktorial ===";\npikeun i = 1 ti 6 ngajalankeun\n    nyieun hasil = faktorial(i);\n    tampilkeun hasil;\nanggeus\n\ntampilkeun "=== Fibonacci ===";\npikeun i = 0 ti 8 ngajalankeun\n    nyieun fib = fibonacci(i);\n    tampilkeun fib;\nanggeus`,
};

document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("code-editor");
  const lineNumbers = document.getElementById("line-numbers");
  const outputContent = document.getElementById("output-content");
  const btnRun = document.getElementById("btn-run");
  const btnClear = document.getElementById("btn-clear");
  const exampleSelect = document.getElementById("example-select");

  // Line numbers
  function updateLineNumbers() {
    const lines = editor.value.split("\n").length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join("");
  }

  editor.addEventListener("input", updateLineNumbers);
  editor.addEventListener("scroll", () => {
    lineNumbers.scrollTop = editor.scrollTop;
  });
  updateLineNumbers();

  // Tab key support
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + "    " + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
      updateLineNumbers();
    }
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      runCode();
    }
  });

  // Run code
  function runCode() {
    const code = editor.value.trim();
    if (!code) {
      showOutput([{ text: "Teu aya kode pikeun dijalankeun!", type: "error" }]);
      return;
    }

    btnRun.classList.add("running");
    btnRun.innerHTML = '<span class="run-icon">⏳</span> Ngajalankeun...';

    setTimeout(() => {
      const startTime = performance.now();
      const result = runSundaCode(code, []);
      const elapsed = (performance.now() - startTime).toFixed(2);

      const lines = [];

      if (result.output.length > 0) {
        result.output.forEach((line) => {
          lines.push({ text: line, type: "normal" });
        });
      }

      if (result.success) {
        lines.push({ text: "", type: "normal" });
        lines.push({ text: `✅ Réngsé dina ${elapsed}ms`, type: "success" });
      } else {
        lines.push({ text: "", type: "normal" });
        lines.push({ text: `❌ Kasalahan: ${result.error}`, type: "error" });
      }

      showOutput(lines);

      btnRun.classList.remove("running");
      btnRun.innerHTML = '<span class="run-icon">▶</span> Jalankeun';
    }, 100);
  }

  function showOutput(lines) {
    outputContent.innerHTML = lines
      .map((l) => `<div class="output-line ${l.type}">${escapeHtml(l.text)}</div>`)
      .join("");
    outputContent.scrollTop = outputContent.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  btnRun.addEventListener("click", runCode);
  btnClear.addEventListener("click", () => {
    outputContent.innerHTML = `<div class="output-placeholder"><span class="placeholder-icon">🌺</span><p>Pencét "Jalankeun" pikeun ningali hasilna...</p></div>`;
  });

  // Example selector
  exampleSelect.addEventListener("change", () => {
    const code = EXAMPLES[exampleSelect.value];
    if (code) {
      editor.value = code;
      updateLineNumbers();
    }
  });

  // Feature card click → load into playground
  document.querySelectorAll(".feature-card[data-example]").forEach((card) => {
    card.addEventListener("click", () => {
      const code = card.getAttribute("data-example");
      if (code) {
        editor.value = code;
        updateLineNumbers();
        document.getElementById("playground").scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
