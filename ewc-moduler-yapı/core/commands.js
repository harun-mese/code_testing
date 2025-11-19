import { State } from "./state.js";
import { Blocks } from "../blocks/index.js";

export const commands = {

  // ---- TEXT KOMUTLARI ----
  bold() {
    State.iframe.contentDocument.execCommand("bold", false, null);
  },

  italic() {
    State.iframe.contentDocument.execCommand("italic", false, null);
  },

  underline() {
    State.iframe.contentDocument.execCommand("underline", false, null);
  },

  highlight() {
    document.execCommand("backColor", false, "yellow");
  },

  createLink() {
    const url = prompt("URL gir:");
    if (url) State.iframe.contentDocument.execCommand("createLink", false, url);
  },

  wrapClass() {
    const cls = prompt("Class adı:");
    if (!cls) return;

    const doc = State.iframe.contentDocument;
    const sel = doc.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const span = doc.createElement("span");
    span.className = cls;

    range.surroundContents(span);
  },

  // ---- ELEMENT KOMUTLARI ----
  delete() {
    if (State.selectedEl) State.selectedEl.remove();
  },

  moveUp() {
    const el = State.selectedEl;
    if (el && el.previousElementSibling) {
      el.parentElement.insertBefore(el, el.previousElementSibling);
    }
  },

  moveDown() {
    const el = State.selectedEl;
    if (el && el.nextElementSibling) {
      el.parentElement.insertBefore(el.nextElementSibling, el);
    }
  },
  
  widthSmall() {
    State.selectedEl.style.maxWidth = "300px";
  },

  widthMedium() {
    State.selectedEl.style.maxWidth = "600px";
  },

  widthFull() {
    State.selectedEl.style.maxWidth = "100%";
  },

  settings() {
    alert("Element ayar paneli açılacak");
  }
};
