import { State } from "./state.js";

export const Selection = {
  get() {
    const sel = State.iframe.contentWindow.getSelection();
    return sel;
  },

  getSelectedElement() {
    const sel = this.get();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    console.log("Selected element:", range.startContainer.parentElement);
    return range.startContainer.parentElement;
  }
};
