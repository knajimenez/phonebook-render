require('dotenv').config() // Load environment variables from .env file
const express = require('express') // Import the Express library
const morgan = require('morgan') // Import the Morgan library
const Person = require('./models/person') // Import the Person model

const app = express() // Create an Express application

// Middleware to handle errors
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(express.json()) // Middleware to parse incoming JSON requests
app.use(express.static('dist')) // Middleware to serve static files from the dist directory
morgan.token('body', (request) => JSON.stringify(request.body)) // Custom token for Morgan to log the request body
app.use(morgan(':method :url :status :response-time ms :body')) // Middleware to log requests in the console


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
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id) // Find a person by ID
        .then(person => {
            if (person) {
                response.json(person) // Respond with the person's data
            } else {
                response.status(404).end() // Respond with a 404 Not Found status if the person is not found
            }
        })
        .catch(error => {
            next(error) // Pass any errors to the error handler middleware
        })
})

// Endpoint to add a new person to the phonebook
app.post('/api/persons', (request, response, next) => {
    const body = request.body // Extract the request body

    const person = new Person({ // Create a new person object
        name: body.name, // Set the name from the request body
        number: body.number // Set the number from the request body
    })

    person.save() // Save the person to the database
        .then(savedPerson => {
            response.json(savedPerson) // Respond with the saved person's data
        })
        .catch(error => {
            next(error) // Pass any errors to the error handler middleware
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body // Extract name and number from the request body

    Person.findById(request.params.id) // Find the person by ID
        .then(person => {
            if (!person) { // If the person is not found
                return response.status(404).end() // Respond with a 404 Not Found status
            }

            person.name = name // Update the person's name
            person.number = number // Update the person's number

            return person.save().then(updatedPerson => {
                response.json(updatedPerson) // Respond with the updated person's data
            }) // Save the updated person to the database
        })
        .catch(error => {
            next(error) // Pass any errors to the error handler middleware
        })
})

// Endpoint to delete a person by ID
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id) // Find and delete the person by ID
        .then(() => {
            response.status(204).end() // Respond with a 204 No Content status
        })
        .catch(error => {
            next(error) // Pass any errors to the error handler middleware
        })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })// // Respond with a 404 Not Found status for unknown endpoints
}

app.use(unknownEndpoint) // Middleware to handle unknown endpoints
app.use(errorHandler) // Middleware to handle errors

// Start the server and listen on a port
const PORT = process.env.PORT || 3001 // Define the port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`) // Log a message when the server starts
})