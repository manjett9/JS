<template>
  <!-- Основной шаблон приложения -->
  <div id="app">
    <!-- Шапка сайта -->
    <header class="header">
      <div class="header__logo">eShop</div> <!-- Логотип магазина -->
      <!-- Компонент поиска -->
      <search-component v-model="searchLine"></search-component>
      <!-- Кнопка корзины -->
      <button class="header__cart-btn" @click="toggleCart">Корзина</button>
    </header>

    <main class="main">
      <!-- Секция с товарами -->
      <div class="products">
        <!-- Карточка товара -->
        <div class="product-card" v-for="item in filteredGoods" :key="item.id_product" :data-id="item.id_product">
          <div class="product-card__image">
            <!-- Эмодзи товара -->
            <h4 class="product-card__title">{{ item.emoji }}</h4>
          </div>
          <!-- Название товара -->
          <h3 class="product-card__name">{{ item.product_name }}</h3>
          <!-- Цена товара -->
          <p class="product-card__price">{{ item.price }}₽</p>
          <!-- Кнопка добавления в корзину -->
          <button class="product-card__add-btn" @click="addToCart(item)">Добавить в корзину</button>
        </div>
        <!-- Сообщение, если товары не найдены -->
        <p class="products__empty" v-if="filteredGoods.length === 0 && searchLine">
          Товары по запросу "{{ searchLine }}" не найдены
        </p>
      </div>

      <!-- Компонент корзины с передачей пропсов и обработкой событий -->
      <cart-component 
        :visible="isVisibleCart" 
        :items="cartItems" 
        :total="totalPrice" 
        :isEmpty="isCartEmpty"
        @toggle="toggleCart"
        @remove="removeFromCart"
        @checkout="openCartOrder"
      ></cart-component>

      <!-- Компонент формы заказа -->
      <order-form 
        :visible="isVisibleOrder" 
        :form="orderForm" 
        @close="closeCartOrder" 
        @submit="submitOrder"
      ></order-form>

      <!-- Компонент уведомлений об ошибках -->
      <error-notifications 
        :notifications="activeNotifications" 
        @remove="removeNotification"
      ></error-notifications>
    </main>
  </div>
</template>

<script>
// Импорт компонентов
import SearchComponent from '@/components/SearchComponent.vue'
import CartComponent from '@/components/CartComponent.vue'
import ErrorNotifications from '@/components/ErrorNotifications.vue'
import OrderForm from '@/components/OrderForm.vue'

