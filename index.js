require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/people");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let phoneBook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/info", (req, res) => {
  const time = Date();
  const phoneBookLength = phoneBook.length;

  res.send(
    `<p>PhoneBook has info on ${phoneBookLength} people</p><p>Information current as of ${time}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      console.log("id doesn't exist:", error.message);
      res.status(404).end();
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.name) {
    return res.status(400).json({ error: "missing name" });
  }
  if (!body.number) {
    return res.status(400).json({ error: "missing number" });
  }
  //   Person.find({ name: body.name })
  //     .then((person) => {
  //       return res.status(400).json({ error: "name already in phonebook" });
  //     })
  //     .catch((error) => {
  //       console.log(
  //         "hurray! no person matches so go ahead and add em!... wait I don't know how because I would have to make a promise in a promise"
  //       );
  //     });

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  phoneBook = phoneBook.filter((person) => person.id !== id);
  res.status(204).end();
});

// const unknownEndpoint = (req, res) => {
//   res.status(404).json({ error: "app failure, unknown endpoint" });
// };

// app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
