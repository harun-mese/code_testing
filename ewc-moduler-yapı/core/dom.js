export const DOM = {
  qs(selector, root = document) {
    return root.querySelector(selector);
  },
  create(tag, cls) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  },
  on(el, evt, fn) {
    el.addEventListener(evt, fn);
  }
};
