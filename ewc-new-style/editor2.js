/* ============================================================================
   EWC EDITÖR – Between Container + Block Menü + Balloon Editor
   - betweenContainer: admin.html içinde
   - blockMenu: admin.html içinde
   - Balloon editor: iframe içindeki selection için
============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const iframe      = document.querySelector("iframe");
    const between     = document.getElementById("betweenContainer");
    const plusBtn     = between.querySelector(".plus");
    const blockMenu   = document.getElementById("blockMenu");

    if (!iframe || !between || !plusBtn || !blockMenu) {
        console.warn("EWC Editor: Gerekli elemanlar eksik.");
        return;
    }

    iframe.addEventListener("load", () => {
        initEWCEditor(iframe, between, plusBtn, blockMenu);
    });
});

/* ============================================================================
   INIT
============================================================================ */
function setupIframeClicks(iframe) {
    const doc = iframe.contentDocument;

    doc.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const el = e.target;

        // EWC içinde işlem yapmak için callback
        handleIframeClick(el);
    });
}
function handleIframeClick(el) {

    const tag = el.tagName.toLowerCase();
    const classes = [...el.classList];
    const dataset = {...el.dataset};

    console.log("Tıklanan eleman:", {
        tag,
        classes,
        dataset,
        element: el
    });

    // Şimdi sana örnek nasıl davranacağını göstereyim:

    if (tag === "p") {
        console.log("PARAGRAF seçildi");
        // Burada balloon açabilir, stil paneli gösterebilir, vs
    }

    else if (tag === "h1" || tag === "h2") {
        console.log("BAŞLIK seçildi");
    }

    else if (tag === "img") {
        console.log("GÖRSEL seçildi:", el.src);
    }

    else if (tag === "blockquote") {
        console.log("ALINTI seçildi");
    }

    else if (tag === "ul" || tag === "ol") {
        console.log("LİSTE seçildi");
    }

    else if (tag === "li") {
        console.log("LİSTE ÖĞESİ seçildi");
    }

    else if (tag === "figure") {
        console.log("FIGURE bloğu (slide, image, video olabilir)");
    }

    else {
        console.log("GENEL TAG:", tag);
    }
}

function getBlockElement(el) {
    let current = el;

    while (current && current.tagName !== "ARTICLE") {
        if (
            ["p","h1","h2","h3","blockquote","ul","ol","li","figure","img","video"].includes(
                current.tagName.toLowerCase()
            )
        ) {
            return current;
        }
        current = current.parentElement;
    }

    return null;
}

