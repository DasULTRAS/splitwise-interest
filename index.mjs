import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import session from 'express-session';
import cors from 'cors';

const app = express();

// PostgreSQL Pool erstellen
const {Pool} = pkg;
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
});

app.set('port', 8080);

app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

function errorHandler(err, req, res, next) {
    console.log(err);
    res.status(500).json({error: err.message});
}

app.use(errorHandler);

app.get('/', async (req, res) => {
    if (req.session.loggedin) {
        try {
            const {rows} = await pool.query('SELECT * FROM persons');
            res.render('dashboard', {
                persons: rows
            });
        } catch (err) {
            throw err;
        }
    } else {
        res.render('login');
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const {rows} = await pool.query('SELECT password FROM users WHERE username = $1', [username]);

        console.log(rows);

        // for user in rows
        if (rows[0]) {
            const user = rows[0];
            if (bcrypt.compare(password, user.password)) {
                req.session.loggedin = true;
                res.redirect('/');
                return;
            }
        }
        res.send(401).render('login', {
            error: "Wrong credentials"
        });
    } catch (err) {
        console.error(err);
        res.send(500).redirect('/');
    }
});

app.listen(app.get('port'), console.log(`Server is running on Port ${app.get('port')}.`));
