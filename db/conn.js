const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://'+process.env.DB_HOST+'@cluster0.5ttr5oq.mongodb.net/'+process.env.DB_NAME, { useNewUrlParser: true});