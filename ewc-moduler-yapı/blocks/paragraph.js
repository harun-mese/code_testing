import { BlockBase } from "./block-base.js";

export class ParagraphBlock extends BlockBase {
  create() {
    const p = this.doc.createElement("p");
    p.textContent = "Yeni paragraf...";
    this.append(p);
    return p;
  }
}
