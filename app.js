require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerYaml = YAML.load("./swagger.yaml");
const app = express();

const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const authenticateUser = require("./middleware/authentication");
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const isProductionEnv = app.get("env") === "production";
if (isProductionEnv) {
  app.set("trust proxy", 1);
  app.use(cors());
}

app.use(rateLimiter({
  windowsMs: 15 * 60 * 1000,
  max: 100
}));
app.use(express.json());
app.use(helmet());
app.use(xss());

// routes
app.get('/', (req, res) => {
  res.send('Welcome to the Jobs API. Access routes at /api/v1/auth and /api/v1/jobs.');
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerYaml));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
