require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const userRoutes = require("./routes/userRoutes");
const sequelize = require('./hellpers/service');
app.use(bodyParser.json()); 




const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.use("/api", userRoutes);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
});
