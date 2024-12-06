const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();
const userRoute = require("./src/controllers/user-controller");
const quizRoute = require("./src/controllers/quiz-controller");
const { authenticate } = require("./src/services/user-service");
const router = express.Router();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/quiz", quizRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
