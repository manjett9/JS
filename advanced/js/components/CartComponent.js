//Компонент корзины
Vue.component('cart-component', {
  props: ['visible', 'items', 'total', 'isEmpty'],
  template: `
    <div class="cart-modal" v-show="visible">
      <div class="cart">
        <div class="cart__header">
          <h2 class="cart__title">Корзина</h2>
          <button class="cart__close-btn" @click="$emit('toggle')">&#10006;</button>
        </div>
        <div class="cart__body">
          <div v-if="isEmpty" class="cart-empty">Ваша корзина пуста</div>
          <div v-else>
            <div class="cart-item" v-for="item in items" :key="item.id_product" :data-id="item.id_product">
              <span class="cart-item__name">{{ item.product_name }}</span>
              <span class="cart-item__price">{{ item.price }}₽ x{{ item.quantity }}</span>
              <button class="cart-item__remove-btn" @click="$emit('remove', item.id_product)">&#10006;</button>
            </div>
          </div>
        </div>
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