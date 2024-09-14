const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: 'Tamil Nadu', required: true },
  amountReceived: { type: Number, required: true },
  dateTime: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Form', formSchema)
