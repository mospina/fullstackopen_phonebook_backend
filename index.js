require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('postBody', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  } else {
    return ''
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

app.get('/info', (request, response) => {

  Person.find({}).then(persons =>
    response.send(`
      <h1>Phonebook API</h1>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `)
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(
    persons => response.json(persons)
  )
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({ name, number })

  person.save().then(
    savedPerson => response.json(savedPerson)
  ).catch(
    error => next(error)
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id).then(
    person => response.json(person)
  ).catch(
    error => next(error)
  )
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  const changes = { name, number }

  const options = {
    new: true,
    runValidators: true,
    context: 'query'
  }

  Person.findByIdAndUpdate(id, changes, options).then(
    person => {
      if (!person) {
        const error = new Error('Not found')
        error.name = 'CastError'
        throw error
      }

      return response.json(person)
    }
  ).catch(
    error => next(error)
  )
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndRemove(id).then(
    () => response.status(204).end()
  ).catch(
    error => next(error)
  )
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({
      name: 'CastError',
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      name: 'ValidationError',
      error: error.message
    })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)
