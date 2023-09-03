require('./db');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Message = mongoose.model('Message');

//express
const express = require('express');
const app = express();

//static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//template engine
app.set('view engine', 'ejs');

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session
const session = require('express-session');
const sessionOptions = {
    secret: 'not a secret',
    resave: true,
    saveUninitialized: true,
};
app.use(session(sessionOptions));

//passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
app.use(require('express-flash')());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log(socket.id + ' connected');
    socket.on('disconnect', () => console.log(socket.id + ' disconnected'));
    socket.on('message', async data => {
        const message = new Message({
            username: data.username,
            content: data.content,
            timestamp : data.time
        });
        await message.save();
        io.emit('message', message);
    });
});

//routes
app.get('/', (req, res) => {
    res.render('login');
})

app.get('/chat', async (req, res) => {
    if (req.isAuthenticated()) {
        const allMessages = await Message.find().sort({timestamp: -1});
        res.render('chat', {allMessages: allMessages});
    } else {
        res.redirect('/');
    }
});

app.get('/username', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({username: req.user.username});
    } else {
        res.json({username: null});
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/chat',
    failureRedirect: '/',
    failureFlash: true
}));

app.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/chat');
            });
        }
    });
});

app.post('/logout', (req, res) => { 
    req.logout((err) => {
        if (err) {
            req.flash('error', err.message);
        }
        res.redirect('/');
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server listening on port ${port}`));