import { State } from "./core/state.js";
import { Balloon } from "./ui/balloon.js";
import { Selection } from "./core/selection.js";

function initIframeEditor() {
  console.log("iframe yüklendi");
  
  Balloon.init();

  const iframeWin = State.iframe.contentWindow;

 iframeWin.addEventListener("mouseup", handleSelection);
  iframeWin.addEventListener("selectionchange", handleSelection);

}

function handleSelection() {
  const el = Selection.getSelectedElement();
  if (el) Balloon.show(el);
}

window.addEventListener("DOMContentLoaded", () => {
  State.iframe = document.getElementById("livePreviewİframeElement");
  console.log("Iframe element:", State.iframe);

 State.iframe.addEventListener("load", initIframeEditor());
   //State.iframe.onload = initIframeEditor(); 
            
});

