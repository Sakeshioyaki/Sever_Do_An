const express = require("express");
const app = express();
const port = 8000;
const get_list_suggest = require("./API/getListSuggest");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/suggestData/", get_list_suggest);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Example app listening on port ${port}`);
});
