const sqlite3 = require('sqlite3').verbose();

// Создаем или открываем базу данных
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('База данных подключена');
  }
});

// Создаем таблицу пользователей, если она еще не существует
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  plotNumber TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error('Ошибка при создании таблицы:', err.message);
  } else {
    console.log('Таблица пользователей создана');
  }
});

module.exports = db;
