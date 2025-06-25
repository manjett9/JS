<template>
  <!-- Модальное окно корзины -->
  <div class="cart-modal" v-show="visible">
    <!-- Основной контейнер корзины -->
    <div class="cart">
      <!-- Шапка корзины -->
      <div class="cart__header">
        <h2 class="cart__title">Корзина</h2>
        <!-- Кнопка закрытия -->
        <button class="cart__close-btn" @click="$emit('toggle')">&#10006;</button>
      </div>
      
      <!-- Тело корзины -->
      <div class="cart__body">
        <!-- Сообщение о пустой корзине -->
        <div v-if="isEmpty" class="cart-empty">Ваша корзина пуста</div>
        
        <!-- Список товаров, если корзина не пуста -->
        <div v-else>
          <!-- Элемент корзины -->
          <div class="cart-item" 
               v-for="item in items" 
               :key="item.id_product" 
               :data-id="item.id_product">
            <span class="cart-item__name">{{ item.product_name }}</span>
            <span class="cart-item__price">{{ item.price }}₽ x{{ item.quantity }}</span>
            <!-- Кнопка удаления -->
            <button class="cart-item__remove-btn" 
                    @click="$emit('remove', item.id_product)">
              &#10006;
            </button>
          </div>
        </div>
      </div>
      
      <!-- Подвал корзины -->
      <div class="cart__footer" v-if="!isEmpty">
        <!-- Блок с общей суммой -->
        <div class="cart-total">
          <span class="cart-total__label">Итого:</span>
          <span class="cart-total__value">{{ total }}₽</span>
        </div>
        <!-- Кнопка оформления заказа -->
        <button class="cart__checkout-btn" @click="$emit('checkout')">
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,    // Видимость корзины
    items: Array,       // Массив товаров в корзине
    total: Number,      // Общая сумма заказа
    isEmpty: Boolean    // Флаг пустой корзины
  }
}
</script>

<style scoped>
/* Стили модального окна */
.cart-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Полупрозрачный черный фон */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Поверх других элементов */
}

/* Основной блок корзины */
.cart {
  width: 90%;
  max-width: 800px; /* Максимальная ширина */
  max-height: 90vh; /* Максимальная высота */
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Скрывает содержимое за пределами скругленных углов */
}

/* Стили шапки */
.cart__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  background: #000000;
  color: white;
}

.cart__title {
  font-size: 1.4rem;
  font-weight: 600;
}

.cart__close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  transition: color 0.3s;
}

.cart__close-btn:hover {
  color: #ccc;
}

/* Стили тела корзины */
.cart__body {
  flex-grow: 1; /* Занимает все доступное пространство */
  padding: 1.5rem;
  overflow-y: auto; /* Прокрутка при переполнении */
}

/* Стили элемента корзины */
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #eee; /* Разделитель между элементами */
}

.cart-item__name {
  flex-grow: 1; /* Занимает все свободное пространство */
}

.cart-item__price {
  margin: 0 1rem;
  font-weight: 600;
}

.cart-item__remove-btn {
  background: #000000;
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%; /* Круглая кнопка */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.cart-item__remove-btn:hover {
  background: #ffffff;
  color: rgb(0, 0, 0);
  outline: 1px solid black;
}

/* Стили подвала */
.cart__footer {
  padding: 1.2rem 1.5rem;
  border-top: 1px solid #eee;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.cart__checkout-btn {
  width: 100%;
  padding: 0.8rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.cart__checkout-btn:hover {
  background: #ffffff;
  color: rgb(0, 0, 0);
  outline: 1px solid black;
}

/* Стили для пустой корзины */
.cart-empty {
  padding: 40px 20px;
  text-align: center;
  color: #7f8c8d;
  font-size: 1.2rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  margin: 20px;
  background: #f9f9f9;
}
</style>