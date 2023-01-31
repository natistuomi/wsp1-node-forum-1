const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});
const promisePool = pool.promise();

router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT * FROM nt19forum ORDER BY id DESC");
    res.render('index.njk', {
        rows: rows,
        title: 'Forum',
    });
});

router.post('/new', async function (req, res, next) {
    // Skapa en ny författare om den inte finns men du behöver kontrollera om användare finns!

    const { author, title, content } = req.body;

    let [user] = await promisePool.query('SELECT * FROM nt19users WHERE id = ?', [author]);
    if (!user) {
        user = await promisePool.query('INSERT INTO nt19users (name) VALUES (?)', [authorName]);
    }

    // user.insertId bör innehålla det nya ID:t för författaren
    const userId = user.insertId || user[0].id;

    // kör frågan för att skapa ett nytt inlägg
    const [rows] = await promisePool.query('INSERT INTO nt19forum (authorId, title, content) VALUES (?, ?, ?)', [userId, title, content]);

    res.send(rows)
});

router.get('/new', async function (req, res, next) {
    const [users] = await promisePool.query('SELECT * FROM nt19users');
    res.render('new.njk', {
        title: 'Nytt inlägg',
        users,
    });
});

module.exports = router;
