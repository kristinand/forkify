import { elements } from './base';

export const renderItem = (item) => {
  const markup = `
    <li class="shopping__item" data-itemid="${item.id}">
      <div class="shopping__count">
        <input type="number" value="${item.count}" min="${getStepFromCount(item.count)}" step="${getStepFromCount(item.count)}" class="shopping__count-value">
        <p>${item.unit}</p>
      </div>
      <p class="shopping__description">${item.ingredient}</p>
      <button class="shopping__delete btn-tiny">
        <svg>
          <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
      </button>
    </li>
  `;

  elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const getStepFromCount = (count) => {
  return Number.isInteger(count) ? '1' : '0.' + ('' + count).split('.')[1];
};

export const deleteItem = (id) => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  item.parentElement.removeChild(item);
};

export const updateItemCount = (id, newCount) => {
  const item = document.querySelector(`[data-itemid="${id}"]`).firstElementChild.firstElementChild;
  item.value = newCount;
};
