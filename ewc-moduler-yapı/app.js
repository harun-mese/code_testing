import { State } from "./core/state.js";
import { Balloon } from "./ui/balloon.js";
import { Selection } from "./core/selection.js";

function initIframeEditor() {
  Balloon.init();

  const iframeDoc = State.iframe.contentDocument;

  // Text selection
  iframeDoc.addEventListener("selectionchange", handleSelection);

  // Element click
  iframeDoc.addEventListener("mouseup", handleSelection);
}
function handleSelection() {
  const iframeWin = State.iframe.contentWindow;
  const sel = iframeWin.getSelection();
  const text = sel.toString().trim();

  // 1) TEXT MODE
  if (text.length > 0) {
    Balloon.show(null, "text");
    return;
  }

  // 2) ELEMENT MODE
  const el = Selection.getSelectedElement();
  if (el) {
    State.selectedEl = el;
    Balloon.show(el, "element");
  }
}



  State.iframe = document.getElementById("livePreviewİframeElement");

  console.log("Iframe bulundu:", State.iframe);

   State.iframe.onload = function() {
    console.log("Iframe YÜKLENDİ!");

    // const doc = State.iframe.contentDocument;

    // doc.designMode = "on";

    // const article = doc.querySelector("article");
    // if (article) article.setAttribute("contenteditable", "true");

    initIframeEditor();
  };


