import { DOM } from "../core/dom.js";
import { State } from "../core/state.js";
import { BalloonPosition } from "./balloon-position.js";
import { Icons } from "./icons.js";
import { commands } from "../core/commands.js";

export const Balloon = {
  init() {
    const el = DOM.create("div", "ewc-balloon hidden");
    el.innerHTML = `
      <button data-cmd="bold">${Icons.bold}</button>
      <button data-cmd="italic">${Icons.italic}</button>
      <button data-cmd="underline">${Icons.underline}</button>
      <div class="line"></div>
      <button data-cmd="addParagraph">${Icons.paragraph}</button>
      <button data-cmd="addHeading">${Icons.heading}</button>
      <button data-cmd="addImage">${Icons.image}</button>
      <button data-cmd="settings">${Icons.settings}</button>
    `;
    document.body.appendChild(el);

    DOM.on(el, "click", e => {
      if (e.target.closest("button")) {
        const cmd = e.target.closest("button").dataset.cmd;
        if (commands[cmd]) commands[cmd]();
      }
    });

    State.balloon = el;
  },

  show(target) {
    State.selectedEl = target;

    const pos = BalloonPosition.calc(target, State.iframe);

    const balloon = State.balloon;
    balloon.style.top = pos.top + "px";
    balloon.style.left = pos.left + "px";
    balloon.classList.remove("hidden");
  },

  hide() {
    State.balloon.classList.add("hidden");
  }
};
