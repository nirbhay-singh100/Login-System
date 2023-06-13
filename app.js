require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const Register = require("./models/user")
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/signup", async (req, res) => {
    res.render("signup");
});

app.get("/login", async (req, res) => {
    res.render("login");
})

app.get("/LandingPage", async (req, res) =>{
    res.render("LandingPage");
})

app.post("/signup", async (req, res) => {
    //console.log(req.body);
    try{

        if(req.body.password === req.body.cpassword){
            const newUser = new Register({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });
            
            const token = await newUser.generateAuthToken();
            console.log(token);

            await newUser.save();
            res.redirect("login");
        } else {
            res.redirect("/signup");
        }
        
    } catch(error) {
        console.log(error);
        res.redirect("signup");
    }
    
});

app.post("/login", async (req, res) =>{
    try{
        const user = await Register.findOne({email: req.body.email})
        // console.log(user);
        const isPasswordSame = await bcrypt.compare(req.body.password, user.password);
        if(isPasswordSame){
            res.redirect("LandingPage");
        } else{
            res.render("login");
        }

        const token = await user.generateAuthToken();
        console.log(token);
        
    } catch(error) {
        console.log(error);
        res.redirect("login")
    }
});

app.listen(port, function(req, res){
    console.log("server is running on port 3000");
});
