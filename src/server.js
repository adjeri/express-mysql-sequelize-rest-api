const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./models");
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error.middleware");
const brandRouter = require("./routes/brand.route");

const app = express();

dotenv.config();

app.use(express.json({ limit: "5mb" }));

app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

const port = Number(process.env.PORT || 8080);

db.sequelize.sync(/*{ force: true }*/).then(() => {
  console.log("Drop and re-sync db.");
});

app.use("/api/v1/brands", brandRouter);

// static files
app.use(express.static("public"));

// 404 error
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Route not found");
  next(err);
});

app.use(errorMiddleware);

app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));

module.exports = app;
