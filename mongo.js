const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.DB_URL

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const args = process.argv.slice(2)

if (args.length === 0) {
  Person
    .find({})
    .then(persons => {
      console.log('puhelinluettelo:')
      persons.forEach(person => console.log(person.name, person.number))
      mongoose.connection.close()
    })
} else if (args.length === 2) {
  const person = new Person({
    name: args[0],
    number: args[1]
  })
  person
    .save()
    .then(() => {
      mongoose.connection.close()
    })
}


