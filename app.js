require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const Register = require("./models/user")
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const prompt = require("prompt");
const path = require("path")


const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "js")));

app.get("/", (req, res) => {
    res.render("root");
})

app.get("/signup", async (req, res) => {
    res.render("signup");
});

app.get("/login", async (req, res) => {
    res.render("login");
})

app.get("/LandingPage", auth, async (req, res) =>{
    //console.log(`this cookie is osm ${req.cookies.jwt}`);
    
    res.render("LandingPage", {username: req.user.firstName});
})

app.get("/logout", auth, async (req, res)=> {
    try {
        //console.log(req.user);
        req.user.tokens = req.user.tokens.filter((currToken) => {
            return currToken.token != req.token
        });

        res.clearCookie("jwt");
        console.log("Logout succesfull");

        await req.user.save();
        res.redirect("/login");
    } catch (error) {
        res.status(500).send(error);
    }
})


app.post("/signup", async (req, res) => {
    //console.log(req.body);
    try{
        if(req.body.password === req.body.cpassword){

            const hashedPassword = await bcrypt.hash(req.body.password,10);
            //console.log(hashedPassword);
            const newUser = new Register({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashedPassword
            });
            
            const token = await newUser.generateAuthToken();
            //console.log(token);
            
            res.cookie("jwt", token, {
                expires: new Date(Date.now()+5000000),
                httpOnly: true
            });

            await newUser.save();
            error = false;
            res.redirect("login");
        } else {
            error = true;
            res.render("signup");
        }
        
    } catch(error) {
        console.log(error);
        error = true;
        res.render("signup");
    }
    
});

app.post("/login", async (req, res) =>{
    try{
        const password = req.body.password;
        const user = await Register.findOne({email: req.body.email})
        
        const isPasswordSame = await bcrypt.compare( password , user.password);
        
        if(isPasswordSame){
            const token = await user.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now()+5000000),
                httpOnly: true
            });
            
            //validation.test("nirbhay");
            res.redirect("LandingPage");
        } else{
            res.render("login");
        }
        
    } catch(error) {
        console.log(error);
        res.redirect("login")
    }
});

app.listen(port, function(req, res){
    console.log("server is running on port 3000");
});
