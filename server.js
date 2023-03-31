const mongoose = require("mongoose");
const app = require("./app");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
const PORT = process.env.PORT;

mongoose.connect(DB).then(() => {
  console.log("Connected to MongoDB successfully");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
