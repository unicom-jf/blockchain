import express from "express";

const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
  res.send("hello, from express");
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT} ...`);
});