export default {
  // Регистрация компонентов
  components: {
    SearchComponent,
    CartComponent,
    ErrorNotifications,
    OrderForm
  },

  data() {
    return {
      goods: [], // Список всех товаров
      searchLine: '', // Строка поиска
      cartItems: [], // Товары в корзине
      isVisibleCart: false, // Видимость корзины
      isVisibleOrder: false, // Видимость формы заказа
      orderForm: { // Данные формы заказа
        name: '', 
        phone: '', 
        email: '' 
      },
      notifications: [], // Список уведомлений
      nextNotificationId: 1 // Счетчик для ID уведомлений
    }
  },

  computed: {
    // Отфильтрованные товары по поисковому запросу
    filteredGoods() {
      if (!this.searchLine) return this.goods;
      try {
        const regex = new RegExp(this.searchLine, 'i'); // Регулярка для поиска
        return this.goods.filter(item => regex.test(item.product_name));
      } catch (e) {
        return this.goods;
      }
    },
    // Общая стоимость товаров в корзине
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    // Проверка пустоты корзины
    isCartEmpty() {
      return this.cartItems.length === 0;
    },
    // Активные уведомления (в обратном порядке)
    activeNotifications() {
      return this.notifications.slice().reverse();
    }
  },

  methods: {
    // Универсальный метод для GET-запросов
    makeGETRequest(url, callback) {
      fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => {
          console.error('Error:', error);
          this.showNotification('Ошибка загрузки данных', 'error');
        });
    },
    
    // Универсальный метод для POST-запросов
    makePOSTRequest(url, data, callback) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => {
          console.error('Error:', error);
          this.showNotification('Ошибка выполнения операции', 'error');
        });
    },
    
    // Загрузка товаров с сервера
    loadGoods() {
      this.makeGETRequest('/api/catalogData', (goods) => {
        this.goods = goods;
      });
    },
    
    // Загрузка корзины с сервера
    loadCart() {
      this.makeGETRequest('/api/cartData', (cartItems) => {
        this.cartItems = cartItems;
      });
    },
    
    // Переключение видимости корзины
    toggleCart() {
      this.isVisibleCart = !this.isVisibleCart;
      if (this.isVisibleCart) {
        this.loadCart(); // Загружаем корзину при открытии
      }
    },
    
    // Добавление товара в корзину
    addToCart(product) {
      const productToAdd = {
        id_product: product.id_product,
        product_name: product.product_name,
        price: product.price,
        quantity: 1
      };

      this.makePOSTRequest('/api/addToCart', productToAdd, (response) => {
        if (response.result === 1) {
          this.showNotification('Товар добавлен в корзину', 'success');
          this.loadCart();
        } else {
          this.showNotification('Не удалось добавить товар в корзину', 'error');
        }
      });
    },
    
    // Удаление товара из корзины
    removeFromCart(productId) {
      this.makePOSTRequest('/api/removeFromCart', { id_product: productId }, (response) => {
        if (response.result === 1) {
          this.showNotification('Товар удалён из корзины', 'success');
          this.loadCart();
        } else {
          this.showNotification('Не удалось удалить товар из корзины', 'error');
        }
      });
    },
    
    // Открытие формы заказа
    openCartOrder() {
      if (this.cartItems.length === 0) {
        this.showNotification('Корзина пуста', 'error');
        return;
      }
      this.isVisibleOrder = true;
      this.isVisibleCart = false;
    },
    
    // Закрытие формы заказа
    closeCartOrder() { 
      this.isVisibleOrder = false; 
    },
    
    // Отправка заказа
    submitOrder() {
      const total = this.totalPrice;
      this.makePOSTRequest('/api/clearCart', {}, (response) => {
        if (response.result === 1) {
          this.isVisibleOrder = false;
          this.cartItems = [];
          this.showNotification(`Заказ оформлен! Сумма: ${total}₽`, 'success');
          this.orderForm = { name: '', phone: '', email: '' };
        } else {
          this.showNotification('Не удалось оформить заказ', 'error');
        }
      });
    },
    
    // Показать уведомление
    showNotification(message, type) {
      const id = this.nextNotificationId++;
      this.notifications.push({ id, message, type });
      setTimeout(() => this.removeNotification(id), 5000); // Автоудаление через 5 сек
    },
    
    // Удалить уведомление
    removeNotification(id) {
      this.notifications = this.notifications.filter(notif => notif.id !== id);
    }
  },

  mounted() {
    this.loadGoods(); // Загружаем товары
    this.loadCart(); // Загружаем корзину
  }
}
</script>

<style lang="scss">
/* Глобальные стили */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #000000;
  background: #f9f9f9;
}

/* Стили шапки */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid black;
}

.header__logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: #000000;
}

.header__cart-btn {
  padding: 0.6rem 1.2rem;
  background: #000000;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.header__cart-btn:hover {
  background: #ffffff;
  color: rgb(0, 0, 0);
  outline: 1px solid rgb(0, 0, 0);
}

/* Основное содержимое */
.main {
  padding: 2rem;
}

/* Сетка товаров */
.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.products__empty {
  grid-column: 1/-1;
  text-align: center;
  color: #7f8c8d;
  font-size: 1.2rem;
}

/* Карточка товара */
.product-card {
  background: rgb(255, 255, 255);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid black;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-card__image {
  height: 200px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border-bottom: 1px solid black;
}

.product-card__title {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
}

.product-card__name {
  padding: 0.8rem 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.product-card__price {
  padding: 0 1rem;
  color: #5f5f5f;
  font-size: 1.2rem;
  font-weight: 700;
}

.product-card__add-btn {
  display: block;
  width: calc(100% - 2rem);
  margin: 1rem;
  padding: 0.6rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.product-card__add-btn:hover {
  background: #ffffff;
  color: rgb(0, 0, 0);
  outline: 1px solid rgb(0, 0, 0);
}
</style>