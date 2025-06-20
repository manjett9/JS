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