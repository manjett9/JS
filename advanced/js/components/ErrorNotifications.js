// Компонент уведомлений об ошибках
Vue.component('error-notifications', {
  props: ['notifications'],
  template: `
    <div class="notifications-container">
      <transition-group name="notification">
        <div class="notification" :class="notif.type" 
             v-for="(notif, index) in notifications" 
             :key="notif.id"
             @click="$emit('remove', notif.id)">
          {{ notif.message }}
          <div class="progress-bar"></div>
        </div>
      </transition-group>
    </div>
  `
});