// Компонент поиска
Vue.component('search-component', {
  props: ['value'],
  template: `
    <div class="header__search-wrapper">
      <div class="header__search">
        <input 
          type="text" 
          class="search-input" 
          :value="value" 
          @input="$emit('input', $event.target.value)" 
          placeholder="Найти товары..."
        >
        <div 
          class="search-clear" 
          v-if="value" 
          @click="$emit('input', '')"
        >
          &#10006;
        </div>
      </div>
    </div>
  `
});