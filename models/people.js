const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("connecting to database...");

mongoose
  .connect(url)
  .then((result) => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (v) => {
        const twoDash = /\d{2}-\d/.test(v);
        const threeDash = /\d{3}-\d/.test(v);
        if (twoDash === false && threeDash === false) return false;
        return true;
      },
      message: "Number patterns: 00-000000 or 000-00000",
    },
  },
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
