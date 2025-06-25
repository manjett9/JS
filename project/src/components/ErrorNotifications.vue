<template>
  <!-- Основной контейнер для уведомлений -->
  <div class="notifications-container">
    <transition-group name="notification">
      <!-- Отдельное уведомление -->
      <div class="notification" :class="notif.type" 
           v-for="(notif, index) in notifications" 
           :key="notif.id"
           @click="$emit('remove', notif.id)">
        <!-- Текст уведомления -->
        {{ notif.message }}
        <!-- Анимированная полоса прогресса -->
        <div class="progress-bar"></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  // Принимает массив уведомлений как входной параметр
  props: ['notifications']
}
</script>

<style scoped>
/* Контейнер для уведомлений */
.notifications-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1100;
}

/* Базовые стили для уведомления */
.notification {
  position: relative;
  padding: 15px 20px;
  border-radius: 5px;
  color: white;
  font-weight: 500;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  max-width: 300px;
}

/* Стили для уведомлений типа "success" */
.notification.success {
  background: #27ae60;
}

/* Стили для уведомлений типа "error" */
.notification.error {
  background: #e74c3c;
}

/* Полоса прогресса внизу уведомления */
.notification .progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.7);
  width: 100%;
  transform-origin: left;
  animation: progress 5s linear forwards;
}

/* Анимация уменьшения полосы прогресса */
@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Анимации для появления и исчезновения уведомлений */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>