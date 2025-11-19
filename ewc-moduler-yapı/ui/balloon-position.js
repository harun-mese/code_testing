// export const BalloonPosition = {
//   calc(target, iframe) {
//     const rect = target.getBoundingClientRect();
//     const iframeRect = iframe.getBoundingClientRect();

//     return {
//       top: rect.top + iframeRect.top - 50,
//       left: rect.left + iframeRect.left + rect.width / 2
//     };
//   }
// };

// export const BalloonPosition = {
//   calc(target, iframe) {
//     const rect = target.getBoundingClientRect();
//     const iframeRect = iframe.getBoundingClientRect();

//     const iframeWin = iframe.contentWindow;

//     // iframe içindeki scroll değerleri
//     const scrollTop = iframeWin.scrollY;
//     const scrollLeft = iframeWin.scrollX;

//     return {
//       top: rect.top + iframeRect.top - 50 - scrollTop,
//       left: rect.left + iframeRect.left  - scrollLeft
//     };
//   }
// };
//+ rect.width / 2


export const BalloonPosition = {

  // Element pozisyonu
  calc(target, iframe) {
    const rect = target.getBoundingClientRect();
    const iframeRect = iframe.getBoundingClientRect();
    const iframeWin = iframe.contentWindow;

    return {
      top: rect.top + iframeRect.top - 50 - iframeWin.scrollY,
      left: rect.left + iframeRect.left - iframeWin.scrollX
    };
  },

  // Seçilen METNİN pozisyonu
  calcSelection(iframe) {
    const sel = iframe.contentWindow.getSelection();
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const iframeRect = iframe.getBoundingClientRect();
    const iframeWin = iframe.contentWindow;

    return {
      top: rect.top + iframeRect.top - 50 - iframeWin.scrollY,
      left: rect.left + iframeRect.left - iframeWin.scrollX
    };
  }

};
