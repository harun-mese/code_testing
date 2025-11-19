import { BlockBase } from "./block-base.js";

export class HeadingBlock extends BlockBase {
  create() {
    const h = this.doc.createElement("h2");
    h.textContent = "Başlık";
    this.append(h);
    return h;
  }
}
