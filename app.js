if(process.env.NODE_ENV !="production") {
    require('dotenv').config(); // .env file exceess library
}

const axios = require('axios');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError.js');


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const session = require('express-session');
const MongoStore = require('connect-mongo')
const flash = require('connect-flash');


const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require('./models/user.js');


app.engine("ejs", ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, '/public')))



const dbUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wanderlust';



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", () => {
    console.log("Error in Mongo Session Store")
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

// Session


app.use(session(sessionOption));
app.use(flash());

//  Passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main().then(() => console.log('Connected to DB')).catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl)
};



const TOMTOM_API_KEY = 'CcdtEIeRVsexoMS2mY9v7Kh7U51FYh8l';
// https://api.tomtom.com/search/2/geocode/{Agra}.json?key=CcdtEIeRVsexoMS2mY9v7Kh7U51FYh8l
app.get('/map', async(req, res) => {
    const address = "Dayal Bagh, Agra, India"  // Address from query params
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${TOMTOM_API_KEY}`;
    
    try {
        const response = await axios.get(url);
        res.send(response.data.results[0].position);
    } catch (error) {
        res.status(500).send('Error fetching geocode data');
    }
});




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get('/demouser', async (req, res) => {
    let fakeUser = new User({
        email: "demo@gmail.com",
        username : "delta"
    });

    const registedUser = await User.register(fakeUser, "1122");
    res.send(registedUser);
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)



app.all("*", (rea, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message="Something went wrong!"} = err;
    res.status(statusCode).render("./listings/error.ejs", {err});
});



app.listen(3000, () => console.log('Listening on port 3000'));