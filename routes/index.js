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
    const [rows] = await promisePool.query("SELECT * FROM nt19forum");
    res.render('index.njk', {
        rows: rows,
        title: 'Forum',
    });
});

router.post('/new', async function (req, res, next) {
    // Skapa en ny författare om den inte finns men du behöver kontrollera om användare finns!
    let [user] = await promisePool.query('SELECT * FROM nt19users WHERE id = ?', [authorId]);
    if (!user) {
        user = await promisePool.query('INSERT INTO nt19users (name) VALUES (?)', [authorName]);
    }

    // user.insertId bör innehålla det nya ID:t för författaren
    const userId = user.insertId || user[0].id;

    // kör frågan för att skapa ett nytt inlägg
    const [rows] = await promisePool.query('INSERT INTO nt19forum (authorId, title, content) VALUES (?, ?, ?)', [userId, title, content]);
});

router.get('/new', async function (req, res, next) {
    res.render('new.njk', {
        title: 'Nytt inlägg',
    });
})

module.exports = router;
