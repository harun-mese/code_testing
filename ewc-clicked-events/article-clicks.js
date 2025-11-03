const iframe = document.querySelector('iframe');

iframe.addEventListener('load', () => {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  const article = iframeDoc.querySelector('article');
  if (!article) return;

  const events = ['click', 'mouseover', 'dblclick', 'contextmenu'];

  const handleEvent = (e) => {
    const el = e.target;
    const rect = el.getBoundingClientRect();
    const iframeRect = iframe.getBoundingClientRect();

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

    console.clear();
    console.group(`Event: ${e.type}`);
    console.table({
      tag: result.tag,
      event: result.event,
      top: result.absolute.top,
      left: result.absolute.left
    });
    console.groupEnd();

    // 🌟 örnek: P etiketi tıklanınca baloon göster
    if (result.tag != "ARTICLE"  && result.event === 'click') {
      showBaloonTextEditor(result.absolute, result.tag);
    }
  };

//   events.forEach(eventType => {
//     article.addEventListener(eventType, handleEvent);
//   });

    // Sadece click olayını dinle
    article.addEventListener('click', handleEvent);

  
});


// 💬 Balon gösterme fonksiyonu
function showBaloonTextEditor(pos, tag) {
  // Eski balon varsa kaldır
  let existing = document.querySelector('.baloonTextEditor');
  if (existing) existing.remove();

  // Yeni balonu oluştur
  const baloon = document.createElement('div');
  baloon.className = 'baloonTextEditor';
  //baloon.innerHTML = `<b style="color:tomato;">${tag}</b>  📝 Baloon Text Editor`;
    baloon.innerHTML = `
        <b style="color:tomato;">${tag}</b>
        <i class="bi bi-type-bold" title="Kalın"></i>
        <i class="bi bi-type-italic" title="İtalik"></i>
        <i class="bi bi-type-underline" title="Altı Çizili"></i>
        <i class="bi bi-palette" title="Renk"></i>
        <i class="bi bi-align-start" title="Sola Hizala"></i>
        <i class="bi bi-align-center" title="Ortala"></i>
        <i class="bi bi-align-end" title="Sağa Hizala"></i>
        <i class="bi bi-link-45deg" title="Bağlantı Ekle"></i>
        <i class="bi bi-images" title="Resim Ekle"></i>
        <i class="bi bi-x-lg" title="Kapat"></i>
    `;
  // Pozisyon ayarla
  Object.assign(baloon.style, {
    position: 'fixed',
    top: `${pos.top - 38}px`, // öğenin biraz üstüne
    left: `${pos.left}px`,
    padding: '8px 12px',
    background: '#222',
    height: '36px',
    color: '#fff',
    borderRadius: '23px',
    fontSize: '14px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
    opacity: '0,5'
  });

  document.body.appendChild(baloon);

  // Hafif animasyon efekti
  requestAnimationFrame(() => {
    baloon.style.opacity = '1';
  });

  // 2 saniye sonra otomatik kaybolsun
  setTimeout(() => {
    baloon.style.opacity = '0';
    setTimeout(() => baloon.remove(), 300);
  }, 2000);
}
