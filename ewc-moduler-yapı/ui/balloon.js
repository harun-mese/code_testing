import { DOM } from "../core/dom.js";
import { State } from "../core/state.js";
import { BalloonPosition } from "./balloon-position.js";
import { commands } from "../core/commands.js";

import { BalloonTextUI } from "./balloon-ui-text.js";
import { BalloonElementUI } from "./balloon-ui-element.js";

export const Balloon = {

  init() {
    const el = DOM.create("div", "ewc-balloon hidden");
    document.body.appendChild(el);
    State.balloon = el;

    DOM.on(el, "click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const cmd = btn.dataset.cmd;

      if (commands[cmd]) commands[cmd]();
    });
  },

  show(target, mode = "element") {
    const balloon = State.balloon;

    // UI değiştir
    if (mode === "text") {
      balloon.innerHTML = BalloonTextUI;
    } else {
      balloon.innerHTML = BalloonElementUI;
    }

    // pozisyon hesaplama
    let pos;
    if (mode === "text") {
      pos = BalloonPosition.calcSelection(State.iframe);
    } else {
      pos = BalloonPosition.calc(target, State.iframe);
    }

    balloon.style.top = pos.top + "px";
    balloon.style.left = pos.left + "px";
    balloon.classList.remove("hidden");
  },

  hide() {
    State.balloon.classList.add("hidden");
  }
};
