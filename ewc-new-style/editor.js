/* ============================================================================
   EWC EDITÖR – Between Container + Block Menü + Balloon Editor
   - betweenContainer: admin.html içinde
   - blockMenu: admin.html içinde
   - Balloon editor: iframe içindeki selection + tıklama için
============================================================================ */

/* Global balloon state */
let EWC_Balloon = null;
let EWC_SelectedBlock = null;

document.addEventListener("DOMContentLoaded", () => {
    const iframe    = document.querySelector("iframe");
    const between   = document.getElementById("betweenContainer");
    const plusBtn   = between ? between.querySelector(".plus") : null;
    const blockMenu = document.getElementById("blockMenu");

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

function initEWCEditor(iframe, between, plusBtn, blockMenu) {
    const doc     = iframe.contentDocument;
    const article = doc.querySelector("article");

    if (!article) {
        console.warn("EWC Editor: <article> bulunamadı.");
        return;
    }

    article.setAttribute("contenteditable", "true");

    initBetweenHover(iframe, article, between);
    initBlockMenu(iframe, between, plusBtn, blockMenu);
    initBalloonEditor(iframe, article);
}

/* ============================================================================
   CLICK LOGIC: hangi bloğa tıklandığını bulmak
============================================================================ */

function handleIframeClick(el) {
    const tag     = el.tagName.toLowerCase();
    const classes = [...el.classList];
    const dataset = { ...el.dataset };

    console.log("Tıklanan eleman:", {
        tag,
        classes,
        dataset,
        element: el
    });
}

function getBlockElement(el, article) {
    let current = el;

    while (current && current !== article) {
        if (
            ["p","h1","h2","h3","blockquote","ul","ol","li","figure","img","video"]
            .includes(current.tagName.toLowerCase())
        ) {
            return current;
        }
        current = current.parentElement;
    }

    return null;
}

/* ============================================================================
   BETWEEN HOVER SYSTEM
============================================================================ */

function initBetweenHover(iframe, article, between) {
    const doc = iframe.contentDocument;
    let hoverTimer = null;

    doc.addEventListener("mousemove", (e) => {
        // Block menü açıksa hareket ettirme
        const blockMenu = document.getElementById("blockMenu");
        if (blockMenu && blockMenu.style.display === "block") return;

        clearTimeout(hoverTimer);

        const blocks = [...article.children].filter(el => el.offsetHeight > 0);
        if (blocks.length < 2) {
            hideBetween(between);
            return;
        }

        const mouseY = e.clientY;
        let match = null;

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

        hoverTimer = setTimeout(() => {
            const midY = (match.A.bottom + match.B.top) / 2;
            between._refBlock = match.block;
            positionBetween(iframe, between, midY);
            showBetween(between);
        }, 700);
    });

    // Scroll olunca mellan çizgiyi gizle
    doc.addEventListener("scroll", () => hideBetween(between));
    window.addEventListener("scroll", () => hideBetween(between));
}

function positionBetween(iframe, between, midY) {
    const iframeRect = iframe.getBoundingClientRect();

    // Şu an için iframe içi scroll hesaba katılmadan:
    const top  = iframeRect.top + midY;
    const left = iframeRect.left + (iframeRect.width / 2) - 150; // 300px genişlik

    between.style.top  = top + "px";
    between.style.left = left + "px";
}

function showBetween(el) {
    el.style.display = "block";
}
function hideBetween(el) {
    el.style.display = "none";
}

/* ============================================================================
   BLOCK MENU
============================================================================ */

function initBlockMenu(iframe, between, plusBtn, blockMenu) {
    plusBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const rect = between.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - 110; // 220px menü
        const y = rect.top + 30;

        toggleBlockMenu(blockMenu, true, x, y);
    });

    blockMenu.querySelectorAll(".bm-item").forEach(item => {
        item.addEventListener("click", () => {
            const doc  = iframe.contentDocument;
            const type = item.dataset.type;
            const ref  = between._refBlock;

            insertBlock(doc, ref, type);

            hideBetween(between);
            toggleBlockMenu(blockMenu, false);
        });
    });

    document.addEventListener("click", (e) => {
        if (!blockMenu.contains(e.target)) {
            toggleBlockMenu(blockMenu, false);
        }
    });
}

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
   BALLOON EDITOR – selection + click
============================================================================ */

