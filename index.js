const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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

const generateId = () => {
  const maxId =
    phoneBook.length > 0 ? Math.max(...phoneBook.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/api/persons", (req, res) => {
  res.json(phoneBook);
});

app.get("/info", (req, res) => {
  const time = Date();
  const phoneBookLength = phoneBook.length;

  res.send(
    `<p>PhoneBook has info on ${phoneBookLength} people</p><p>Information current as of ${time}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = phoneBook.find((p) => {
    return p.id === id;
  });
  if (person) {
    res.json(person);
  }
  res.status(404).end();
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
  const duplicateNameCheck = phoneBook.find(
    (p) => p.name.toLowerCase() === body.name.toLowerCase()
  );
  if (duplicateNameCheck) {
    return res.status(400).json({ error: "name already in phonebook" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phoneBook = phoneBook.concat(person);

  res.json(person);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
