// URL API данных о товарах
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

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