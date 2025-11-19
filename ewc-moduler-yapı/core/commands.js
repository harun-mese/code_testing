import { State } from "./state.js";
import { Blocks } from "../blocks/index.js";
import { Balloon } from "../ui/balloon.js";

export const commands = {
  bold() {
    State.iframe.contentDocument.execCommand("bold");
  },

  italic() {
    State.iframe.contentDocument.execCommand("italic");
  },

  underline() {
    State.iframe.contentDocument.execCommand("underline");
  },

  addParagraph() {
    Blocks.create("paragraph");
  },

  addHeading() {
    Blocks.create("heading");
  },

  addImage() {
    Blocks.create("image");
  },

  openBalloon() {
    Balloon.show(State.selectedEl);
  }
};
