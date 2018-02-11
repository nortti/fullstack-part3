const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

morgan.token('req', function (req, res) {
   return JSON.stringify(req.body) }
  )

const app = express()

app.use(morgan(':method :url :req :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
app.use(cors())

let persons = [
  {
    'name': 'Arto Hellas',
    'number': '040-123456',
    'id': 1
  },
  {
    'name': 'Matti Tienari',
    'number': '040-123456',
    'id': 2
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log(persons)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({error: 'name or number missing'})
  }

  if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({error: 'name must be unique'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 5000) + 1
  }
  persons.push(person)

  res.json(person)
})

app.get('/info', (req, res) => {
  const date = new Date()
  const personCount = persons.length
  let html = ''
  html += `<p>puhelinluettelossa on ${personCount} henkilön tiedot</p>`
  html += `<p>${date}</p>`
  res.send(html)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

