// EWC Editor - iframe içi article editörü
// Kullanım:
// 1) sayfada bir <iframe> olsun (sen de zaten var)
// 2) <script src="editor.js"></script> ekle
// 3) DOMContentLoaded olduğunda otomatik init olur
//
// İstersen manuel de çağırabilirsin:
// EWCEditor.init({ iframe: document.querySelector("iframe") });

(function (global) {
  "use strict";

  const DEFAULT_BLOCK_SELECTOR = "p, h1, h2, h3, h4, h5, h6, ul, ol, li, img, figure, blockquote, pre";

  const EWCEditor = {
    state: {
      iframe: null,
      doc: null,
      article: null,
      selection: null,
      currentBlock: null,
      blockSelector: DEFAULT_BLOCK_SELECTOR,
    },

    /**
     * Başlat
     * @param {Object} options
     *  - iframe: element veya selector
     *  - articleSelector: varsayılan 'article'
     *  - blockSelector: "+" ikonları için bloklar
     */
    init(options = {}) {
      const iframe =
        typeof options.iframe === "string"
          ? document.querySelector(options.iframe)
          : options.iframe || document.querySelector("iframe");

      if (!iframe) {
        console.warn("EWCEditor: iframe bulunamadı.");
        return;
      }

      this.state.iframe = iframe;
      if (options.blockSelector) this.state.blockSelector = options.blockSelector;

      const onLoad = () => {
        this._setupIframeDocument(options.articleSelector || "article");
      };

      if (iframe.contentDocument && iframe.contentDocument.readyState === "complete") {
        // iframe zaten yüklenmiş
        onLoad();
      } else {
        iframe.addEventListener("load", onLoad, { once: true });
      }
    },

    // iframe içi document ve article ayarları
    _setupIframeDocument(articleSelector) {
      const doc = this.state.iframe.contentDocument;
      if (!doc) {
        console.warn("EWCEditor: iframe.contentDocument yok.");
        return;
      }

      this.state.doc = doc;
      const article = doc.querySelector(articleSelector);

      if (!article) {
        console.warn("EWCEditor: iframe içinde article bulunamadı.");
        return;
      }

      this.state.article = article;

      // article düzenlenebilir olsun
      article.setAttribute("contenteditable", "true");

      // article pozisyonu relative olsun ( + ikonlarını konumlamak için )
      const style = doc.defaultView.getComputedStyle(article);
      if (style.position === "static") {
        article.style.position = "relative";
      }

      // execCommand için gerek olabiliyor
      try {
        doc.designMode = "on";
      } catch (e) {
        // bazı tarayıcılar izin vermeyebilir, sorun değil
      }

      // eventler
      this._bindIframeEvents();

      // ilk + ikon çizimi
      this.renderPlusButtons();
    },

    _bindIframeEvents() {
      const doc = this.state.doc;
      const article = this.state.article;
      const self = this;

      // tıklama: currentBlock güncelle + + ikonlarını yeniden çiz
      doc.addEventListener("click", function (e) {
        const target = e.target;
        if (!article.contains(target)) return;

        self.state.currentBlock = self._closestBlock(target);
        self.renderPlusButtons();
      });

      // hover: outline
      doc.addEventListener("mouseover", function (e) {
        const target = e.target;
        if (!article.contains(target)) return;
        self._highlightHover(target);
      });

      // selection değiştiğinde kaydet
      doc.addEventListener("selectionchange", function () {
        self.state.selection = doc.getSelection();
        const node =
          self.state.selection && self.state.selection.anchorNode
            ? self.state.selection.anchorNode.parentElement
            : null;
        self.state.currentBlock = self._closestBlock(node);
      });

      // iframe içi scroll/resize olunca + konumlarını güncelle
      doc.addEventListener("scroll", () => this.renderPlusButtons());
      doc.defaultView.addEventListener("resize", () => this.renderPlusButtons());
    },

    // Yakın blok elementi bul
    _closestBlock(el) {
      if (!el || !this.state.article) return null;
      return el.closest(this.state.blockSelector);
    },

    // Hover outline
    _highlightHover(el) {
      if (!el || el === this.state.article) return;

      const block = this._closestBlock(el);
      if (!block) return;

      block.style.outline = "1px dashed #5aa1ff";

      block.addEventListener(
        "mouseout",
        () => {
          block.style.outline = "none";
        },
        { once: true }
      );
    },

    // execCommand wrapper
    exec(cmd, value = null) {
      const doc = this.state.doc;
      if (!doc) return;
      doc.execCommand(cmd, false, value);
    },

    // heading (h1, h2, h3 ...)
    setBlock(tagName) {
      const doc = this.state.doc;
      if (!doc) return;
      doc.execCommand("formatBlock", false, tagName);
    },

    // + ikonları: bloklar arasına yerleştir
    renderPlusButtons() {
      const doc = this.state.doc;
      const article = this.state.article;
      if (!doc || !article) return;

      // Eski + butonlarını sil
      doc.querySelectorAll(".ewc-plus").forEach((el) => el.remove());

      const blocks = Array.from(article.querySelectorAll(this.state.blockSelector));
      if (blocks.length < 1) return;

      const articleRect = article.getBoundingClientRect();

      for (let i = 0; i < blocks.length - 1; i++) {
        const el1 = blocks[i];
        const el2 = blocks[i + 1];

        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        const midY = (rect1.bottom + rect2.top) / 2 - articleRect.top;

        const plus = doc.createElement("button");
        plus.type = "button";
        plus.className = "ewc-plus";
        plus.textContent = "+";
        plus.style.position = "absolute";
        plus.style.left = "-18px";
        plus.style.top = midY - 10 + "px";
        plus.style.width = "20px";
        plus.style.height = "20px";
        plus.style.borderRadius = "50%";
        plus.style.border = "none";
        plus.style.background = "#1e88e5";
        plus.style.color = "#fff";
        plus.style.cursor = "pointer";
        plus.style.display = "flex";
        plus.style.alignItems = "center";
        plus.style.justifyContent = "center";
        plus.style.fontSize = "14px";
        plus.style.boxShadow = "0 0 4px rgba(0,0,0,0.35)";
        plus.style.zIndex = "9999";

        // tıklanınca araya yeni paragraf ekle
        plus.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.insertBlockAfter(el1);
        });

        article.appendChild(plus);
      }
    },

    // Referans elemandan sonra yeni blok ekle
    insertBlockAfter(refEl) {
      const doc = this.state.doc;
      if (!doc || !refEl || !refEl.parentNode) return;

      const p = doc.createElement("p");
      p.textContent = "Yeni paragraf...";
      p.setAttribute("contenteditable", "true");

      refEl.parentNode.insertBefore(p, refEl.nextSibling);

      this._placeCaretAtStart(p);
      this.renderPlusButtons();
    },

    // Caret'i yeni elementin başına konumlandır
    _placeCaretAtStart(el) {
      const doc = this.state.doc;
      if (!doc) return;
      const range = doc.createRange();
      range.selectNodeContents(el);
      range.collapse(true);
      const sel = doc.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
  };

  // Global'e aç
  global.EWCEditor = EWCEditor;

  // Otomatik init (istersen bunu silebilirsin)
  document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector("iframe")) {
      EWCEditor.init();
    }
  });
})(window);
