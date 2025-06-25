<template>
  <!-- Основной контейнер для поиска -->
  <div class="header__search-wrapper">
    <!-- Блок с элементами поиска -->
    <div class="header__search">
      <input 
        type="text" 
        class="search-input" 
        :value="value" 
        @input="$emit('input', $event.target.value)" 
        placeholder="Найти товары..."
      >
      <!-- Кнопка очистки -->
      <div 
        class="search-clear" 
        v-if="value" 
        @click="$emit('input', '')"
      >
        &#10006; <!-- Символ крестика -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style scoped>
/* Основной контейнер */
.header__search-wrapper {
  flex-grow: 1; 
  margin: 0 2rem; 
  max-width: 500px; 
  position: relative;
}

/* Контейнер элементов поиска */
.header__search {
  position: relative;
  width: 100%;
}

/* Поле ввода */
.search-input {
  width: 100%;
  padding: 0.6rem 35px 0.6rem 1rem; /* Отступ справа для кнопки очистки */
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s; /* Плавное изменение цвета границы */
  background: #fff;
}

/* Кнопка очистки */
.search-clear {
  position: absolute; /* Абсолютное позиционирование */
  right: 10px; /* Позиция справа */
  top: 50%; /* Вертикальное центрирование */
  transform: translateY(-50%); /* Точное центрирование */
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: #999; /* Цвет крестика */
  font-size: 1.4rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
}

/* Эффект при наведении на кнопку очистки */
.search-clear:hover {
  color: #333;
}

/* Убираем стандартный outline при фокусе */
.search-input:focus {
  outline: none;
}
</style>