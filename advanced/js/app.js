new Vue({
  el: '#app',
  data() {
    return {
      goods: [],          // Массив товаров из каталога
      searchLine: '',     // Строка поиска товаров
      cartItems: [],      // Товары в корзине
      isVisibleCart: false, // Видимость корзины
      isVisibleOrder: false, // Видимость формы заказа
      orderForm: {        // Данные формы заказа
        name: '', 
        phone: '', 
        email: '' 
      },
      notifications: [],  // Массив уведомлений
      nextNotificationId: 1 // Счетчик для генерации ID уведомлений
    };
  },
  
  computed: {
    // Фильтрует товары по строке поиска
    filteredGoods() {
      if (!this.searchLine) return this.goods;
      try {
        const regex = new RegExp(this.searchLine, 'i');
        return this.goods.filter(item => regex.test(item.product_name));
      } catch (e) {
        return this.goods;
      }
    },
    
    // Считает общую стоимость товаров в корзине
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // Проверяет, пуста ли корзина
    isCartEmpty() {
      return this.cartItems.length === 0;
    },
    
    // Возвращает уведомления в обратном порядке
    activeNotifications() {
      return this.notifications.slice().reverse();
    }
  },
  
  methods: {
    // Выполнение GET-запросов
    makeGETRequest(url, callback) {
      fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => {
          console.error('Error:', error);
          this.showNotification('Ошибка загрузки данных', 'error');
        });
    },

    // Выполнение POST-запросов
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

    // Загружает список товаров с сервера
    loadGoods() {
      this.makeGETRequest('/catalogData', (goods) => {
        this.goods = goods;
      });
    },

    // Загружает содержимое корзины с сервера
    loadCart() {
      this.makeGETRequest('/cartData', (cartItems) => {
        this.cartItems = cartItems;
      });
    },

    // Переключает видимость корзины
    toggleCart() {
      this.isVisibleCart = !this.isVisibleCart;
      if (this.isVisibleCart) {
        this.loadCart(); // При открытии корзины загружаем актуальные данные
      }
    },

    // Добавляет товар в корзину
    addToCart(product) {
      const productToAdd = {
        id_product: product.id_product,
        product_name: product.product_name,
        price: product.price,
        quantity: 1
      };

      this.makePOSTRequest('/addToCart', productToAdd, (response) => {
        if (response.result === 1) {
          this.showNotification('Товар добавлен в корзину', 'success');
          this.loadCart(); // Обновляем корзину после добавления
        } else {
          this.showNotification('Не удалось добавить товар в корзину', 'error');
        }
      });
    },

    // Удаляет товар из корзины
    removeFromCart(productId) {
      this.makePOSTRequest('/removeFromCart', { id_product: productId }, (response) => {
        if (response.result === 1) {
          this.showNotification('Товар удалён из корзины', 'success');
          this.loadCart(); // Обновляем корзину после удаления
        } else {
          this.showNotification('Не удалось удалить товар из корзины', 'error');
        }
      });
    },

    // Открывает форму оформления заказа
    openCartOrder() {
      if (this.cartItems.length === 0) {
        this.showNotification('Корзина пуста', 'error');
        return;
      }
      this.isVisibleOrder = true;
      this.isVisibleCart = false;
    },

    // Закрывает форму оформления заказа
    closeCartOrder() { this.isVisibleOrder = false; },

    // Отправляет заказ на сервер
    submitOrder() {
      const total = this.totalPrice;
      this.makePOSTRequest('/clearCart', {}, (response) => {
        if (response.result === 1) {
          this.isVisibleOrder = false;
          this.cartItems = []; // Очищаем корзину
          this.showNotification(`Заказ оформлен! Сумма: ${total}₽`, 'success');
          this.orderForm = { name: '', phone: '', email: '' }; // Сбрасываем форму
        } else {
          this.showNotification('Не удалось оформить заказ', 'error');
        }
      });
    },

    // Показывает уведомление
    showNotification(message, type) {
      const id = this.nextNotificationId++;
      this.notifications.push({ id, message, type });
      // Удаляем уведомление через 5 секунд
      setTimeout(() => this.removeNotification(id), 5000);
    },

    // Удаляет уведомление по ID
    removeNotification(id) {
      this.notifications = this.notifications.filter(notif => notif.id !== id);
    }
  },
  
  mounted() {
    this.loadGoods();  // Загружает товары при старте
    this.loadCart();   // Загружает корзину при старте
  }
});