function initBalloonEditor(iframe, article) {
    const doc = iframe.contentDocument;

    // Balloon yarat
    const balloon = document.createElement("div");
    balloon.id = "ewcBalloon";
    balloon.style.cssText = `
        position: fixed;
        padding: 6px 15px;
        background: #111;
        color: #fff;
        border-radius: 50px;
        display: none;
        z-index: 999999;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        opacity:0;
        transform:scale(.95) translateY(-6px);
        transition: opacity .15s ease, transform .15s ease;
    `;

    balloon.innerHTML = `
        <button data-cmd="bold"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">B</button>
        <button data-cmd="italic"    style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;font-style:italic;">I</button>
        <button data-cmd="underline" style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;text-decoration:underline;">U</button>
        <span style="border-left:1px solid rgba(255,255,255,0.3);margin:0 4px;height:14px;display:inline-block;"></span>
        <button data-block="p"       style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">P</button>
        <button data-block="h1"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">H1</button>
        <button data-block="h2"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">H2</button>
        <button data-block="p"       style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">P</button>
        <button data-block="h1"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">H1</button>
        <button data-block="h2"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">H2</button>
        <button data-block="p"       style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">P</button>
        <button data-block="h1"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">H1</button>
        <button data-block="h2"      style="background:none;border:none;color:#fff;margin:0 4px;cursor:pointer;">H2</button>
    `;

   // doc.body.appendChild(balloon);
    document.body.appendChild(balloon);
    EWC_Balloon = balloon;

    // Balloon toolbar click
    balloon.addEventListener("click", (e) => {
        const btn   = e.target.closest("button");
        if (!btn) return;

        const cmd   = btn.dataset.cmd;
        const block = btn.dataset.block;

        if (cmd) {
            doc.execCommand(cmd, false, null);
        } else if (block) {
            if (EWC_SelectedBlock) {
                transformBlockTag(doc, EWC_SelectedBlock, block);
            } else {
                wrapSelectionInBlock(doc, block);
            }
        }
    });

    // Selection → balloon
    function updateBalloonForSelection() {
        const sel = doc.getSelection();

        if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
           // hideBalloon();
            return;
        }

        const range = sel.getRangeAt(0);
        const rect  = range.getBoundingClientRect();
        const iframeRect = iframe.getBoundingClientRect();

        const top  = iframeRect.top + rect.top - 40;
        const left = iframeRect.left + rect.left;

        balloon.style.top  = `${top}px`;
        balloon.style.left = `${left}px`;
        showBalloon();
    }

    doc.addEventListener("mouseup", () => setTimeout(updateBalloonForSelection, 10));
    doc.addEventListener("keyup",  () => setTimeout(updateBalloonForSelection, 10));

    // Click → block seç, balloon göster
    doc.addEventListener("click", (e) => {
        if (balloon.contains(e.target)) return;

        const block = getBlockElement(e.target, article);
        if (block) {
            EWC_SelectedBlock = block;
            handleIframeClick(block); // log amaçlı

            const rect       = block.getBoundingClientRect();
            const iframeRect = iframe.getBoundingClientRect();

            const top  = iframeRect.top + rect.top - 40;
            const left = iframeRect.left + rect.left;

            balloon.style.top  = `${top}px`;
            balloon.style.left = `${left}px`;

            showBalloon();
        } else {
            const sel = doc.getSelection();
            if (!sel || sel.isCollapsed) {
                hideBalloon();
            }
        }
    });
}

function showBalloon() {
    if (!EWC_Balloon) return;
    EWC_Balloon.style.display = "block";
    requestAnimationFrame(() => {
        EWC_Balloon.style.opacity = "1";
        EWC_Balloon.style.transform = "scale(1) translateY(0)";
    });
}

function hideBalloon() {
    if (!EWC_Balloon) return;
    EWC_Balloon.style.opacity = "0";
    EWC_Balloon.style.transform = "scale(.95) translateY(-6px)";
    setTimeout(() => {
        EWC_Balloon.style.display = "none";
    }, 150);
}

/* Block tag dönüşümü (klik ile seçili block için) */
function transformBlockTag(doc, el, newTag) {
    const tag = newTag.toLowerCase();
    if (!["p","h1","h2","blockquote"].includes(tag)) return;

    const newEl = doc.createElement(tag);
    newEl.innerHTML = el.innerHTML;
    newEl.setAttribute("contenteditable", "true");

    el.replaceWith(newEl);
    EWC_SelectedBlock = newEl;
}

/* Selection → blok ile sarmak için (H1/H2 vs) */
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
   GLOBAL execCommand
============================================================================ */

function runCommand(cmd, value = null) {
    const iframe = document.querySelector("iframe");
    if (!iframe) return;
    const doc = iframe.contentDocument;
    doc.execCommand(cmd, false, value);
}
