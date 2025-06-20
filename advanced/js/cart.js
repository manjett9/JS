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