<template>
  <!-- Модальное окно оформления заказа -->
  <div class="cart-modal-order" v-if="visible">
    <div class="cart-content-order">
      <!-- Шапка модалки -->
      <div class="cart-header-order">
        <h2>Оформление заказа</h2>
        <!-- Кнопка закрытия -->
        <button class="close-cart-order" @click="$emit('close')">×</button>
      </div>
      
      <!-- Тело модалки с формой -->
      <div class="cart-body-order">
        <!-- Поле для имени с валидацией -->
        <div class="form-group" :class="{ 'error': errors.name }">
          <label>Имя:</label>
          <input type="text" class="form-area" v-model="form.name" 
                 @input="clearError('name')" placeholder="Ваше имя">
          <!-- Сообщение об ошибке -->
          <span class="error-message" v-if="errors.name">{{ errorMessages.name }}</span>
        </div>
        
        <!-- Поле для телефона с маской ввода -->
        <div class="form-group" :class="{ 'error': errors.phone }">
          <label>Телефон:</label>
          <input type="tel" class="form-area" v-model="form.phone" 
                 @input="formatPhoneNumber" @keydown="handlePhoneKeyDown"
                 @focus="handlePhoneFocus" @blur="handlePhoneBlur"
                 placeholder="+7 (XXX) XXX-XXXX">
          <span class="error-message" v-if="errors.phone">{{ errorMessages.phone }}</span>
        </div>
        
        <!-- Поле для email с валидацией -->
        <div class="form-group" :class="{ 'error': errors.email }">
          <label>Email:</label>
          <input type="email" class="form-area" v-model="form.email" 
                 @input="clearError('email')" placeholder="Ваш Email">
          <span class="error-message" v-if="errors.email">{{ errorMessages.email }}</span>
        </div>
      </div>
      
      <!-- Кнопка отправки формы -->
      <button class="checkout-btn-order" @click="validate">Заказать</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['visible', 'form'],
  
  data() {
    return {
      // Объекты для хранения ошибок и сообщений
      errors: { name: false, phone: false, email: false },
      errorMessages: { name: '', phone: '', email: '' }
    }
  },
  
  methods: {
    // Валидация формы перед отправкой
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

      // Валидация телефона (формат +7 (XXX) XXX-XXXX)
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

      // Если все поля валидны - эмитим событие submit
      if (isValid) this.$emit('submit');
    },
    
    // Очистка ошибки при вводе в поле
    clearError(field) {
      this.errors[field] = false;
      this.errorMessages[field] = '';
    },
    
    // Форматирование номера телефона по маске
    formatPhoneNumber() {
      let input = this.form.phone.replace(/\D/g, '');
      if (input.length > 0) {
        // Приводим к формату +7
        if (!input.startsWith('7') && !input.startsWith('8')) {
          input = '7' + input;
        }
        if (input.startsWith('8')) {
          input = '7' + input.substring(1);
        }
        
        // Форматируем по шаблону +7 (XXX) XXX-XXXX
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
    
    // Обработка нажатий клавиш для поля телефона
    handlePhoneKeyDown(e) {
      // Разрешаем: delete, backspace, tab, escape, enter, ctrl+a, ctrl+c, ctrl+x, home, end, стрелки
      if ([46, 8, 9, 27, 13].includes(e.keyCode) || 
          (e.keyCode == 65 && e.ctrlKey === true) || 
          (e.keyCode == 67 && e.ctrlKey === true) ||
          (e.keyCode == 88 && e.ctrlKey === true) ||
          (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      
      // Запрещаем все кроме цифр
      if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    },
    
    // Автозаполнение +7 ( при фокусе
    handlePhoneFocus() {
      if (!this.form.phone) {
        this.form.phone = '+7 (';
      }
    },
    
    // Очистка если осталось только +7 (
    handlePhoneBlur() {
      if (this.form.phone === '+7 (') {
        this.form.phone = '';
      }
    }
  }
}
</script>

<style scoped>
/* Стили для модального окна */
.cart-modal-order {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Стили для контента модалки */
.cart-content-order {
  width: 90%;
  max-width: 600px;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
}

/* Шапка модалки */
.cart-header-order {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.cart-header-order h2 {
  font-size: 1.4rem;
  color: #000000;
}

/* Кнопка закрытия */
.close-cart-order {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
}

/* Тело модалки */
.cart-body-order {
  display: grid;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

/* Группа полей формы */
.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
}

/* Поля ввода */
.form-area {
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-area:focus {
  outline: none;
  border-color: #000000;
}

/* Кнопка отправки */
.checkout-btn-order {
  width: 100%;
  padding: 0.8rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn-order:hover {
  background: #ffffff;
  color: rgb(0, 0, 0);
  outline: 1px solid black;
}

/* Стили для ошибок */
.form-group.error .form-area {
  border-color: #ff4444;
  color: #ff4444;
  background: #ffebee;
}

.error-message {
  color: #ff4444;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}
</style>