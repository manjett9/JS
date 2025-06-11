const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];

const renderGoodsItem = (title = 'Товар', price = 0) =>
    `<div class="goods-item">
    <div class="goods-item-photo">
    <h4>${title}</h4>
    </div>
    <h3>${title}</h3>
    <p>${price}₽</p>
    </div>`;

const renderGoodsList = (list = []) => {
    let goodsListHTML = '';
    for (let i = 0; i < list.length; i++) {
        goodsListHTML += renderGoodsItem(list[i].title, list[i].price);
    }
    document.querySelector('.goods-list').innerHTML = goodsListHTML;
}

function calculateTotalPrice(items) {
    return items.reduce((total, item) => total + item.price, 0);
}

class CartItem {
    constructor(product, quantity = 1) {
        // метод для работы с элементом корзины
    }

    getTotalPrice() {
        // возвращает общую стоимость товара
    }

    increaseQuantity(amount = 1) {
        // увеличивает количество товара
    }

    decreaseQuantity(amount = 1) {
        // уменьшает количество товара
    }

    updatePrice(newPrice) {
        // обновляет цену товара
    }
}

class Cart {
    constructor() {
        this.items = []; // массив объектов CartItem
    }

    addItem(product, quantity = 1) {
        // добавляет товар в корзину
    }

    removeItem(productId) {
        // удаляет товар из корзины по ID
    }

    clear() {
        // полностью очищает корзину
    }

    getTotalQuantity() {
        // возвращает общее количество товаров в корзине
    }

    getTotalPrice() {
        // возвращает общую стоимость всех товаров
    }

    updateItemQuantity(productId, newQuantity) {
        // изменяет количество конкретного товара
    }
}

renderGoodsList(goods);

const totalPrice = calculateTotalPrice(goods);
console.log('Общая стоимость всех товаров:', totalPrice + '₽');