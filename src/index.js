const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const route = require("./routes/route.js");

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://iftekhar:Iftekhar123@cluster0.omtag.mongodb.net/group38Database?retryWrites=true&w=majority",

    {
      useNewUrlParser: true,
    }
)
  .then(() => console.log("MongoDb is Fire  🔥🔥 "))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
    console.log("Fire on Port " + (process.env.PORT || 3000 )+ "  🔥🔥");
  });
