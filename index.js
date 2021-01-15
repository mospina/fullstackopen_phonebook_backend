const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('postBody', (request, response) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  } else {
    return ''
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "91 000 111",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]
 
app.get('/', (request, response) => {
  response.send('<h1>Phonebook API</h1>')
})

app.get('/info', (request, response) => {
  response.send(`
    <h1>Phonebook API</h1>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body
  
  if (!name || !number) {
    return response.status(400).json({
      error: 'name and number are required'
    })  
  }

  if (persons.find(p => p.name === name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })  
  }

  const person = {
    name,
    number,
    id: generateId()
  }

  persons = [...persons, person]
    
  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => Math.floor(Math.random() * Math.floor(1000000));

const PORT = process.env.PORT || 3009
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)  
