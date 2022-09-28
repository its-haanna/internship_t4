const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "user",
    secret: "task4",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
    },
  })
);

app.post('/register', (req, res) => {
  const username = req.body.username
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const login = 'N/A'
  const date = new Date()
  const registration = (date.toLocaleDateString() + ' ' + date.toLocaleTimeString())
  const status = 'Offline'

  bcrypt.hash(password, saltRounds, (err, hash) => {

    if(err) {
      console.log(err)
    }

    const sqlInsert = "INSERT INTO users (username, name, email, password, registration, login, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
    db.query(sqlInsert, [username, name, email, hash, registration, login, status], (err, result) => {
      console.log(err)
      res.send({message: err})
    })
  })
})

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]

  if (!token) {
    res.send("Token needed.")
  } else {
    jwt.verify(token, "task4", (err, decoded) => {
      if (err) {
        res.json({auth: false, message: "You failed to authenticate."})
      } else {
        req.userId = decoded.id;
        next()
      }
    })
  }
}

app.get("/isUserAuth", verifyJWT, (req, res) => {
  res.send("You are authenticated, congrats!")
})

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post('/login', (req, res) => {
  const id = req.body.id
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const date = new Date()
  const login = (date.toLocaleDateString() + ' ' + date.toLocaleTimeString())
  const newStatus = 'Online'

  const sqlUpdateLogin = "UPDATE users SET login = ? WHERE email = ?"
  db.query(sqlUpdateLogin, [login, email], (err, result) => {
    console.log(err)
  })

  const sqlUpdateStatus = "UPDATE users SET status = ? WHERE email = ?"
  db.query(sqlUpdateStatus, [newStatus, email], (err, result) => {
    console.log(err)
  })

  const sqlSelect = "SELECT * FROM users WHERE email = ?;"
  db.query(sqlSelect, [email], (err, result) => {
    if (err) {
      console.log(err)
    }

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (response) {
            const username = result[0].id
            const token = jwt.sign({id}, "task4", {expiresIn: 300})

            req.session.user = result;
            res.json({auth: true, token: token, result: result});
          } else {
            res.json({auth: false, message: "Wrong username/password combination!" })
          }
      })
    } else {
      res.json({auth: false, message: "Wrong username/password combination!" })
    }
  })
})

app.get('/dashboard', (req, res) => {
  const sqlSelect = "SELECT * FROM users";
  db.query(sqlSelect,(err, result) => {
    res.send(result)
  })
})

app.delete('/dashboard/remove/:id', (req, res) => {
  const username = req.params

  const sqlRemove = "DELETE FROM users WHERE id = ?"
  db.query(sqlRemove, username.id, (error, result) => {
    if (error) {
      console.log(error)
    }
  })
})

app.post('/dashboard/block/:id', (req, res) => {
  const status = 'Blocked'
  const username = req.params

  const sqlUpdateStatus = "UPDATE users SET status = ? WHERE id = ?"
  db.query(sqlUpdateStatus, [status, username.id], (err, result) => {
    console.log(err)
  })
})

app.post('/dashboard/unblock/:id', (req, res) => {
  const status = 'Offline'
  const username = req.params

  const sqlUpdateStatus = "UPDATE users SET status = ? WHERE id = ?"
  db.query(sqlUpdateStatus, [status, username.id], (err, result) => {
    console.log(err)
  })
})

app.get('/dashboard/logout/:id', (req,res) => {
  res.cookie('token', 'none', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true,
    })
    res.status(200).json({ success: true, message: 'User logged out successfully' })
})

app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
  console.log('running server');
});