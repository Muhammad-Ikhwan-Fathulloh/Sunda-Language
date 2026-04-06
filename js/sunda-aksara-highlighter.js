// ========== SUNDA SYNTAX HIGHLIGHTER - AKSARA VERSION ==========

class SundaAksaraHighlighter {
  constructor() {
    this.rules = [
      { regex: /\/\/[^\n]*/, cls: "hl-comment" },
      { regex: /"(?:[^"\\]|\\.)*"/, cls: "hl-string" },
      { regex: /(ᮑᮤᮉᮔ᮪|ᮍᮓᮨᮊᮣᮛᮞᮤᮊᮩᮔ᮪)/, cls: "hl-keyword-declare" },
      { regex: /ᮒᮙ᮪ᮕᮤᮜ᮪ᮊᮩᮔ᮪/, cls: "hl-keyword-print" },
      { regex: /(ᮒᮑ|ᮙᮀᮌ_ᮉᮞᮤᮃᮔ᮪)/, cls: "hl-keyword-input" },
      { regex: /(ᮅᮕᮙᮤ|ᮜᮙᮥᮔ᮪|ᮜᮄᮔ᮪ᮔ)/, cls: "hl-keyword-control" },
      { regex: /(ᮕᮤᮊᮩᮔ᮪|ᮘᮛᮤ|ᮍᮏᮜᮔ᮪ᮊᮩᮔ᮪|ᮒᮤ|ᮔᮨᮕᮤ|ᮉᮛᮩᮔ᮪|ᮒᮨᮛᮞ᮪ᮊᮩᮔ᮪)/, cls: "hl-keyword-loop" },
      { regex: /(ᮕᮥᮀᮞᮤ|ᮖᮥᮀᮞᮤ|ᮘᮜᮤᮊ᮪ᮊᮩᮔ᮪)/, cls: "hl-keyword-func" },
      { regex: /(ᮏᮩᮀ|ᮃᮒᮝ|ᮜᮄᮔ᮪|ᮊᮧᮞᮧᮀ)/, cls: "hl-keyword-declare" },
      { regex: /(ᮎᮧᮘ|ᮎᮨᮊᮨᮜ᮪|ᮒᮥᮀᮒᮥᮀᮔ|ᮘᮜᮀᮊᮩᮔ᮪)/, cls: "hl-keyword-try" },
      { regex: /(ᮊᮨᮜᮞ᮪|ᮄᮉ|ᮃᮑᮛ᮪|ᮒᮥᮛᮥᮔᮔ᮪)/, cls: "hl-keyword-oop" },
      { regex: /ᮃᮀᮌᮩᮞ᮪/, cls: "hl-keyword-end" },
      { regex: /(ᮜᮨᮛᮨᮞ᮪|ᮜᮨᮕᮒ᮪)/, cls: "hl-boolean" },
      { regex: /[᮰-᮹\u1BB0-\u1BB9]+(?:\.[᮰-᮹\u1BB0-\u1BB9]+)?/, cls: "hl-number" },
      { regex: /\d+(?:\.\d+)?/, cls: "hl-number" },
      { regex: /(?:==|!=|<=|>=|[+\-*\/%<>.])/, cls: "hl-operator" },
      { regex: /=/, cls: "hl-assign" },
      { regex: /;/, cls: "hl-semicolon" },
      { regex: /[:()\[\],]/, cls: "hl-punctuation" },
    ];

    const parts = this.rules.map(r => `(${r.regex.source})`);
    // Variable rules for Aksara
    parts.push("([a-zA-Z_\\u1B80-\\u1BAF][a-zA-Z_0-9\\u1B80-\\u1BAF]*)"); 
    parts.push("([ \\t]+)");
    parts.push("(\\n)");
    parts.push("(.)");
    this.combined = new RegExp(parts.join("|"), "gu");
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
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
}

const sundaAksaraHighlighter = new SundaAksaraHighlighter();
