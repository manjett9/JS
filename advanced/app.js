// URL API данных о товарах
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Уведомление об ошибке
Vue.component('error-notification', {
    props: ['message', 'type'],
    template: `
    <div class="notification" :class="type" @click="$emit('close')">
      {{ message }}
      <div class="progress-bar"></div>
    </div>
  `,
    mounted() {
        // Автоматическое закрытие уведомления через 5 секунд
        this.timer = setTimeout(() => this.$emit('close'), 5000);
    },
    beforeDestroy() {
        // Очистка таймера при удалении компонента
        clearTimeout(this.timer);
    }
});

// Форма заказа
Vue.component('order-form', {
    props: ['visible', 'form'],
    data() {
        return {
            errors: { name: false, phone: false, email: false },
            errorMessages: { name: '', phone: '', email: '' }
        }
    },
    template: `
    <div class="cart-modal-order" v-if="visible">
      <div class="cart-content-order">
        <div class="cart-header-order">
          <h2>Оформление заказа</h2>
          <button class="close-cart-order" @click="$emit('close')">×</button>
        </div>
        <div class="cart-body-order">
          <div class="form-group" :class="{ 'error': errors.name }">
            <label>Имя:</label>
            <input type="text" class="form-area" v-model="form.name" 
                   @input="clearError('name')" placeholder="Ваше имя">
            <span class="error-message" v-if="errors.name">{{ errorMessages.name }}</span>
          </div>
          <div class="form-group" :class="{ 'error': errors.phone }">
            <label>Телефон:</label>
            <input type="tel" class="form-area" v-model="form.phone" 
                   @input="formatPhoneNumber" @keydown="handlePhoneKeyDown"
                   @focus="handlePhoneFocus" @blur="handlePhoneBlur"
                   placeholder="+7 (XXX) XXX-XXXX">
            <span class="error-message" v-if="errors.phone">{{ errorMessages.phone }}</span>
          </div>
          <div class="form-group" :class="{ 'error': errors.email }">
            <label>Email:</label>
            <input type="email" class="form-area" v-model="form.email" 
                   @input="clearError('email')" placeholder="Ваш Email">
            <span class="error-message" v-if="errors.email">{{ errorMessages.email }}</span>
          </div>
        </div>
        <button class="checkout-btn-order" @click="validate">Заказать</button>
      </div>
    </div>
  `,
    methods: {
        // Валидация формы
        validate() {
            let isValid = true;

            // Валидация имени
            if (!this.form.name.trim()) {
                this.errors.name = true;
                this.errorMessages.name = 'Введите имя';
                isValid = false;
            } else if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(this.form.name)) {
                this.errors.name = true;
                this.errorMessages.name = 'Только буквы';
                isValid = false;
            } else {
                this.errors.name = false;
            }

            // Валидация телефона
            if (!this.form.phone.trim()) {
                this.errors.phone = true;
                this.errorMessages.phone = 'Введите телефон';
                isValid = false;
            } else if (!/^\+7\s\(\d{3}\)\s\d{3}-\d{4}$/.test(this.form.phone)) {
                this.errors.phone = true;
                this.errorMessages.phone = 'Формат: +7 (XXX) XXX-XXXX';
                isValid = false;
            } else {
                this.errors.phone = false;
            }

            // Валидация email
            if (!this.form.email.trim()) {
                this.errors.email = true;
                this.errorMessages.email = 'Введите email';
                isValid = false;
            } else if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(this.form.email)) {
                this.errors.email = true;
                this.errorMessages.email = 'Некорректный email';
                isValid = false;
            } else {
                this.errors.email = false;
            }

            if (isValid) this.$emit('submit');
        },
        
        // Очистка ошибки для конкретного поля
        clearError(field) {
            this.errors[field] = false;
            this.errorMessages[field] = '';
        },
        
        // Форматирование номера телефона
        formatPhoneNumber() {
            let input = this.form.phone.replace(/\D/g, '');
            if (input.length > 0) {
                if (!input.startsWith('7') && !input.startsWith('8')) {
                    input = '7' + input;
                }
                if (input.startsWith('8')) {
                    input = '7' + input.substring(1);
                }
                
                let formatted = '+7';
                if (input.length > 1) {
                    formatted += ' (' + input.substring(1, 4);
                }
                if (input.length > 4) {
                    formatted += ') ' + input.substring(4, 7);
                }
                if (input.length > 7) {
                    formatted += '-' + input.substring(7, 11);
                }
                this.form.phone = formatted;
            }
        },
        
        // Обработка нажатия клавиш для телефона
        handlePhoneKeyDown(e) {
            // Разрешаем: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].includes(e.keyCode) || 
                // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+X
                (e.keyCode == 65 && e.ctrlKey === true) || 
                (e.keyCode == 67 && e.ctrlKey === true) ||
                (e.keyCode == 88 && e.ctrlKey === true) ||
                // Разрешаем: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            
            // Запрещаем все, кроме цифр
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        },
        
        // Обработка фокуса на поле телефона
        handlePhoneFocus() {
            if (!this.form.phone) {
                this.form.phone = '+7 (';
            }
        },
        
        // Обработка потери фокуса поля телефона
        handlePhoneBlur() {
            if (this.form.phone === '+7 (') {
                this.form.phone = '';
            }
        }
    }
});

