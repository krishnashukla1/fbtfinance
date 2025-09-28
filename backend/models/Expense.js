// const mongoose = require('mongoose');

// const expenseSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//     type: { type: String, required: true },  // <-- ADD THIS
//   amount: { type: Number, required: true },
//   category: { type: String }, // e.g., "Salary", "Stationary", "Maintenance"
//   date: { type: Date, default: Date.now },
//   notes: { type: String }
// }, { timestamps: true });

// module.exports = mongoose.model('Expense', expenseSchema);

//=============*============
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
    // type: { type: String, required: true },  // <-- ADD THIS
    type: { type: String, default: 'Expense' },

  amount: { type: Number, required: true },
    currency: { 
    type: String, 
    required: true,
    enum: ['USD', 'AED', 'INR', 'CAD', 'AUD'],
    default: 'INR'
  },
  // category: { type: String }, // e.g., "Salary", "Stationary", "Maintenance"
  category: { type: String, enum: ['Salaries','Incentives','Rent','Travel Allowance Agent','Travel Allowance Owner','Meta Recharge','Chargeback','Refunds','Miscellaneous Expenses','Call Payment','Others'] },

  date: { type: Date, default: Date.now },
  notes: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added user field
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);





