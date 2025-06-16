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
                <button class="add-button" onclick="addToCart(${item.id_product})">Добавить в корзину</button>
            </div>`;
}

// Отображение списка товаров на странице
function renderGoodsList(list) {
    const goodsList = document.querySelector('.goods-list');
    let html = '';
    for (let i = 0; i < list.length; i++) {
        html += renderGoodsItem(list[i]);
    }
    goodsList.innerHTML = html;
}

// Поиск товаров по регулярному выражению
function searchGoods() {
    // Значение из поля поиска
    const searchInput = document.getElementById('search-area').value.trim();

    // Если поле пустое - показывает все товары
    if (searchInput === '') {
        renderGoodsList(goods);
        return;
    }

    try {
        // - 'i' - регистронезависимый поиск
        // - игнорирует специальные символы, кроме указанных в шаблоне
        const regex = new RegExp(searchInput, 'i');

        // Фильтрация товаров
        const filteredGoods = [];
        for (let i = 0; i < goods.length; i++) {
            // Поиск совпадений в названии товара
            if (regex.test(goods[i].product_name)) {
                filteredGoods.push(goods[i]);
            }
        }
        //Вывод "Товары не найдены" если список товаров пуст
        if (filteredGoods.length === 0) {
            document.querySelector('.goods-list').innerHTML = `<p>Товары по запросу "${searchInput}" не найдены</p>`;
            return;
        }

        // Отображение результатов
        renderGoodsList(filteredGoods);

    } catch (e) {

    }
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
        // Уведомление
        showNotification(`Ваш товар успешно добавлен в корзину!`)
        // Обновление отображения корзины
        updateCartUI();
    }
}

// Обновление интерфейса корзины
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    // Рендер для каждого товара в корзине
    let cartItemsHTML = '';
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        cartItemsHTML += `
                <div class="cart-item" data-id="${item.product.id_product}">
                    <span>${item.product.product_name}</span>
                    <span>${item.product.price}₽ x${item.quantity}</span>
                    <button class="remove-button" onclick="removeFromCart(${item.product.id_product})">x</button>
                </div>
            `;
    }
    cartItemsContainer.innerHTML = cartItemsHTML;

    // Общая сумма заказа
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
        total += cartItems[i].product.price * cartItems[i].quantity;
    }
    cartTotalPrice.textContent = `${total}₽`;
}

// Удаление товара из корзины
function removeFromCart(productId) {
    // Фильтр массива, для удаления товара с указанным ID
    const newCartItems = [];
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].product.id_product !== productId) {
            newCartItems.push(cartItems[i]);
        }
    }
    cartItems = newCartItems;
    // Уведомление
    showNotification(`Вы успешно удалили товар из корзины!`)
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

function openCartOrder() {
    if (cartItems == "") {
        showNotificationBad(`Ваша корзина пуста!`)
    } else {
        document.getElementById('cartModalOrder').style.display = 'block';
        document.getElementById('cartModal').style.display = 'none';
    }
}

// Закрытие модального окна корзины
function closeCartOrder() {
    document.getElementById('cartModalOrder').style.display = 'none';
    document.getElementById('cartModal').style.display = 'block';
}

// Оформление заказа
function checkout() {
    // Общая сумма
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
        total += cartItems[i].product.price * cartItems[i].quantity;
    }
    // Очистка корзины
    cartItems = [];
    // Обновление интерфейса
    updateCartUI();
    // Закрытие модального окна
    closeCartOrder();
    closeCart();
    // Сообщение о успешном оформлении
    showNotification(`Заказ успешно оформлен! Сумма: ${total}₽`)
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

function showNotification(text) {
    // Настройка уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = text + '<div class="progress-bar"></div>';
    document.body.appendChild(notification);

    // Задержка анимации
    setTimeout(() => {
        notification.classList.add('show');
        notification.querySelector('.progress-bar').style.transform = 'scaleX(0)';
    }, 10);

    // Закрытие уведомления
    notification.onclick = () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    };

    // Автозакрытие через 5 секунд
    setTimeout(() => notification.onclick(), 5000);
}

function showNotificationBad(text) {
    // Настройка уведомления
    const notificationBad = document.createElement('div');
    notificationBad.className = 'notification-bad';
    notificationBad.innerHTML = text + '<div class="progress-bar-bad"></div>';
    document.body.appendChild(notificationBad);

    // Задержка анимации
    setTimeout(() => {
        notificationBad.classList.add('show-bad');
        notificationBad.querySelector('.progress-bar-bad').style.transform = 'scaleX(0)';
    }, 10);

    // Закрытие уведомления
    notificationBad.onclick = () => {
        notificationBad.classList.remove('show-bad');
        setTimeout(() => notificationBad.remove(), 300);
    };

    // Автозакрытие через 5 секунд
    setTimeout(() => notificationBad.onclick(), 5000);
}


//Сброс красной обводки текстовых полей при ошибке
function removeError(inputElement) {
    inputElement.classList.remove('error');
}

//Валидация формы
function validateForm() {
    let isValid = true;

    // Валидация Имени
    const name = document.getElementById('nameArea').value;
    if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name)) {
        document.getElementById('nameArea').classList.add('error');
        isValid = false;
        showNotificationBad(`Имя должно содержать только буквы!`)
        return false;
    }

    // Валидация Телефона
    const phone = document.getElementById('numberArea').value;
    if (!/^\+7\(\d{3}\)\d{3}-\d{4}$/.test(phone)) {
        document.getElementById('numberArea').classList.add('error');
        isValid = false;
        showNotificationBad(`Телефон должен иметь вид +7(000)000-0000!`)
        return false;
    }

    // Валидация E-mail
    const email = document.getElementById('emailArea').value;
    if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        document.getElementById('emailArea').classList.add('error');
        isValid = false;
        showNotificationBad(`E-mail должен иметь вид example@example.ru!`)
        return false;
    }

    if (isValid) {
        checkout()
        return true;
    }
}

// Загрузка товаров при загрузке страницы
loadGoods();