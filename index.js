const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time :body'))

let persons = [
  {
    id: 1,
    name: "Arto Helsinki",
    number: "123456789"
  },
  {
    id: 2,
    name: "Erto Allas",
    number: "987654321"
  },
  {
    id: 3,
    name: "BetaM Aster",
    number: "543216789"
  },
  {
    id: 4,
    name: "Estor Arkkes",
    number: "6789054321"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
	res.send(`
	<p>Phonebook has info for ${persons.length} persons</p>
	<p>${new Date()}</p>
	`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
	console.log(body.number)
	console.log(body.name)
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
	}

	console.log(persons.find(nr => nr.name.toLowerCase() === body.name.toLowerCase()))
	console.log(persons.find(nr => nr.number.toLowerCase() === body.number.toLowerCase()))

	if (persons.find(nr => nr.name.toLowerCase() === body.name.toLowerCase()) || persons.find(nr => nr.number.toLowerCase() === body.number.toLowerCase())) {
		return response.status(400).json({
			error: 'name or number already exists in phoenbook'
		})
	}

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})