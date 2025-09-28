const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  //  type: { type: String, required: true },  // <-- ADD THIS
   type: { type: String, default: 'Income' },

  amount: { type: Number, required: true },

    currency: { 
    type: String, 
    required: true,
    enum: ['USD', 'AED', 'INR', 'CAD', 'AUD'],
    default: 'INR'
  },


  // category: { type: String }, // optional, e.g., "Donation", "Other"
  category: { type: String, enum: ['MCO Meta','MCO PPC','Meta Rental','Commission','Technology Sale','Domestic Tour Package','International Tour Package','Airline Ticket','Hotel','Car Hire','Activities','Airport Transfers','Visa', 'Others'] },

  date: { type: Date, default: Date.now },
  notes: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added user field
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);
