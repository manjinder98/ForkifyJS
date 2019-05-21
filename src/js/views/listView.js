import { elements } from './base';

export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid="${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
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

export const renderRemoveButton = () => {
    const removeAllButton = `
        <button class="btn-small remove__btn">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Remove All</span>
        </button>
    `; 
    elements.shopping.insertAdjacentHTML('afterend', removeAllButton);
};

export const removeDeleteButton = () => {
    const button = document.querySelector('.remove__btn');
    button.parentElement.removeChild(button);
};

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if(item) item.parentElement.removeChild(item);
};

export const deleteAllItems = () => {
    const itemsDiv = elements.shopping;
    while (itemsDiv.firstChild) {
        itemsDiv.removeChild(itemsDiv.firstChild);
    }
};