function initEWCEditor(iframe, between, plusBtn, blockMenu) {
    const doc     = iframe.contentDocument;
    const win     = iframe.contentWindow;
    const article = doc.querySelector("article");

    if (!article) {
        console.warn("EWC Editor: <article> bulunamadı.");
        return;
    }

    article.setAttribute("contenteditable", "true");

    let hoverTimer = null;
    let menuOpen   = false;
    //setupIframeClicks(iframe);

    doc.addEventListener("click", (e) => {
        const block = getBlockElement(e.target);
        if (block) handleIframeClick(block);
    });




    /* ------------------------------------------------------------------------
       1) BETWEEN HOVER – her mousemove’de article içini tekrar hesaplar
    ------------------------------------------------------------------------ */
    doc.addEventListener("mousemove", (e) => {
        if (menuOpen) return;              // Menü açıkken between sabit kalsın

        clearTimeout(hoverTimer);

        const blocks = [...article.children].filter(el => el.offsetHeight > 0);
        if (blocks.length < 2) {
            hideBetween(between);
            return;
        }

        const mouseY = e.clientY;
        let match    = null;

        for (let i = 0; i < blocks.length - 1; i++) {
            const A = blocks[i].getBoundingClientRect();
            const B = blocks[i + 1].getBoundingClientRect();

            if (mouseY > A.bottom && mouseY < B.top) {
                match = { A, B, block: blocks[i] };
                break;
            }
        }

        if (!match) {
            hideBetween(between);
            return;
        }

        // 800ms hover sonrası between göster
        hoverTimer = setTimeout(() => {
            const midY = (match.A.bottom + match.B.top) / 2;

            // Bu block sonrası eklenecek
            between._refBlock = match.block;

            positionBetween(iframe, between, midY);
            showBetween(between);
        }, 800);
    });

    /* ------------------------------------------------------------------------
       2) SCROLL OLUNCA between GİZLENSİN
       (Sonraki mousemove'de article çocukları zaten tekrar hesaplanıyor)
    ------------------------------------------------------------------------ */
    doc.addEventListener("scroll", () => hideBetween(between));
    window.addEventListener("scroll", () => hideBetween(between));

    /* ------------------------------------------------------------------------
       3) + BUTONU → BLOCK MENÜ AÇ
    ------------------------------------------------------------------------ */
    plusBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const rect = between.getBoundingClientRect();
        const x    = rect.left + rect.width / 2 - 110; // 220px menüyü ortala
        const y    = rect.top + 32;

        toggleBlockMenu(blockMenu, true, x, y);
        menuOpen = true;
    });

    /* ------------------------------------------------------------------------
       4) BLOCK MENÜDEN TIKLAYINCA BLOCK EKLE
    ------------------------------------------------------------------------ */
    blockMenu.querySelectorAll(".bm-item").forEach(item => {
        item.addEventListener("click", () => {
            const type    = item.dataset.type;
            const ref     = between._refBlock;

            insertBlock(doc, ref, type);

            // Block eklendikten sonra between & menü reset
            hideBetween(between);
            toggleBlockMenu(blockMenu, false);
        });
    });

    /* Menü dışına tıklayınca kapanma */
    document.addEventListener("click", (e) => {
        if (!blockMenu.contains(e.target)) {
            toggleBlockMenu(blockMenu, false);
        }
        menuOpen = false;
    });

    /* ------------------------------------------------------------------------
       5) BALLOON EDITOR (iframe içinde selection için)
    ------------------------------------------------------------------------ */
    initBalloonEditor(iframe);
}

/* ============================================================================
   BETWEEN POSITIONING (admin tarafında)
============================================================================ */

function positionBetween(iframe, between, midY) {
    const iframeRect = iframe.getBoundingClientRect();
    const win = iframe.contentWindow;

    // iframe içindeki article’ın scroll miktarı
    const articleScrollTop = win.document.documentElement.scrollTop || win.document.body.scrollTop;

    // Y konumu → 2 scroll katmanı doğru şekilde birleşiyor
    const top = iframeRect.top + (midY );

    // X konumu → iframe ortasına göre
    const left = iframeRect.left + iframeRect.width / 2 - 150;

    between.style.top = top + "px";
    between.style.left = left + "px";
}


function showBetween(el) {
    el.style.display = "block";
}
function hideBetween(el) {
    el.style.display = "none";
}
doc.addEventListener("scroll", () => {
    hideBetween(between);
});

window.addEventListener("scroll", () => {
    hideBetween(between);
});
/* ============================================================================
   BLOCK MENU AÇ / KAPAT
============================================================================ */

function toggleBlockMenu(menu, show, x = 0, y = 0) {
    if (show) {
        menu.style.display = "block";
        menu.style.left    = x + "px";
        menu.style.top     = y + "px";
    } else {
        menu.style.display = "none";
    }
}

/* ============================================================================
   BLOCK EKLEME
============================================================================ */

