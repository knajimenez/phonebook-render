require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('person', request => {
    if (request.method === "POST") {
        return JSON.stringify(request.body)
    } else {
        return ""
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

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

const generateId = () => {
    /* const maxId = persons.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1 */

    const randomId = Math.floor(Math.random() * 65536)
    return randomId
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'Name is required'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'Number is required'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

/* app.get('/api/info', (request, response) => {
    response.send(`
    <div>
        Phonebook has info for ${persons.length} people
    </div>
    <span>${new Date().toString()}</span>
    `)
})
 */
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})