// modal.js
export function createModal({
  title = "Başlık",
  content = "",
  width = "400px",
  headerColor = "#007bff",
  buttons = [],
  onOpen = null,
  onClose = null,
} = {}) {
  // Eski modal varsa kaldır
  const existing = document.getElementById('customModalWrapper');
  if (existing) existing.remove();

  // Ana sarmalayıcı
  const wrapper = document.createElement('div');
  wrapper.id = 'customModalWrapper';
  Object.assign(wrapper.style, {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    animation: 'fadeIn 0.25s ease',
  });

  // İç kutu
  const box = document.createElement('div');
  Object.assign(box.style, {
    width,
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideIn 0.2s ease',
  });

  // Üst başlık
  const header = document.createElement('div');
  Object.assign(header.style, {
    background: '#ffffff',
    color: '#000000ff',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    margin:"10px auto",
    width:'50%',
    minWidth:'290px',
    maxWidth:'400px',
    borderRadius: '50px',
    position:'relative',
  });
  header.textContent = title;

  // Kapat butonu
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  Object.assign(closeBtn.style, {
    background: 'transparent',
    border: 'none',
    fontSize: '22px',
    color: '#000000ff',
    cursor: 'pointer',
    position:'absolute',
    right: '20px'
  });
  header.appendChild(closeBtn);

  // İçerik
  const body = document.createElement('div');
  Object.assign(body.style, {
    padding: '16px',
    background: '#ffffff',
    borderRadius: "20px"
  });
  body.innerHTML = content;

  // Buton alanı
  const footer = document.createElement('div');
  Object.assign(footer.style, {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  });

  buttons.forEach((btn) => {
    const button = document.createElement('button');
    button.textContent = btn.text || 'Buton';
    Object.assign(button.style, {
      padding: '8px 20px',
      borderRadius: '30px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
    });

    // Buton tipi
    if (btn.type === 'primary') {
      button.style.background = headerColor;
      button.style.color = '#fff';
    } else if (btn.type === 'danger') {
      button.style.background = '#dc3545';
      button.style.color = '#fff';
    } else {
      button.style.background = '#f1f1f1';
      button.style.color = '#333';
    }

    // Olay bağlama
    button.addEventListener('click', () => {
      if (btn.onClick) btn.onClick(() => wrapper.remove());
    });

    footer.appendChild(button);
  });

  // Hiyerarşi
  box.appendChild(header);
  box.appendChild(body);
  if (buttons.length > 0) box.appendChild(footer);
  wrapper.appendChild(box);
  document.body.appendChild(wrapper);

  // Kapatma davranışları
  closeBtn.addEventListener('click', () => {
    wrapper.remove();
    if (onClose) onClose();
  });

  wrapper.addEventListener('click', (e) => {
    if (e.target === wrapper) {
      wrapper.remove();
      if (onClose) onClose();
    }
  });

  // Açılış callback’i
  if (onOpen) onOpen();
}

// --- Basit animasyon stilleri ekle (yalnızca bir kez)
if (!document.getElementById('modal-style-tag')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'modal-style-tag';
  styleTag.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }`;
  document.head.appendChild(styleTag);
}
