import { Icons } from "./icons.js";

export const BalloonElementUI = `
  <button data-cmd="moveUp">${Icons.arrowUp}</button>
  <button data-cmd="moveDown">${Icons.arrowDown}</button>
  <button data-cmd="settings">${Icons.settings}</button>
  <button data-cmd="delete">${Icons.trash}</button>

  <div class="line"></div>

  <button data-cmd="widthSmall">${Icons.widthSmall}</button>
  <button data-cmd="widthMedium">${Icons.widthMedium}</button>
  <button data-cmd="widthFull">${Icons.widthFull}</button>
`;
