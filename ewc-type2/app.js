import { createModal } from './modal.js';



const saveBtn = document.getElementById('saveBtn');

// saveBtn.addEventListener('click', () => {
//   // Eğer zaten varsa tekrar ekleme
//   if (document.getElementById('shareBoxWrapper')) return;

//   // Ana sarmalayıcı
//   const wrapper = document.createElement('div');
//   wrapper.id = 'shareBoxWrapper';
//   wrapper.style.position = 'fixed';
//   wrapper.style.inset = '0';
//   wrapper.style.background = 'rgba(0,0,0,0.5)';
//   wrapper.style.display = 'flex';
//   wrapper.style.justifyContent = 'center';
//   wrapper.style.alignItems = 'center';
//   wrapper.style.zIndex = '999';

//   // İç kutu
//   const box = document.createElement('div');
//   box.id = 'shareBox';
//   box.style.background = '#fff';
//   box.style.width = '400px';
//   box.style.borderRadius = '12px';
//   box.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
//   box.style.overflow = 'hidden';
//   box.style.display = 'flex';
//   box.style.flexDirection = 'column';

//   // Üst kısım
//   const header = document.createElement('div');
//   header.className = 'shareBoxHeader';
//   header.style.background = '#007bff';
//   header.style.color = '#fff';
//   header.style.padding = '12px 16px';
//   header.style.display = 'flex';
//   header.style.justifyContent = 'space-between';
//   header.style.alignItems = 'center';

//   const title = document.createElement('span');
//   title.textContent = 'Paylaşım Ayarları';

//   const closeBtn = document.createElement('button');
//   closeBtn.textContent = '×';
//   closeBtn.style.background = 'transparent';
//   closeBtn.style.border = 'none';
//   closeBtn.style.fontSize = '22px';
//   closeBtn.style.color = '#fff';
//   closeBtn.style.cursor = 'pointer';

//   // İçerik kısmı
//   const content = document.createElement('div');
//   content.className = 'shareBoxContent';
//   content.style.padding = '16px';
//   content.innerHTML = '<p>Buraya paylaşım ayarları gelecek...</p>';

//   // Hiyerarşi: wrapper > box > header+content
//   header.appendChild(title);
//   header.appendChild(closeBtn);
//   box.appendChild(header);
//   box.appendChild(content);
//   wrapper.appendChild(box);
//   document.body.appendChild(wrapper);

//   // Kapatma olayları
//   closeBtn.addEventListener('click', () => wrapper.remove());
//   wrapper.addEventListener('click', (e) => {
//     if (e.target === wrapper) wrapper.remove();
//   });
// });

saveBtn.addEventListener('click', () => {
  createModal({
    title: "Paylaşım Ayarları",
    width: "70%",
    content: `
      <p>Bu yazıyı kimlerle paylaşmak istersiniz?</p>
      <label><input type="checkbox"> Herkese Açık</label><br>
      <label><input type="checkbox"> Sadece Ben</label><br>
      <label><input type="checkbox"> Takipçiler</label>
      <label><input type="checkbox"> Herkese Açık</label><br>
      <label><input type="checkbox"> Sadece Ben</label><br>
      <label><input type="checkbox"> Takipçiler</label>
      <label><input type="checkbox"> Herkese Açık</label><br>
      <label><input type="checkbox"> Sadece Ben</label><br>
      <label><input type="checkbox"> Takipçiler</label>
      <label><input type="checkbox"> Herkese Açık</label><br>
      <label><input type="checkbox"> Sadece Ben</label><br>
      <label><input type="checkbox"> Takipçiler</label>
    `,
    buttons: [
      {
        text: "Daft",
        type: "secondary",
        onClick: (close) => close()
      },
      {
        text: "Publish",
        type: "primary",
        onClick: (close) => {
          alert("Kaydedildi!");
          close();
        }
      }
      
    ],
    onOpen: () => console.log("Modal açıldı"),
    onClose: () => console.log("Modal kapandı")
  });

});
// function createModal({
//   title = "Başlık",
//   content = "",
//   width = "400px",
//   headerColor = "#007bff",
//   buttons = [],
//   onOpen = null,
//   onClose = null,
// } = {}) {
//   // Eski modal varsa kaldır
//   const existing = document.getElementById('customModalWrapper');
//   if (existing) existing.remove();

