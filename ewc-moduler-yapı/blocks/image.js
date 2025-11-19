import { BlockBase } from "./block-base.js";

export class ImageBlock extends BlockBase {
  create() {
    const figure = this.doc.createElement("figure");
    const img = this.doc.createElement("img");
    img.src = "https://picsum.photos/600/300";
    figure.appendChild(img);
    this.append(figure);
    return figure;
  }
}
