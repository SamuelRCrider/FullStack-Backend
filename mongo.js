const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log("new person added");
    mongoose.connection.close();
    process.exit(0);
  });
}

Person.find({}).then((result) => {
  console.log("PhoneBook");
  result.forEach((p) => {
    console.log(p.name, p.number);
  });
  mongoose.connection.close();
});
