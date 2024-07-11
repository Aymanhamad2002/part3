require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_Url
mongoose.set('strictQuery',false)
mongoose.connect(url).then(() => console.log( 'connected to database '))
const phoneSchema = new mongoose.Schema({
  name: String,
  number : String,



})
const Phone = mongoose.model('Phone',phoneSchema)

const phoneData = new Phone({
  name : process.argv[2],
  number: process.argv[3]
})
phoneData.save().then(() => {
  console.log(`added ${phoneData.name} number ${phoneData.number} to phonebook`)
  mongoose.connection.close()
})

