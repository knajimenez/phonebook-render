require('dotenv').config() // Load environment variables from .env file
const express = require('express') // Import the Express library
const morgan = require('morgan') // Import the Morgan library
const Person = require('./models/person') // Import the Person model

const app = express() // Create an Express application

app.use(express.json()) // Middleware to parse incoming JSON requests

morgan.token('body', (request) => JSON.stringify(request.body)) // Custom token for Morgan to log the request body
app.use(morgan(':method :url :status :response-time ms :body')) // Middleware to log requests in the console
app.use(express.static('dist')) // Middleware to serve static files from the dist directory


// Endpoint to get the root of the server
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Endpoint to get information about the phonebook
app.get('/info', (request, response) => {
    const date = new Date() // Get the current date and time
    Person.find({}) // Find all persons in the database
        .then(persons => {
            // Create a response string with the number of persons and the current date
            response.send(`Phonebook has info for ${persons.length} people <br> ${date}`)
        })
})

// Endpoint to get all persons in the phonebook
app.get('/api/persons', (request, response) => {
    Person.find({}) // Find all persons in the database
        .then(persons => {
            response.json(persons) // Respond with the list of persons
        })
})

// Endpoint to get a specific person by ID
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id) // Find a person by ID
        .then(person => {
            response.json(person) // Respond with the person's data
        })
})

// Endpoint to add a new person to the phonebook
app.post('/api/persons', (request, response) => {
    const body = request.body // Extract the request body

    const person = new Person({ // Create a new person object
        name: body.name, // Set the name from the request body
        number: body.number // Set the number from the request body
    })

    person.save() // Save the person to the database
        .then(savedPerson => {
            response.json(savedPerson) // Respond with the saved person's data
        })
})

// Endpoint to delete a person by ID
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id // Extract the ID from the request parameters
    persons = persons.filter(person => person.id !== id) // Remove the person with the matching ID
    response.status(204).end() // Respond with a 204 status (No Content)
})

// Start the server and listen on a port
const PORT = process.env.PORT || 3001 // Define the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`) // Log a message when the server starts
})