function insertBlock(doc, refBlock, type) {
    if (!refBlock) return;

    let el;

    switch (type) {
        case "p":
            el = doc.createElement("p");
            el.textContent = "Yeni paragraf...";
            break;

        case "h1":
            el = doc.createElement("h1");
            el.textContent = "Yeni Başlık (H1)";
            break;

        case "h2":
            el = doc.createElement("h2");
            el.textContent = "Yeni Başlık (H2)";
            break;

        case "blockquote":
            el = doc.createElement("blockquote");
            el.textContent = "Alıntı metni...";
            break;

        case "img":
            el = doc.createElement("img");
            el.src = prompt("Resim URL:");
            el.style.maxWidth = "100%";
            break;

        case "ul":
            el = doc.createElement("ul");
            el.innerHTML = "<li>Liste öğesi</li>";
            break;

        case "ol":
            el = doc.createElement("ol");
            el.innerHTML = "<li>Liste öğesi</li>";
            break;

        case "hr":
            el = doc.createElement("hr");
            break;

        default:
            el = doc.createElement("p");
            el.textContent = "Yeni blok...";
    }

    el.setAttribute("contenteditable", "true");
    refBlock.insertAdjacentElement("afterend", el);

    placeCaret(doc, el);
}

function placeCaret(doc, el) {
    const range = doc.createRange();
    const sel   = doc.getSelection();
    range.setStart(el, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

/* ============================================================================
   BALLOON EDITOR (iframe içinde selection için)
============================================================================ */

function initBalloonEditor(iframe) {
    const doc     = iframe.contentDocument;
    const article = doc.querySelector("article");
    if (!article) return;

    const balloon = doc.createElement("div");
    balloon.style.cssText = `
        position: fixed;
        padding: 6px 8px;
        background: #111;
        color: #fff;
        border-radius: 8px;
        display: none;
        z-index: 999999;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    `;

    balloon.innerHTML = `
        <button data-cmd="bold"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">B</button>
        <button data-cmd="italic"    style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;font-style:italic;">I</button>
        <button data-cmd="underline" style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;text-decoration:underline;">U</button>
        <span style="border-left:1px solid rgba(255,255,255,0.3);margin:0 4px;height:14px;display:inline-block;"></span>
        <button data-block="h1"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">H1</button>
        <button data-block="h2"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">H2</button>
    `;

    doc.body.appendChild(balloon);

    // Toolbar butonları
    balloon.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const cmd   = btn.dataset.cmd;
        const block = btn.dataset.block;

        if (cmd) {
            doc.execCommand(cmd, false, null);
        } else if (block) {
            wrapSelectionInBlock(doc, block);
        }
    });

    function updateBalloon() {
        const sel = doc.getSelection();

        if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
            balloon.style.display = "none";
            return;
        }

        const range = sel.getRangeAt(0);
        const rect  = range.getBoundingClientRect();

        // Seçim article içinde mi?
        const common = range.commonAncestorContainer;
        if (!article.contains(common)) {
            balloon.style.display = "none";
            return;
        }

        const top  = rect.top - 40;
        const left = rect.left + (rect.width / 2) - 60;

        balloon.style.top     = `${top}px`;
        balloon.style.left    = `${left}px`;
        balloon.style.display = "block";
    }

    doc.addEventListener("mouseup", () => setTimeout(updateBalloon, 10));
    doc.addEventListener("keyup",  () => setTimeout(updateBalloon, 10));

    // İframe içinde tıklayıp seçimi kaldırınca gizle
    doc.addEventListener("click", (e) => {
        if (!balloon.contains(e.target)) {
            const sel = doc.getSelection();
            if (!sel || sel.isCollapsed) {
                balloon.style.display = "none";
            }
        }
    });
}

/* ============================================================================
   Seçimi H1 / H2 ile sarmak
============================================================================ */

function wrapSelectionInBlock(doc, blockTag) {
    const sel = doc.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const block = doc.createElement(blockTag);
    block.textContent = sel.toString();

    range.deleteContents();
    range.insertNode(block);

    placeCaret(doc, block);
}

/* ============================================================================
   EXEC COMMAND
============================================================================ */

function runCommand(cmd, value = null) {
    const iframe = document.querySelector("iframe");
    const doc = iframe.contentDocument;
    doc.execCommand(cmd, false, value);
}
