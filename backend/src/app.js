const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const httpStatus = require("http-status");
const mongoSanitizer = require("express-mongo-sanitize");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/error.controller");

const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");
// const rateLimiter = require("./middlewares/rateLimiter");

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: "10kb" }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitizer());

// enable cors
app.use(cors());
app.options("*", cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quiz", quizRoutes);

// orphan route
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `No url is found like ${req.originalUrl} on this server`,
      httpStatus.NOT_FOUND
    )
  );
});

// global error handler
app.use(globalErrorHandler);

module.exports = app;
