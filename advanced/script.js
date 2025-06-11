// URL API для загрузки данных о товарах
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Массив для хранения товаров в корзине
let cartItems = [];

// Рендер одного товара
function renderGoodsItem(item) {
    return `
            <div class="goods-item" data-id="${item.id_product}">
            <div class="goods-item-photo">
            <h4>${item.product_name}</h4>
            </div>
                <h3>${item.product_name}</h3>
                <p>${item.price}₽</p>
                <button onclick="addToCart(${item.id_product})">Добавить в корзину</button>
            </div>`;
}

// Отображение списка товаров на странице
function renderGoodsList(list) {
    const goodsList = document.querySelector('.goods-list');
    goodsList.innerHTML = list.map(item => renderGoodsItem(item)).join('');
}

// Ддобавление товара в корзину
function addToCart(productId) {
    // Находим товар по ID
    const product = goods.find(item => item.id_product === productId);
    if (product) {
        // Проверка на товар (есть ли в корзине)
        const existingItem = cartItems.find(item => item.product.id_product === productId);
        if (existingItem) {
            // Если есть - увеличивает количество
            existingItem.quantity++;
        } else {
            // Если нет - добавляет новый товар
            cartItems.push({
                product: product,
                quantity: 1
            });
        }
        // Обновление отображения корзины
        updateCartUI();
    }
}

// Обновление интерфейса корзины
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    // Рендер для каждого товара в корзине
    cartItemsContainer.innerHTML = cartItems.map(item => `
                <div class="cart-item" data-id="${item.product.id_product}">
                    <span>${item.product.product_name}</span>
                    <span>${item.product.price}₽ x${item.quantity}</span>
                    <button class="remove-button" onclick="removeFromCart(${item.product.id_product})">x</button>
                </div>
            `).join('');

    // Общая сумма заказа
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cartTotalPrice.textContent = `${total}₽`;
}

// Удаление товара из корзины
function removeFromCart(productId) {
    // Фильтр массива, для удаления товара с указанным ID
    cartItems = cartItems.filter(item => item.product.id_product !== productId);
    updateCartUI();
}

// Открытие модального окна корзины
function openCart() {
    document.getElementById('cartModal').style.display = 'block';
}

// Закрытие модального окна корзины
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Оформление заказа
function checkout() {
    // Общая сумма
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    // Сообщение о успешном оформлении
    alert(`Заказ оформлен! Сумма: ${total}₽`);
    // Очистка корзины
    cartItems = [];
    // Обновление интерфейса
    updateCartUI();
    // Закрытие модального окна
    closeCart();
}

// Загрузки товаров с сервера
async function loadGoods() {
    try {
        // Запрос к API
        const response = await fetch(`${API_URL}/catalogData.json`);
        // Принятие ответа
        goods = await response.json();
        // Отображение товаров на странице
        renderGoodsList(goods);
    } catch (error) {
        console.log('Ошибка загрузки товаров', error);
    }
}

// Загрузка товаров при загрузке страницы
loadGoods();