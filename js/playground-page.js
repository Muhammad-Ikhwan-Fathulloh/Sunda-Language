// ========== PLAYGROUND PAGE CONTROLLER (GAMIFIED) ==========

const EXAMPLES = {
  hello_world: `tampilkeun "Halo Sunda! 🌺";\ntampilkeun "Wilujeng sumping di Basa Pamrograman Sunda!";`,
  kalkulator: `tampilkeun "=== Kalkulator Sunda ===";\n\nnyieun a = 20;\nnyieun b = 4;\n\nnyieun tambah = a + b;\nnyieun kurang = a - b;\nnyieun kali = a * b;\nnyieun bagi = a / b;\nnyieun modulo = a % b;\n\ntampilkeun "a = 20, b = 4";\ntampilkeun "a + b =";\ntampilkeun tambah;\ntampilkeun "a - b =";\ntampilkeun kurang;\ntampilkeun "a * b =";\ntampilkeun kali;\ntampilkeun "a / b =";\ntampilkeun bagi;\ntampilkeun "a % b =";\ntampilkeun modulo;\n\nupami tambah > 20:\n    tampilkeun "Hasil tambah leuwih ti 20";\nlainna:\n    tampilkeun "Hasil tambah kirang ti atawa sarua jeung 20";\nanggeus`,
  upami: `nyieun angka = 9;\n\nupami angka == 10:\n    tampilkeun "sampurna";\nlamun angka == 9:\n    tampilkeun "ampir sampurna";\nlainna:\n    tampilkeun "kirang";\nanggeus`,
  pikeun: `tampilkeun "=== Loop Pikeun ===";\n\npikeun i = 1 ti 5 ngajalankeun\n    tampilkeun i;\nanggeus\n\ntampilkeun "=== Loop Bari ===";\n\nnyieun counter = 1;\nbari counter <= 3 ngajalankeun\n    tampilkeun counter;\n    counter = counter + 1;\nanggeus`,
  pungsi: `pungsi tambah(a, b):\n    balikkeun a + b;\nanggeus\n\npungsi kali(a, b):\n    balikkeun a * b;\nanggeus\n\npungsi salam(nama):\n    tampilkeun "Halo, ";\n    tampilkeun nama;\n    balikkeun leres;\nanggeus\n\nnyieun hasil_tambah = tambah(10, 5);\ntampilkeun "10 + 5 =";\ntampilkeun hasil_tambah;\n\nnyieun hasil_kali = kali(4, 3);\ntampilkeun "4 * 3 =";\ntampilkeun hasil_kali;\n\nsalam("Sunda");`,
  rekursi: `pungsi faktorial(n):\n    upami n <= 1:\n        balikkeun 1;\n    anggeus\n    balikkeun n * faktorial(n - 1);\nanggeus\n\npungsi fibonacci(n):\n    upami n <= 0:\n        balikkeun 0;\n    anggeus\n    upami n == 1:\n        balikkeun 1;\n    anggeus\n    balikkeun fibonacci(n - 1) + fibonacci(n - 2);\nanggeus\n\ntampilkeun "=== Faktorial ===";\npikeun i = 1 ti 6 ngajalankeun\n    nyieun hasil = faktorial(i);\n    tampilkeun hasil;\nanggeus\n\ntampilkeun "=== Fibonacci ===";\npikeun i = 0 ti 8 ngajalankeun\n    nyieun fib = fibonacci(i);\n    tampilkeun fib;\nanggeus`,
  while_loop: `tampilkeun "=== FizzBuzz Sunda ===";\n\nnyieun i = 1;\nbari i <= 20 ngajalankeun\n    nyieun mod3 = i % 3;\n    nyieun mod5 = i % 5;\n    upami mod3 == 0:\n        upami mod5 == 0:\n            tampilkeun "FizzBuzz";\n        lainna:\n            tampilkeun "Fizz";\n        anggeus\n    lamun mod5 == 0:\n        tampilkeun "Buzz";\n    lainna:\n        tampilkeun i;\n    anggeus\n    i = i + 1;\nanggeus`,
};