// Класс элементов корзины
class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }
}

// Класс корзины
class Cart {
    constructor() {
        this.items = [];
    }

    // Добавление товара в корзину
    addItem(product) {
        const existingItem = this.items.find(item => item.product.id_product === product.id_product);
        existingItem ? existingItem.quantity++ : this.items.push(new CartItem(product));
    }

    // Удаление товара из корзины
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id_product !== productId);
    }

    // Получение общей стоимости товаров в корзине
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    // Очистка корзины
    clear() {
        this.items = [];
    }
}

new Vue({
    el: '#app',
    data() {
        return {
            goods: [], // Список товаров
            searchLine: '', // Строка поиска
            cart: new Cart(), // Экземпляр корзины
            isVisibleCart: false, // Видимость корзины
            isVisibleOrder: false, // Видимость формы заказа
            orderForm: { name: '', phone: '', email: '' }, // Данные формы заказа
            notifications: [], // Список уведомлений
            nextNotificationId: 1 // Счетчик ID для уведомлений
        };
    },
    computed: {
        // Фильтрация товаров по поисковому запросу
        filteredGoods() {
            if (!this.searchLine) return this.goods;
            try {
                const regex = new RegExp(this.searchLine, 'i');
                return this.goods.filter(item => regex.test(item.product_name));
            } catch (e) {
                return this.goods;
            }
        },
        // Элементы корзины
        cartItems() {
            return this.cart.items; 
        },
        // Общая стоимость товаров в корзине
        totalPrice() { 
            return this.cart.getTotalPrice();
        },
        // Проверка пустоты корзины
        isCartEmpty() { 
            return this.cart.items.length === 0; 
        },
        // Активные уведомления (в обратном порядке)
        activeNotifications() { 
            return this.notifications.slice().reverse(); 
        }
    },
    methods: {
        // Загрузка товаров с API
        async loadGoods() {
            try {
                const response = await fetch(`${API_URL}/catalogData.json`);
                if (!response.ok) throw new Error('Ошибка загрузки');
                this.goods = await response.json();
            } catch (error) {
                console.error('Ошибка:', error);
                this.showNotification('Не удалось загрузить товары', 'error');
            }
        },
        // Переключение видимости корзины
        toggleCart() { this.isVisibleCart = !this.isVisibleCart; },
        // Добавление товара в корзину
        addToCart(product) {
            this.cart.addItem(product);
            this.showNotification('Товар добавлен в корзину', 'success');
        },
        // Удаление товара из корзины
        removeFromCart(productId) {
            this.cart.removeItem(productId);
            this.showNotification('Товар удалён из корзины', 'success');
        },
        // Открытие формы заказа
        openCartOrder() {
            if (this.cart.items.length === 0) {
                this.showNotification('Корзина пуста', 'error');
                return;
            }
            this.isVisibleOrder = true;
            this.isVisibleCart = false;
        },
        // Закрытие формы заказа
        closeCartOrder() { this.isVisibleOrder = false; },
        // Оформление заказа
        submitOrder() {
            const total = this.totalPrice;
            this.cart.clear();
            this.isVisibleOrder = false;
            this.showNotification(`Заказ оформлен! Сумма: ${total}₽`, 'success');
            this.orderForm = { name: '', phone: '', email: '' };
        },
        // Показать уведомление
        showNotification(message, type) {
            const id = this.nextNotificationId++;
            this.notifications.push({ id, message, type });
            setTimeout(() => this.removeNotification(id), 5000);
        },
        // Удалить уведомление
        removeNotification(id) {
            this.notifications = this.notifications.filter(notif => notif.id !== id);
        }
    },
    // Загрузка товаров при монтировании компонента
    mounted() {
        this.loadGoods();
    }
});