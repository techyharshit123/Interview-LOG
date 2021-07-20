const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const methodOverride = require('method-override')
const morgan = require('morgan')
const connectDB = require('./config/db')
const passport = require('passport')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')


// Load Config
dotenv.config({ path: './config/config.env' })

//Passport Config
require('./config/passport')(passport)

// Connect to database
connectDB()

// Intialising app
const app = express()

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

// Loggings
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());



// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static

app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory

// Routes
app.use('/', require('./routes/index'))
app.use('/', require('./routes/auth'))
app.use('/', require('./routes/articles'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))