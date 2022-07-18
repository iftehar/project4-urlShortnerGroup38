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
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port " + (process.env.PORT || 3000));
  });
