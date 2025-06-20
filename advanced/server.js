const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static('.'));

// Получение списка товаров
app.get('/catalogData', (req, res) => {
    fs.readFile('catalog.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('{"result": 0}');
        } else {
            res.send(data);
        }
    });
});

// Получение содержимого корзины
app.get('/cartData', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('{"result": 0}');
        } else {
            res.send(data);
        }
    });
});

// Добавление товара в корзину
app.post('/addToCart', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
            const cart = JSON.parse(data);
            const item = req.body;

            // Проверяем, есть ли уже такой товар в корзине
            const existingItem = cart.find(cartItem => cartItem.id_product === item.id_product);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                item.quantity = 1;
                cart.push(item);
            }

            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    // Записываем действие в статистику
                    logAction('add', item.product_name);
                    res.send('{"result": 1}');
                }
            });
        }
    });
});

// Удаление товара из корзины
app.post('/removeFromCart', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
            let cart = JSON.parse(data);
            const productId = req.body.id_product;
            const productName = cart.find(item => item.id_product === productId)?.product_name;

            cart = cart.filter(item => item.id_product !== productId);

            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    // Записываем действие в статистику
                    if (productName) {
                        logAction('remove', productName);
                    }
                    res.send('{"result": 1}');
                }
            });
        }
    });
});

// Очистка корзины
app.post('/clearCart', (req, res) => {
    fs.writeFile('cart.json', '[]', (err) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
            res.send('{"result": 1}');
        }
    });
});

// Функция для логирования действий
function logAction(action, productName) {
    fs.readFile('stats.json', 'utf8', (err, data) => {
        const stats = err ? [] : JSON.parse(data);
        stats.push({
            action,
            product_name: productName,
            timestamp: new Date().toISOString()
        });

        fs.writeFile('stats.json', JSON.stringify(stats), (err) => {
            if (err) console.error('Error writing stats:', err);
        });
    });
}

app.listen(3000, function () {
    console.log('server is running on port 3000!');
});