import { State } from "../core/state.js";
import { ParagraphBlock } from "./paragraph.js";
import { HeadingBlock } from "./heading.js";
import { ImageBlock } from "./image.js";

export const Blocks = {
  create(type) {
    const doc = State.iframe;
    let block = null;

    switch (type) {
      case "paragraph":
        block = new ParagraphBlock(doc).create();
        break;
      case "heading":
        block = new HeadingBlock(doc).create();
        break;
      case "image":
        block = new ImageBlock(doc).create();
        break;
    }

    return block;
  }
};
