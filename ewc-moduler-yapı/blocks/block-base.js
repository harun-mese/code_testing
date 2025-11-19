export class BlockBase {
  constructor(iframe) {
    this.iframe = iframe;
    this.doc = iframe.contentDocument;
  }

  append(el) {
    this.doc.querySelector("article").appendChild(el);
  }
}
