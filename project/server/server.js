const express = require('express'); 
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Настройка middleware
app.use(bodyParser.json()); // Разрешение парсинга JSON в теле запросов
app.use(express.static(path.join(__dirname, '../dist'))); // Настройка статической папки для фронтенда

// Создаем папку 'data', если она не существует
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Определение путей к файлам данных
const catalogPath = path.join(__dirname, 'catalog.json'); 
const cartPath = path.join(__dirname, 'cart.json'); 
const statsPath = path.join(__dirname, 'stats.json');

// Инициализация файлов с начальными данными, если они не существуют
if (!fs.existsSync(catalogPath)) {
  // Создание начального каталога товаров
  fs.writeFileSync(catalogPath, JSON.stringify([
    { id_product: 1, product_name: "Ноутбук", price: 45000, emoji: "💻" },
    { id_product: 2, product_name: "Смартфон", price: 30000, emoji: "📱" },
    { id_product: 3, product_name: "Наушники", price: 5000, emoji: "🎧" },
    { id_product: 4, product_name: "Клавиатура", price: 2500, emoji: "⌨️" },
    { id_product: 5, product_name: "Мышь", price: 1500, emoji: "🖱️" }
  ]));
}

if (!fs.existsSync(cartPath)) {
  // Создание пустой корзины
  fs.writeFileSync(cartPath, '[]');
}

if (!fs.existsSync(statsPath)) {
  // Создание пустой статистики
  fs.writeFileSync(statsPath, '[]');
}

// API endpoints (точки доступа API)

// Получение данных каталога
app.get('/api/catalogData', (req, res) => {
  fs.readFile(catalogPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('{"result": 0}'); // Ошибка сервера
    } else {
      res.send(data); // Отправка данных каталога
    }
  });
});

// Получение данных корзины
app.get('/api/cartData', (req, res) => {
  fs.readFile(cartPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('{"result": 0}');
    } else {
      res.send(data); // Отправка данных корзины
    }
  });
});

// Добавление товара в корзину
app.post('/api/addToCart', (req, res) => {
  fs.readFile(cartPath, 'utf8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const cart = JSON.parse(data); // Парсинг текущей корзины
      const item = req.body; // Получение товара из тела запроса

      // Проверка, есть ли товар уже в корзине
      const existingItem = cart.find(cartItem => cartItem.id_product === item.id_product);
      if (existingItem) {
        existingItem.quantity++; // Увеличение количества, если товар уже есть
      } else {
        item.quantity = 1; // Установка количества 1 для нового товара
        cart.push(item); // Добавление нового товара в корзину
      }

      // Сохранение обновленной корзины
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        if (err) {
          res.send('{"result": 0}');
        } else {
          logAction('add', item.product_name); // Логирование действия
          res.send('{"result": 1}'); // Успешное выполнение
        }
      });
    }
  });
});

// Удаление товара из корзины
app.post('/api/removeFromCart', (req, res) => {
  fs.readFile(cartPath, 'utf8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      let cart = JSON.parse(data); // Парсинг текущей корзины
      const productId = req.body.id_product; // ID товара для удаления
      // Получение имени товара для лога
      const productName = cart.find(item => item.id_product === productId)?.product_name;

      // Фильтрация корзины - удаление товара
      cart = cart.filter(item => item.id_product !== productId);

      // Сохранение обновленной корзины
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        if (err) {
          res.send('{"result": 0}')
        } else {
          if (productName) {
            logAction('remove', productName); // Логирование действия
          }
          res.send('{"result": 1}'); // Успешное выполнение
        }
      });
    }
  });
});

// Очистка корзины
app.post('/api/clearCart', (req, res) => {
  fs.writeFile(cartPath, '[]', (err) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      res.send('{"result": 1}'); // Успешное выполнение
    }
  });
});

// Функция для логирования действий с товарами
function logAction(action, productName) {
  fs.readFile(statsPath, 'utf8', (err, data) => {
    const stats = err ? [] : JSON.parse(data); // Чтение текущей статистики или создание новой
    // Добавление записи о действии
    stats.push({
      action, // Тип действия (add/remove)
      product_name: productName, // Название товара
      timestamp: new Date().toISOString() // Временная метка
    });

    // Сохранение обновленной статистики
    fs.writeFile(statsPath, JSON.stringify(stats), (err) => {
      if (err) console.error('Error writing stats:', err); // Логирование ошибки
    });
  });
}

// Запуск сервера на порту 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});