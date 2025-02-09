const path = require("path");
const express = require("express");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");

const Blog = require("./models/blog");

const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const blogRoute = require("./routes/blog");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://localhost:27017/blogism")
  .then((e) => console.log("Mongo DB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());

app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
