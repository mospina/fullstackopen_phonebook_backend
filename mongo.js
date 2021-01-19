const mongoose = require('mongoose')

const [password, name, number] = process.argv.slice(2)

if (!password) {
  console.log('Password is required: node mongo.js <Password>')
  process.exit(1)
}

const CONN=`mongodb+srv://manucs:${password}@cluster0.m5bic.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const person = new Person({ name, number })
  person.save().then(() => {
    console.log(`Added ${name} ${number}`)
    mongoose.connection.close ()
  }).catch(error => console.log(error))
} else {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(({ name, number }) => console.log(name, number))
    mongoose.connection.close()
  }).catch(error => console.log(error))
}


