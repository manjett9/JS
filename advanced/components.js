// URL API данных о товарах
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Компонент поиска
Vue.component('search-component', {
  props: ['value'],
  template: `
    <div class="header__search">
      <input 
        type="text" 
        class="search-input" 
        :value="value" 
        @input="$emit('input', $event.target.value)" 
        placeholder="Найти товары..."
      >
    </div>
  `
});

// Компонент корзины
Vue.component('cart-component', {
  props: ['visible', 'items', 'total', 'isEmpty'],
  template: `
    <div class="cart-modal" v-show="visible">
      <div class="cart">
        <!-- Заголовок корзины -->
        <div class="cart__header">
          <h2 class="cart__title">Корзина</h2>
          <button class="cart__close-btn" @click="$emit('toggle')">x</button>
        </div>
        <!-- Тело корзины -->
        <div class="cart__body">
          <div v-if="isEmpty" class="cart-empty">Ваша корзина пуста</div>
          <div v-else>
            <!-- Элемент корзины -->
            <div class="cart-item" v-for="item in items" :key="item.product.id_product" :data-id="item.product.id_product">
              <span class="cart-item__name">{{ item.product.product_name }}</span>
              <span class="cart-item__price">{{ item.product.price }}₽ x{{ item.quantity }}</span>
              <button class="cart-item__remove-btn" @click="$emit('remove', item.product.id_product)">x</button>
            </div>
          </div>
        </div>
        <!-- Футер корзины -->
        <div class="cart__footer" v-if="!isEmpty">
          <div class="cart-total">
            <span class="cart-total__label">Итого:</span>
            <span class="cart-total__value">{{ total }}₽</span>
          </div>
          <button class="cart__checkout-btn" @click="$emit('checkout')">Оформить заказ</button>
        </div>
      </div>
    </div>
  `
});

// Компонент уведомлений об ошибках
Vue.component('error-notifications', {
  props: ['notifications'],
  template: `
    <div class="notifications-container">
      <transition-group name="notification">
        <div class="notification" :class="notif.type" 
             v-for="(notif, index) in notifications" 
             :key="notif.id"
             @click="$emit('remove', notif.id)">
          {{ notif.message }}
          <div class="progress-bar"></div>
        </div>
      </transition-group>
    </div>
  `
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