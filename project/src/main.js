// Импорт основной библиотеки Vue
import Vue from 'vue';
// Импорт корневого компонента приложения
import App from './App.vue';

// Создание нового экземпляра Vue приложения
new Vue({
  render: h => h(App)
}).$mount('#app'); 