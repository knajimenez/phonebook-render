const express = require('express') // Import the Express library
const morgan = require('morgan') // Import the Morgan library
const app = express() // Create an Express application

app.use(express.json()) // Middleware to parse incoming JSON requests

morgan.token('body', (request) => JSON.stringify(request.body)) // Custom token for Morgan to log the request body
app.use(morgan(':method :url :status :response-time ms :body')) // Middleware to log requests in the console

// Initial data for the phonebook
let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
// Endpoint to get the root of the server
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Endpoint to get information about the phonebook
app.get('/info', (request, response) => {
    const date = new Date() // Get the current date and time
    response.send(`Phonebook has info for ${persons.length} people <br> ${date}`) // Send the response
})

// Endpoint to get all persons in the phonebook
app.get('/api/persons', (request, response) => {
    response.json(persons) // Respond with the list of persons in JSON format
})

// Endpoint to get a specific person by ID
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id // Extract the ID from the request parameters
    const person = persons.find(person => person.id === id) // Find the person with the matching ID
    if (person) {
        response.json(person) // Respond with the person's data if found
    } else {
        response.status(404).end() // Respond with a 404 status if not found
    }
})

// Function to generate a random ID for new entries
const generateId = () => {
    const id = Math.floor(Math.random() * 1000000) // Generate a random number
    return id.toString() // Convert the number to a string
}

// Endpoint to add a new person to the phonebook
app.post('/api/persons', (request, response) => {
    const body = request.body // Extract the request body
    const existingPerson = persons.find(person => person.name === body.name) // Check if the name already exists

    if (existingPerson) {
        return response.status(400).json({
            error: 'name must be unique' // Respond with an error if the name is not unique
        })
    }

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing' // Respond with an error if the name is missing
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing' // Respond with an error if the number is missing
        })
    }

    const person = {
        id: generateId(), // Generate a unique ID for the new person
        name: body.name, // Use the name from the request body
        number: body.number, // Use the number from the request body
    }

    persons = persons.concat(person) // Add the new person to the list

    response.json(person) // Respond with the newly added person's data
})

// Endpoint to delete a person by ID
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id // Extract the ID from the request parameters
    persons = persons.filter(person => person.id !== id) // Remove the person with the matching ID
    response.status(204).end() // Respond with a 204 status (No Content)
})

// Start the server on port 3001
const PORT = process.env.PORT || 3001 // Define the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`) // Log a message when the server starts
})