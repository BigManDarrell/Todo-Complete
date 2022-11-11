const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));

mongoose.connect(
  "mongodb+srv://admin-darrell:bandung60906@cluster0.6xltdwt.mongodb.net/todoDB",
  { useNewUrlParser: true }
);

const listSchema = {
  name: {
    type: String,
  },
};

const cListSchema = {
  name: String,
  lists: [listSchema],
};

const List = mongoose.model("List", listSchema);
const Custom = mongoose.model("Custom", cListSchema);

let list, cList, param, title, input, rmId, rmTitle;

app.get("/", (req, res) => {
  List.find((err, val) => {
    res.render("index", { title: "Today", lists: val });
  });
});

app.get("/:input", (req, res) => {
  param = _.startCase(_.toLower(req.params.input));
  Custom.findOne({ name: param }, (err, found) => {
    if (found == null) {
      cList = new Custom({ name: param, lists: [{ name: "" }] });
      cList.save();
      res.redirect(`/${param}`);
    } else {
      res.render("index", { title: found.name, lists: found.lists });
    }
  });
});

app.post("/", (req, res) => {
  title = req.body.btn;
  input = req.body.list;
  list = new List({ name: input });
  if (title == "Today") {
    list.save();
    res.redirect("/");
  } else {
    Custom.findOne({ name: title }, (err, found) => {
      found.lists.push(list);
      found.save();
      res.redirect(`/${title}`);
    });
  }
});

app.post("/rm", (req, res) => {
  rmId = req.body.btn;
  rmTitle = req.body.title;
  if (rmTitle == "Today") {
    List.findByIdAndDelete({ _id: rmId }, (err) => res.redirect("/"));
  } else {
    Custom.updateOne(
      { name: rmTitle },
      { $pull: { lists: { _id: rmId } } },
      { safe: true, multi: true },
      (err, obj) => res.redirect(`/${rmTitle}`)
    );
  }
});

app.listen(3000, () => console.log(`App listening on port 3000`));
