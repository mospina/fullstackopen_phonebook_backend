const express = require('express')

const app = express()

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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3009
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)  
