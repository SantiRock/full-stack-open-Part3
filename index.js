const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('dataPOST', function getData(req) {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan( ':method :url :status :res[content-length] - :response-time ms :dataPOST' ))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    const content = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `
    response.send(content)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).send('HTTP ERROR 404 - Not Found').end()
    }    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({error: 'name missing'})
    }

    if (!body.number) {
        return response.status(400).json({error: 'number missing'})
    }

    for (let person of persons) {
        if (person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase()) {
            return response.status(400).json({error: 'This contact already exists'})
        }
    }

    const person = {
        id: Math.floor(Math.random() * 1000000 + 5 ),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.json(persons)
    //console.log(request.body)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

