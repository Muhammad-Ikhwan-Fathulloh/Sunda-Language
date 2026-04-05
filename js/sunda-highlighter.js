// ========== SUNDA SYNTAX HIGHLIGHTER ==========

class SundaHighlighter {
  constructor() {
    // IMPORTANT: No capturing groups inside regex patterns!
    // Only non-capturing groups (?:...) allowed.
    this.rules = [
      { regex: /\/\/[^\n]*/, cls: "hl-comment" },
      { regex: /"(?:[^"\\]|\\.)*"/, cls: "hl-string" },
      { regex: /\b(?:nyieun|ngadeklarasikeun)\b/, cls: "hl-keyword-declare" },
      { regex: /\btampilkeun\b/, cls: "hl-keyword-print" },
      { regex: /\b(?:tanya|mangga_eusian)\b/, cls: "hl-keyword-input" },
      { regex: /\b(?:upami|lamun|lainna)\b/, cls: "hl-keyword-control" },
      { regex: /\b(?:pikeun|bari|ngajalankeun|ti)\b/, cls: "hl-keyword-loop" },
      { regex: /\b(?:pungsi|fungsi|balikkeun)\b/, cls: "hl-keyword-func" },
      { regex: /\b(?:coba|cekel|tungtungna|balangkeun)\b/, cls: "hl-keyword-try" },
      { regex: /\b(?:kelas|ieu|anyar|turunan)\b/, cls: "hl-keyword-oop" },
      { regex: /\banggeus\b/, cls: "hl-keyword-end" },
      { regex: /\b(?:leres|lepat|true|false)\b/, cls: "hl-boolean" },
      { regex: /\b\d+(?:\.\d+)?\b/, cls: "hl-number" },
      { regex: /(?:==|!=|<=|>=|[+\-*\/%<>.])/, cls: "hl-operator" },
      { regex: /=/, cls: "hl-assign" },
      { regex: /;/, cls: "hl-semicolon" },
      { regex: /[:()\[\],]/, cls: "hl-punctuation" },
    ];

    const parts = this.rules.map(r => `(${r.regex.source})`);
    parts.push("([a-zA-Z_][a-zA-Z_0-9]*)"); // identifier
    parts.push("([ \\t]+)");                  // whitespace
    parts.push("(\\n)");                       // newline
    parts.push("(.)");                         // any other char
    this.combined = new RegExp(parts.join("|"), "g");
  }

  highlight(code) {
    const result = [];
    let match;
    this.combined.lastIndex = 0;

    while ((match = this.combined.exec(code)) !== null) {
      const fullMatch = match[0];
      let groupIdx = -1;
      for (let i = 1; i < match.length; i++) {
        if (match[i] !== undefined) {
          groupIdx = i - 1;
          break;
        }
      }

      if (groupIdx < this.rules.length) {
        result.push(`<span class="${this.rules[groupIdx].cls}">${this.escapeHtml(fullMatch)}</span>`);
      } else {
        const offset = groupIdx - this.rules.length;
        if (offset === 0) {
          result.push(`<span class="hl-variable">${this.escapeHtml(fullMatch)}</span>`);
        } else {
          result.push(offset === 2 ? "\n" : this.escapeHtml(fullMatch));
        }
      }
    }

    return result.join("");
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Highlight all elements with data-sunda attribute or matching selector
  highlightElement(el) {
    const code = el.textContent;
    el.innerHTML = this.highlight(code);
  }
}

const sundaHighlighter = new SundaHighlighter();