const CHALLENGES = {
  "1": {
    name: "Dasar Variabel",
    desc: `Tampilkeun pesen <code>"Halo Sunda! 🌺"</code> nganggo <code>tampilkeun</code>.`,
    init: `// Tulis kode anjeun di dieu\n`,
    goal: (out) => out.includes("Halo Sunda! 🌺")
  },
  "2": {
    name: "Logika Upami",
    desc: `Nyieun variabel <code>angka = 15</code>. Tampilkeun <code>"Badag"</code> upami angka > 10, atanapi <code>"Leutik"</code> upami sanés.`,
    init: `nyieun angka = 15;\n// Tambahkeun logika upami di dieu\n`,
    goal: (out) => out.includes("Badag")
  },
  "3": {
    name: "Perulangan",
    desc: `Gunakeun <code>pikeun</code> pikeun nampilkeun angka 1 dugi ka 3 sacara ngaruntuy.`,
    init: `// Gunakeun pikeun i = 1 ti 3 ngajalankeun ...\n`,
    goal: (out) => out.includes("1") && out.includes("2") && out.includes("3")
  },
  "4": {
    name: "Pungsi",
    desc: `Nyieun <code>pungsi kali(a, b)</code> nu ngabalikkeun hasil <code>a * b</code>. Tampilkeun hasil <code>kali(5, 4)</code>.`,
    init: `pungsi kali(a, b):\n    // eusi pungsi\nanggeus\n\ntampilkeun kali(5, 4);`,
    goal: (out) => out.includes("20")
  },
  "5": {
    name: "Input User",
    desc: `Gunakeun <code>tanya</code> pikeun nyandak input <code>nami</code>, teras tampilkeun <code>"Halo [nami]"</code>.`,
    init: `tanya nami;\n// tampilkeun hasilna\n`,
    goal: (out) => out.some(line => line.startsWith("Halo "))
  }
};

let currentChallenge = null;

