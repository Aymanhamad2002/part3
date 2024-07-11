const mongoose = require('mongoose')
const url = process.env.MONGODB_Url
mongoose.set('strictQuery',false)
console.log('connecting to the database')
mongoose.connect(url)
  .then(() => {
    console.log('connected to the database')
  }
  )
  .catch((error) => {
    console.log(error.message)
  })
const phoneSchema = new mongoose.Schema({
  name:{
    type:String,
    minLength: 3,

  },
  number:{
    type:String,
    minLength: 8,
    validate : {
      validator: (v) => {
        return /^\d{2,3}-\d{1,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    }
  }
})
phoneSchema.set('toJSON',{
  transform: (document , returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

  }
})

module.exports = mongoose.model('Phone',phoneSchema)