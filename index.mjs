import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import session from 'express-session';
import cors from 'cors';

const app = express();
const db = new sqlite3.Database('./db/database.db');

app.set('port', 8080);

app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// Error handler middleware
function errorHandler(err, req, res, next) {
    console.log(err);
    res.json({error: err});
    res.status(500).send('Something broke!');
}
app.use(errorHandler);

app.get('/', (req, res) => {
    if (req.session.loggedin) {
        db.all('SELECT * FROM persons', [], (err, rows) => {
            if (err) {
                throw err;
            }
            res.render('dashboard', {
                persons: rows
            });
        });
    } else {
        res.render('login');
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT password FROM users WHERE username = ?', [username], (err, row) => {
        if (err || !row) {
            if (err)
                console.error(err);
            return res.redirect('/');
        }

        if (bcrypt.compareSync(password, row.password)) {
            req.session.loggedin = true;
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    });
});

app.listen(app.get('port'), console.log(`Server is running on Port ${app.get('port')}.`));