//   // Ana sarmalayıcı
//   const wrapper = document.createElement('div');
//   wrapper.id = 'customModalWrapper';
//   Object.assign(wrapper.style, {
//     position: 'fixed',
//     inset: 0,
//     background: 'rgba(0,0,0,0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//     animation: 'fadeIn 0.25s ease',
//   });

//   // Kutu
//   const box = document.createElement('div');
//   Object.assign(box.style, {
//     background: '#fff',
//     width,
//     borderRadius: '12px',
//     boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
//     overflow: 'hidden',
//     display: 'flex',
//     flexDirection: 'column',
//     animation: 'slideIn 0.2s ease',
//   });

//   // Üst başlık
//   const header = document.createElement('div');
//   Object.assign(header.style, {
//     background: headerColor,
//     color: '#fff',
//     padding: '12px 16px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     fontSize: '16px',
//     fontWeight: 'bold',
//   });
//   header.textContent = title;

//   // Kapat butonu
//   const closeBtn = document.createElement('button');
//   closeBtn.textContent = '×';
//   Object.assign(closeBtn.style, {
//     background: 'transparent',
//     border: 'none',
//     fontSize: '22px',
//     color: '#fff',
//     cursor: 'pointer',
//     marginLeft: 'auto',
//   });
//   header.appendChild(closeBtn);

//   // İçerik
//   const body = document.createElement('div');
//   Object.assign(body.style, {
//     padding: '16px',
//   });
//   body.innerHTML = content;

//   // Buton alanı
//   const footer = document.createElement('div');
//   Object.assign(footer.style, {
//     padding: '12px 16px',
//     display: 'flex',
//     justifyContent: 'flex-end',
//     gap: '8px',
//     borderTop: '1px solid #eee',
//   });

//   buttons.forEach((btn) => {
//     const button = document.createElement('button');
//     button.textContent = btn.text || 'Buton';
//     Object.assign(button.style, {
//       padding: '8px 14px',
//       borderRadius: '6px',
//       border: 'none',
//       cursor: 'pointer',
//       fontSize: '14px',
//     });

//     // Buton tipi
//     if (btn.type === 'primary') {
//       button.style.background = headerColor;
//       button.style.color = '#fff';
//     } else if (btn.type === 'danger') {
//       button.style.background = '#dc3545';
//       button.style.color = '#fff';
//     } else {
//       button.style.background = '#f1f1f1';
//       button.style.color = '#333';
//     }

//     // Olay bağlama
//     button.addEventListener('click', () => {
//       if (btn.onClick) btn.onClick(() => wrapper.remove());
//     });

//     footer.appendChild(button);
//   });

//   // Hiyerarşi
//   box.appendChild(header);
//   box.appendChild(body);
//   if (buttons.length > 0) box.appendChild(footer);
//   wrapper.appendChild(box);
//   document.body.appendChild(wrapper);

//   // Kapatma davranışları
//   closeBtn.addEventListener('click', () => {
//     wrapper.remove();
//     if (onClose) onClose();
//   });

//   wrapper.addEventListener('click', (e) => {
//     if (e.target === wrapper) {
//       wrapper.remove();
//       if (onClose) onClose();
//     }
//   });

//   // Açılış callback’i
//   if (onOpen) onOpen();
// }

// // Animasyonlar (isteğe bağlı)
// const styleTag = document.createElement('style');
// styleTag.textContent = `
// @keyframes fadeIn {
//   from { opacity: 0; } to { opacity: 1; }
// }
// @keyframes slideIn {
//   from { transform: translateY(-10px); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// }`;
// document.head.appendChild(styleTag);
