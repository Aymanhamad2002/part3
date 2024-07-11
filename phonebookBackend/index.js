require('dotenv').config()
const express = require('express')
const app =  express()
const Phone = require('./models/phone')
const morgan = require('morgan')
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/api/persons',(request,response) => {
  Phone.find({}).then((result) => {
    response.json(result)
  })

})

app.get('/info',(request,response) => {
  const date = new Date()
  Phone.find({}).then(result => {
    response.send(`
        <div>Phonebook has ${result.length} info for people </div>
        <br/>
        <div>${date.toString()}</div>
    
        `)
  })
})
app.get('/api/persons/:id',(request,response,next) => {
  const id = request.params.id
  Phone.findById(id).then(result => {
    response.json(result)
  })
    .catch(error => next(error))
})
app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  Phone
    .findByIdAndDelete(id)
    .then((result) => response.json(result))

})

app.post('/api/persons',(request,response,next) => {
  const body = request.body
  const name = body.name
  const number = body.number
  const person = new Phone({
    name,
    number
  })
  person
    .save()
    .then(result => response.json(result))
    .catch(error => next(error))

})
app.put('/api/persons/:id',(request,response) => {
  const id = request.params.id
  const body = request.body
  const number =  body.number
  const name = body.name
  Phone
    .findByIdAndUpdate(id,{ name,number }, { context:'query',runValidators: true,new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })

})
const unkownEndPoint = (request,response) => {
  response.status(400).json({ error: 'wrong end point' })
}
app.use(unkownEndPoint)
const errorHandler = (error,request,response,next) => {
  console.log(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json( { error:error.message })
  }
  next(error)
}
app.use(errorHandler)
const PORT  = process.env.PORT

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})