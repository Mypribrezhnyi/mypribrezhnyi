const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('./db'); // Подключаем базу данных
const app = express();
const port = 3000;

// Парсим данные из формы
app.use(bodyParser.urlencoded({ extended: true }));

// Рендерим страницу авторизации
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Обработка авторизации
app.post('/login', (req, res) => {
  const { phone, password } = req.body;

  // Поиск пользователя в базе данных
  db.get('SELECT * FROM users WHERE phone = ? AND password = ?', [phone, password], (err, row) => {
    if (err) {
      return res.status(500).send('Ошибка при проверке данных');
    }

    if (row) {
      // Если пользователь найден, показываем номер участка
      res.send(`Добро пожаловать, ${row.phone}. Номер участка: ${row.plotNumber}`);
    } else {
      // Если не найден, выводим ошибку
      res.send(`<script>document.getElementById('error-message').textContent = 'Неверный номер телефона или пароль!';</script>`);
    }
  });
});

// Страница админки для добавления данных пользователей
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});

// Обработка добавления пользователя через админку
app.post('/admin/add-user', (req, res) => {
  const { phone, password, plotNumber } = req.body;

  // Вставка нового пользователя в базу данных
  const stmt = db.prepare('INSERT INTO users (phone, password, plotNumber) VALUES (?, ?, ?)');
  stmt.run(phone, password, plotNumber, function (err) {
    if (err) {
      return res.status(500).send('Ошибка при добавлении пользователя');
    }

    res.send('Пользователь добавлен');
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
