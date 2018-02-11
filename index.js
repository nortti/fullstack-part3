const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('req', function (req) {
  return JSON.stringify(req.body)
})

const app = express()

app.use(morgan(':method :url :req :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(Person.format(person))
    })
    .catch(() => {
      res.status(404).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  Person
    .find({})
    .then(persons => {
      if (persons.map(Person.format).some(person => person.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' })
      }
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person
        .save()
        .then(createdPerson => {
          res.json(Person.format(createdPerson))
        })
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  if (!body.number) {
    return res.status(400).json({ error: 'number missing' })
  }

  Person
    .findByIdAndUpdate(req.params.id, { number: body.number }, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
})

app.get('/info', (req, res) => {
  const date = new Date()
  Person
    .count()
    .then(count => {
      let html = ''
      html += `<p>puhelinluettelossa on ${count} henkilön tiedot</p>`
      html += `<p>${date}</p>`
      res.send(html)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)

