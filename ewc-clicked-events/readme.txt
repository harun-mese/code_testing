const result = {
      event: e.type,
      el,
      tag: el.tagName.toUpperCase(),
      classes: [...el.classList],
      rect,
      iframeRect,
      absolute: {
        top: iframeRect.top + rect.top,
        left: iframeRect.left + rect.left,
        width: rect.width,
        height: rect.height
      }
    };


 bu kısım harika çalışıyor güzel geri kalanlarda aynı şekilde iyi

    absolute: {
        top: iframeRect.top + rect.top,
        left: iframeRect.left + rect.left,
        width: rect.width,
        height: rect.height
    } 


    window.selection lazım
    bir de 
    ayar yapılacak tagin for change class or edit style attribute  "addingANDtoggleFunction"