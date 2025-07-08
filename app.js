const express = require('express')
const mongoose = require('mongoose');
const app = express();
const DailyChemical = require('./model/consumption.js'); 
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
const session = require('express-session');

const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./model/user.js');

const sessionOption ={
  // store,
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized: true,
  cookie :{
    expires :Date.now() +7 * 24 *60 * 60 *1000 ,
    maxAge : 7 * 24 *60 * 60 *1000 , SSS
    httpOnly :true,
  },
};
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main()
.then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));



async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/chemicalConsumption");
  // await mongoose.connect(dbUrl);

}

const port =8080

app.set("view engine","ejs");
const path = require("path");
app.set('views', path.join(__dirname, 'views'));



app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});

// Render form
// app.get("/home", (req, res) => {
//   res.render("home"); // your EJS form page
// });
app.get("/welcome",(req,res)=>{
  res.render("welcome");
})
app.get("/home", (req, res) => {
  res.render("home", { success: null, error: null });
});


// Handle form submission
// app.post("/home", async (req, res) => {
//   try {
//     const data = new DailyChemical({
//       DC_DATE: req.body.DC_DATE,
//       UNIT_CODE: req.body.UNIT_CODE,
//       CHEMICAL_CODE: req.body.CHEMICAL_CODE,
//       UOM: req.body.UOM,
//       SAP_MAT_CODE: req.body.SAP_MAT_CODE,
//       OPENING_BALANCE: req.body.OPENING_BALANCE,
//       RECIVE_QTY: req.body.RECIVE_QTY,
//       CONSUMPTION_QTY: req.body.CONSUMPTION_QTY,
//       CLOSING_BALANCE: req.body.CLOSING_BALANCE,
//       SAP_BALANCE: req.body.SAP_BALANCE,
//       REMARKS: req.body.REMARKS,
//       DATA_INSERT_DATE: new Date(),
//       UPDATE_DATE: new Date(),
//       UPDATE_STATUS: "Pending",
//       STATUS: "Active",
//       USER_ID: 1
//     });

//     await data.save();
//     console.log("data save suuceessfuly");
//      res.redirect("/home");
//       // res.redirect("/home", { success: true });
//   } catch (err) {
//     console.error("Error saving data:", err);
//     if (err.code === 11000) {
//       res.status(400).send("Duplicate entry for same date, unit, and chemical.");
//     } else {
//       res.status(500).send("Internal Server Error");
//     }
//   }
// });
app.post("/home", async (req, res) => {
  try {
    const data = new DailyChemical({
      DC_DATE: req.body.DC_DATE,
      UNIT_CODE: req.body.UNIT_CODE,
      CHEMICAL_CODE: req.body.CHEMICAL_CODE,
      UOM: req.body.UOM,
      SAP_MAT_CODE: req.body.SAP_MAT_CODE,
      OPENING_BALANCE: req.body.OPENING_BALANCE,
      RECIVE_QTY: req.body.RECIVE_QTY,
      CONSUMPTION_QTY: req.body.CONSUMPTION_QTY,
      CLOSING_BALANCE: req.body.CLOSING_BALANCE,
      SAP_BALANCE: req.body.SAP_BALANCE,
      REMARKS: req.body.REMARKS,
      DATA_INSERT_DATE: new Date(),
      UPDATE_DATE: new Date(),
      UPDATE_STATUS: "Pending",
      STATUS: "Active",
      USER_ID: 1
    });

    await data.save();
    console.log("data saved successfully");

    // Render form with success message
    res.render("home", { success: "Data saved successfully!", error: null });
  } catch (err) {
    console.error("Error saving data:", err);
    let errorMsg = "Internal Server Error";
    if (err.code === 11000) {
      errorMsg = "Duplicate entry for same date, unit, and chemical.";
    }

    // Render form with error message
    res.render("home", { success: null, error: errorMsg });
  }
});

app.get('/report', (req, res) => {
  res.render('report', {
    reportData: [],  // empty array so EJS doesn't break
    selectedUnit: null,
    startDate: null,
    endDate: null
  });
});


// POST route to fetch report data by date and unit
app.post('/report/search', async (req, res) => {
  const { unit, startDate, endDate } = req.body;

  try {
    const rawData = await DailyChemical.find({
      UNIT_CODE: unit,
      DC_DATE: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    // Send the data as-is, so the template can use the original field names
    res.render('report', {
      reportData: rawData,
      selectedUnit: unit,
      startDate,
      endDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch report data.");
  }
});



app.get("/signup",(req,res)=>{
  res.render("signup.ejs");
});

app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const user = await User.register(
      new User({ username, email }), // ✅ include email here
      password
    );

    req.login(user, (err) => {
      if (err) return res.status(500).send('Login after register failed');
      console.log("register and log in successfully");
      res.redirect('/home');
    });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',   // Redirect after successful login
  failureRedirect: '/login',  // Redirect back to login on failure
  failureFlash: false         // You can enable flash messages if you want
}));

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});


app.get("/login",(req,res)=>{
  res.render("login.ejs");
});