document.addEventListener("DOMContentLoaded", () => {
  const codeInput = document.getElementById("pg-code-input");
  const highlightLayer = document.getElementById("pg-highlight-layer");
  const lineNumbers = document.getElementById("pg-line-numbers");
  const outputArea = document.getElementById("pg-output-area");
  const btnRun = document.getElementById("pg-btn-run");
  const btnClear = document.getElementById("pg-btn-clear");
  const btnShare = document.getElementById("pg-btn-share");
  const exampleSelect = document.getElementById("pg-example-select");
  const statusText = document.getElementById("pg-status-text");
  const statusDot = document.getElementById("pg-status-dot");
  const lineColInfo = document.getElementById("pg-line-col");
  
  const missionPanel = document.getElementById("pg-mission-panel");
  const missionLevel = document.getElementById("mission-level");
  const missionDesc = document.getElementById("mission-desc");
  const successToast = document.getElementById("pg-success-toast");

  // ---- Syntax Highlighting ----
  function updateHighlight() {
    const code = codeInput.value;
    highlightLayer.innerHTML = sundaHighlighter.highlight(code) + "\n";
    updateLineNumbers();
  }

  function updateLineNumbers() {
    const count = codeInput.value.split("\n").length;
    lineNumbers.innerHTML = Array.from({ length: count }, (_, i) =>
      `<div>${i + 1}</div>`
    ).join("");
  }

  function syncScroll() {
    highlightLayer.scrollTop = codeInput.scrollTop;
    highlightLayer.scrollLeft = codeInput.scrollLeft;
    lineNumbers.scrollTop = codeInput.scrollTop;
  }

  codeInput.addEventListener("input", updateHighlight);
  codeInput.addEventListener("scroll", syncScroll);

  codeInput.addEventListener("click", updateCursorInfo);
  codeInput.addEventListener("keyup", updateCursorInfo);

  function updateCursorInfo() {
    const val = codeInput.value;
    const pos = codeInput.selectionStart;
    const before = val.substring(0, pos);
    const line = before.split("\n").length;
    const col = pos - before.lastIndexOf("\n");
    lineColInfo.textContent = `Baris ${line}, Kolom ${col}`;
  }

  codeInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = codeInput.selectionStart;
      const end = codeInput.selectionEnd;
      codeInput.value = codeInput.value.substring(0, start) + "    " + codeInput.value.substring(end);
      codeInput.selectionStart = codeInput.selectionEnd = start + 4;
      updateHighlight();
    }
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      runCode();
    }
  });

  // ---- Run Code ----
  function runCode() {
    const code = codeInput.value.trim();
    if (!code) {
      showOutput([{ text: "⚠️ Teu aya kode pikeun dijalankeun!", type: "error" }]);
      setStatus("error", "Kosong");
      return;
    }

    btnRun.classList.add("running");
    btnRun.innerHTML = "⏳ Ngajalankeun...";
    setStatus("running", "Ngajalankeun...");

    // Mock prompt for 'tanya' if challenge 5
    const inputs = [];
    if (code.includes("tanya")) {
      const p = prompt("Mangga eusian input pangguna:");
      if (p !== null) inputs.push(p);
    }

    setTimeout(() => {
      const startTime = performance.now();
      const result = runSundaCode(code, inputs);
      const elapsed = (performance.now() - startTime).toFixed(2);

      const lines = [];
      result.output.forEach((line) => {
        lines.push({ text: String(line), type: "normal" });
      });

      if (result.success) {
        lines.push({ text: `✅ Réngsé dina ${elapsed}ms`, type: "success" });
        setStatus("ok", `Réngsé (${elapsed}ms)`);
        
        // CHECK CHALLENGE GOAL
        if (currentChallenge && currentChallenge.goal(result.output)) {
          setTimeout(() => { successToast.style.display = "flex"; }, 500);
        }
      } else {
        lines.push({ text: `❌ ${result.error}`, type: "error" });
        setStatus("error", "Kasalahan");
      }

      showOutput(lines);
      btnRun.classList.remove("running");
      btnRun.innerHTML = "▶ Jalankeun";
    }, 50);
  }

  function showOutput(lines) {
    outputArea.innerHTML = lines
      .map(l => `<div class="pg-output-line ${l.type}">${escapeHtml(l.text)}</div>`)
      .join("");
    outputArea.scrollTop = outputArea.scrollHeight;
  }

  function escapeHtml(t) {
    const d = document.createElement("div");
    d.textContent = t;
    return d.innerHTML;
  }

  function setStatus(type, msg) {
    statusDot.className = "pg-status-dot" + (type === "error" ? " error" : "");
    statusText.textContent = msg;
  }

  // ---- Challenges ----
  function setupChallenge(level) {
    const chall = CHALLENGES[level];
    if (!chall) {
      missionPanel.style.display = "none";
      currentChallenge = null;
      return;
    }
    
    currentChallenge = chall;
    missionLevel.textContent = level;
    missionDesc.innerHTML = chall.desc;
    missionPanel.style.display = "block";
    
    codeInput.value = chall.init;
    updateHighlight();
    
    // Auto-clear output for new challenge
    outputArea.innerHTML = `<div class="pg-output-placeholder"><span class="icon">🎯</span><p>Tugas: ${chall.name}</p></div>`;
  }

  // ---- Buttons ----
  btnRun.addEventListener("click", runCode);
  btnClear.addEventListener("click", () => {
    outputArea.innerHTML = `<div class="pg-output-placeholder"><span class="icon">🌺</span><p>Pencét "Jalankeun" atawa Ctrl+Enter...</p></div>`;
    setStatus("ok", "Siap");
  });

  btnShare.addEventListener("click", () => {
    const code = codeInput.value;
    const encoded = btoa(unescape(encodeURIComponent(code)));
    const url = window.location.origin + window.location.pathname + "#code=" + encoded;
    navigator.clipboard.writeText(url).then(() => {
      btnShare.innerHTML = "✅ Disalin!";
      setTimeout(() => { btnShare.innerHTML = "🔗 Bagikeun"; }, 2000);
    }).catch(() => {
      prompt("Salin URL ieu:", url);
    });
  });

  exampleSelect.addEventListener("change", () => {
    const code = EXAMPLES[exampleSelect.value];
    if (code) {
      currentChallenge = null;
      missionPanel.style.display = "none";
      codeInput.value = code;
      updateHighlight();
      updateCursorInfo();
    }
  });

  function loadFromHash() {
    const hash = window.location.hash;
    if (hash.startsWith("#challenge=")) {
      const level = hash.slice(11);
      setupChallenge(level);
    } else if (hash.startsWith("#code=")) {
      try {
        const decoded = decodeURIComponent(escape(atob(hash.slice(6))));
        codeInput.value = decoded;
        updateHighlight();
      } catch (e) { /* ignore */ }
    }
  }

  window.addEventListener("hashchange", loadFromHash);

  // ---- Resize Handle ----
  const resizeHandle = document.getElementById("pg-resize-handle");
  const editorPanel = document.querySelector(".pg-panel-editor");
  const outputPanel = document.querySelector(".pg-panel-output");
  let isResizing = false;

  resizeHandle.addEventListener("mousedown", (e) => {
    isResizing = true;
    resizeHandle.classList.add("active");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const container = document.querySelector(".pg-main");
    const rect = container.getBoundingClientRect();
    const isMobile = window.innerWidth <= 700;

    if (isMobile) {
      const pct = ((e.clientY - rect.top) / rect.height) * 100;
      const clamped = Math.min(Math.max(pct, 20), 80);
      editorPanel.style.flex = `0 0 ${clamped}%`;
      outputPanel.style.flex = `0 0 ${100 - clamped}%`;
    } else {
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(Math.max(pct, 25), 80);
      editorPanel.style.flex = `0 0 ${clamped}%`;
      outputPanel.style.flex = `0 0 ${100 - clamped}%`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      resizeHandle.classList.remove("active");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  });

  // ---- Init ----
  loadFromHash();
  if (!currentChallenge) {
    updateHighlight();
  }
  updateCursorInfo();
  setStatus("ok", "Siap");
});
