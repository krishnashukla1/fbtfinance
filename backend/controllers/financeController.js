// const Income = require('../models/Income');
// const Expense = require('../models/Expense');
// const ExcelJS = require('exceljs');
// // Add new income


// const addIncome = async (req, res) => {
//   try {
//     const { title, type, amount, date, category } = req.body;
//     const income = new Income({
//       title,
//       type,
//       amount,
//       date,
//       category,
//       user: req.user.id,
//     });
//     await income.save();
//     res.status(201).json({ success: true, income });
    
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };



// const addExpense = async (req, res) => {
//   try {
//     const { title, type, amount, date, category } = req.body;
//     const expense = new Expense({  
//       title,
//       type,
//       amount,
//       date,
//       category,
//       user: req.user.id,
//     });
//     await expense.save();
//     res.status(201).json({ success: true, expense });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// // Get all incomes
// const getIncomes = async (req, res) => {
//   try {
//     const incomes = await Income.find().sort({ date: -1 });
//     res.json(incomes);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all expenses
// const getExpenses = async (req, res) => {
//   try {
//     const expenses = await Expense.find().sort({ date: -1 });
//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Summary: total income, total expense, balance
// const getFinanceSummary = async (req, res) => {
//   try {
//     const incomes = await Income.find();
//     const expenses = await Expense.find();

//     const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
//     const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
//     const balance = totalIncome - totalExpense;

//     res.json({ totalIncome, totalExpense, balance });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// // Update income
// const updateIncome = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const income = await Income.findByIdAndUpdate(id, req.body, { new: true });
//     if (!income) return res.status(404).json({ message: 'Income not found' });
//     res.json({ message: 'Income updated', income });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete income
// const deleteIncome = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const income = await Income.findByIdAndDelete(id);
//     if (!income) return res.status(404).json({ message: 'Income not found' });
//     res.json({ message: 'Income deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Update expense
// const updateExpense = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const expense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
//     if (!expense) return res.status(404).json({ message: 'Expense not found' });
//     res.json({ message: 'Expense updated', expense });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete expense
// const deleteExpense = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const expense = await Expense.findByIdAndDelete(id);
//     if (!expense) return res.status(404).json({ message: 'Expense not found' });
//     res.json({ message: 'Expense deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // const downloadFinanceExcel = async (req, res) => {
// //   try {
// //     const incomes = await Income.find().sort({ date: -1 });
// //     const expenses = await Expense.find().sort({ date: -1 });

// //     const workbook = new ExcelJS.Workbook();
// //     const worksheet = workbook.addWorksheet('Finance Report');

// //     // Headers
// //     worksheet.columns = [
// //       { header: 'Type', key: 'type', width: 15 },
// //       { header: 'Title', key: 'title', width: 30 },
// //       { header: 'Amount (₹)', key: 'amount', width: 15 },
// //       { header: 'Date', key: 'date', width: 20 }
// //     ];

// //     // Income rows
// //     incomes.forEach(i => {
// //       worksheet.addRow({
// //         type: 'Income',
// //         title: i.title,
// //         amount: i.amount,
// //         date: new Date(i.date).toLocaleDateString()
// //       });
// //     });

// //     // Expense rows
// //     expenses.forEach(e => {
// //       worksheet.addRow({
// //         type: 'Expense',
// //         title: e.title,
// //         amount: e.amount,
// //         date: new Date(e.date).toLocaleDateString()
// //       });
// //     });

// //     // Styling header
// //     worksheet.getRow(1).eachCell(cell => {
// //       cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
// //       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E86C1' } };
// //     });

// //     res.setHeader(
// //       'Content-Disposition',
// //       'attachment; filename="finance_report.xlsx"'
// //     );
// //     res.setHeader(
// //       'Content-Type',
// //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// //     );

// //     await workbook.xlsx.write(res);
// //     res.end();
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// const downloadFinanceExcel = async (req, res) => {
//   try {
//     const incomes = await Income.find().sort({ date: -1 });
//     const expenses = await Expense.find().sort({ date: -1 });

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Finance Report');

//     // Headers
//     worksheet.columns = [
//       { header: 'Type', key: 'type', width: 15 },
//       { header: 'Title', key: 'title', width: 30 },
//       { header: 'Category', key: 'category', width: 20 },   // ✅ Added category
//       { header: 'Amount (₹)', key: 'amount', width: 15 },
//       { header: 'Date', key: 'date', width: 20 }
//     ];

//     // Income rows
//     incomes.forEach(i => {
//       worksheet.addRow({
//         type: 'Income',
//         title: i.title,
//         category: i.category || '-',   // ✅ handle empty category
//         amount: i.amount,
//         date: new Date(i.date).toLocaleDateString()
//       });
//     });

//     // Expense rows
//     expenses.forEach(e => {
//       worksheet.addRow({
//         type: 'Expense',
//         title: e.title,
//         category: e.category || '-',   // ✅ handle empty category
//         amount: e.amount,
//         date: new Date(e.date).toLocaleDateString()
//       });
//     });

//     // Styling header row
//     worksheet.getRow(1).eachCell(cell => {
//       cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FF2E86C1' }
//       };
//     });

//     res.setHeader(
//       'Content-Disposition',
//       'attachment; filename="finance_report.xlsx"'
//     );
//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     );

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = { addIncome, addExpense, getIncomes, getExpenses, getFinanceSummary ,  updateIncome,
//   deleteIncome,
//   updateExpense,
//   deleteExpense, downloadFinanceExcel};

//============*===========

//=======================HARDCODED CURRENCY==============

const Income = require('../models/Income');
const Expense = require('../models/Expense');
const ExcelJS = require('exceljs');

// ✅ Add new income
const addIncome = async (req, res) => {
  try {
    const { title, type, amount,currency, date, category, notes } = req.body;
    if (!title || !type || !amount || !date) {
      return res.status(400).json({ success: false, message: "Title, type, amount, and date are required" });
    }
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be a positive number" });
    }
    if (!Date.parse(date)) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const income = new Income({
      title,
      type,
      amount: Number(amount),
        currency: currency || 'INR', // Use provided currency or default to INR
      date: new Date(date),
      category: category || undefined,
      notes,
      user: req.user.id,
    });

    await income.save();
    res.status(201).json({ success: true, message: "Income added successfully", income });
  } catch (err) {
    console.error("❌ Error adding income:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Add new expense
const addExpense = async (req, res) => {
  try {
    const { title, type, amount,currency, date, category, notes } = req.body;
    if (!title || !type || !amount || !date) {
      return res.status(400).json({ success: false, message: "Title, type, amount, and date are required" });
    }
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be a positive number" });
    }
    if (!Date.parse(date)) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const expense = new Expense({
      title,
      type,
      amount: Number(amount),
      currency: currency || 'INR', // Use provided currency or default to INR
      date: new Date(date),
      category: category || undefined,
      notes,
      user: req.user.id,
    });

    await expense.save();
    res.status(201).json({ success: true, message: "Expense added successfully", expense });
  } catch (err) {
    console.error("❌ Error adding expense:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


const getIncomes = async (req, res) => {
  try {
    const { month, year, type, category } = req.query;
    let filter = {}; // Remove user filter to show ALL data to everyone

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }
    if (type) filter.type = type;
    if (category) filter.category = category;

    const incomes = await Income.find(filter).sort({ date: -1 });
    res.json({ success: true, incomes });
  } catch (err) {
    console.error("❌ Error fetching incomes:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Get expenses with filters
const getExpenses = async (req, res) => {
  try {
    const { month, year, type, category } = req.query;
    let filter = {}; // Remove user filter to show ALL data to everyone

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }
    if (type) filter.type = type;
    if (category) filter.category = category;

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json({ success: true, expenses });
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


// ✅ Finance Summary WITH CURRENCY CONVERSION
const getFinanceSummary = async (req, res) => {
  try {
    const { month, year, currency = 'INR' } = req.query;
    // let dateFilter = { user: req.user.id };
     let dateFilter = {};

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      dateFilter.date = { $gte: start, $lte: end };
    }

    const [incomes, expenses] = await Promise.all([
      Income.find(dateFilter),
      Expense.find(dateFilter),
    ]);

    // Currency conversion rates (1 foreign currency = X INR)
    const conversionRates = {
      USD: 83.33,    // 1 USD = 83.33 INR
      AED: 22.67,    // 1 AED = 22.67 INR
      INR: 1,        // Base currency
      CAD: 61.50,    // 1 CAD = 61.50 INR
      AUD: 54.00,    // 1 AUD = 54.00 INR
    };

    // Convert all amounts to INR first, then sum them
    const totalIncomeINR = incomes.reduce((acc, income) => {
      const amountInINR = income.amount * conversionRates[income.currency];
      return acc + amountInINR;
    }, 0);

    const totalExpenseINR = expenses.reduce((acc, expense) => {
      const amountInINR = expense.amount * conversionRates[expense.currency];
      return acc + amountInINR;
    }, 0);

    const balanceINR = totalIncomeINR - totalExpenseINR;

    // Convert to requested currency if needed
    const convertToCurrency = (amountINR, targetCurrency) => {
      if (targetCurrency === 'INR') return amountINR;
      return amountINR / conversionRates[targetCurrency];
    };

    res.json({
      success: true,
      totalIncome: convertToCurrency(totalIncomeINR, currency),
      totalExpense: convertToCurrency(totalExpenseINR, currency),
      balance: convertToCurrency(balanceINR, currency),
      // Also return INR values for reference
      totalIncomeINR,
      totalExpenseINR,
      balanceINR,
      currency: currency
    });
  } catch (err) {
    console.error("❌ Error fetching summary:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


// ✅ Update income
const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, amount,currency, date, category, notes } = req.body;
    if (!title || !type || !amount || !date) {
      return res.status(400).json({ success: false, message: "Title, type, amount, and date are required" });
    }
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be a positive number" });
    }
    if (!Date.parse(date)) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const income = await Income.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, type, amount: Number(amount), date: new Date(date), category: category || undefined, notes ,currency},
      { new: true }
    );
    if (!income) {
      return res.status(404).json({ success: false, message: "Income not found or unauthorized" });
    }
    res.json({ success: true, message: "Income updated successfully", income });
  } catch (err) {
    console.error("❌ Error updating income:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Delete income
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findOneAndDelete({ _id: id, user: req.user.id });
    if (!income) {
      return res.status(404).json({ success: false, message: "Income not found or unauthorized" });
    }
    res.json({ success: true, message: "Income deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting income:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, amount,currency, date, category, notes } = req.body;
    if (!title || !type || !amount || !date) {
      return res.status(400).json({ success: false, message: "Title, type, amount, and date are required" });
    }
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be a positive number" });
    }
    if (!Date.parse(date)) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, type, amount: Number(amount), date: new Date(date), category: category || undefined, notes,currency },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found or unauthorized" });
    }
    res.json({ success: true, message: "Expense updated successfully", expense });
  } catch (err) {
    console.error("❌ Error updating expense:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found or unauthorized" });
    }
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting expense:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Download Excel WITH CURRENCY CONVERSION
const downloadFinanceExcel = async (req, res) => {
  try {
    const { month, year, startDate, endDate, currency = 'INR' } = req.query;
    let filter = { user: req.user.id };

    // Apply date filtering
    if (startDate && endDate) {
      if (!Date.parse(startDate) || !Date.parse(endDate)) {
        return res.status(400).json({ success: false, message: 'Invalid startDate or endDate format' });
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (start > end) {
        return res.status(400).json({ success: false, message: 'startDate cannot be after endDate' });
      }
      filter.date = { $gte: start, $lte: end };
    } else if (month && year) {
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ success: false, message: 'Invalid month or year' });
      }
      const start = new Date(yearNum, monthNum - 1, 1);
      const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const [incomes, expenses] = await Promise.all([
      Income.find(filter).sort({ date: -1 }),
      Expense.find(filter).sort({ date: -1 }),
    ]);

    // Currency conversion rates (same as summary)
    const conversionRates = {
      USD: 83.33,
      AED: 22.67,
      INR: 1,
      CAD: 61.50,
      AUD: 54.00,
    };

    // Convert all amounts to INR for summary calculations
    const totalIncomeINR = incomes.reduce((acc, income) => {
      const amountInINR = income.amount * conversionRates[income.currency];
      return acc + amountInINR;
    }, 0);

    const totalExpenseINR = expenses.reduce((acc, expense) => {
      const amountInINR = expense.amount * conversionRates[expense.currency];
      return acc + amountInINR;
    }, 0);

    const balanceINR = totalIncomeINR - totalExpenseINR;

    // Convert to requested currency for display
    const convertToCurrency = (amountINR, targetCurrency) => {
      if (targetCurrency === 'INR') return amountINR;
      return amountINR / conversionRates[targetCurrency];
    };

    const totalIncome = convertToCurrency(totalIncomeINR, currency);
    const totalExpense = convertToCurrency(totalExpenseINR, currency);
    const balance = convertToCurrency(balanceINR, currency);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Finance Report');

    // Define columns - ADD CURRENCY COLUMN
    worksheet.columns = [
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Currency', key: 'currency', width: 10 }, // NEW COLUMN
      { header: 'Amount (INR)', key: 'amountINR', width: 15 }, // NEW COLUMN
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Notes', key: 'notes', width: 30 },
    ];

    // Add income rows with currency conversion
    incomes.forEach((i) => {
      const amountInINR = i.amount * conversionRates[i.currency];
      worksheet.addRow({
        type: 'Income',
        title: i.title,
        category: i.category || '-',
        amount: i.amount,
        currency: i.currency,
        amountINR: amountInINR,
        date: new Date(i.date).toLocaleDateString('en-IN'),
        notes: i.notes || '-',
      });
    });

    // Add expense rows with currency conversion
    expenses.forEach((e) => {
      const amountInINR = e.amount * conversionRates[e.currency];
      worksheet.addRow({
        type: 'Expense',
        title: e.title,
        category: e.category || '-',
        amount: e.amount,
        currency: e.currency,
        amountINR: amountInINR,
        date: new Date(e.date).toLocaleDateString('en-IN'),
        notes: e.notes || '-',
      });
    });

    // Style header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E86C1' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
      }
    });

    // Add summary section with proper currency conversion
    worksheet.addRow([]);
    worksheet.addRow(['FINANCIAL SUMMARY', '', '', '', '', '', '', '']);
    worksheet.addRow(['Report Currency', currency, '', '', '', '', '', '']);
    worksheet.addRow(['Exchange Rates', '', '', '', '', '', '', '']);
    worksheet.addRow(['USD → INR', conversionRates.USD, '', '', '', '', '', '']);
    worksheet.addRow(['AED → INR', conversionRates.AED, '', '', '', '', '', '']);
    worksheet.addRow(['CAD → INR', conversionRates.CAD, '', '', '', '', '', '']);
    worksheet.addRow(['AUD → INR', conversionRates.AUD, '', '', '', '', '', '']);
    worksheet.addRow([]);
    
    // Summary in selected currency
    worksheet.addRow(['SUMMARY IN ' + currency, '', '', '', '', '', '', '']);
    worksheet.addRow(['Total Income', '', '', '', '', totalIncome, '', '']);
    worksheet.addRow(['Total Expense', '', '', '', '', totalExpense, '', '']);
    worksheet.addRow(['Balance', '', '', '', '', balance, '', '']);
    worksheet.addRow([]);
    
    // Summary in INR for reference
    worksheet.addRow(['SUMMARY IN INR', '', '', '', '', '', '', '']);
    worksheet.addRow(['Total Income (INR)', '', '', '', '', totalIncomeINR, '', '']);
    worksheet.addRow(['Total Expense (INR)', '', '', '', '', totalExpenseINR, '', '']);
    worksheet.addRow(['Balance (INR)', '', '', '', '', balanceINR, '', '']);

    // Style summary rows
    for (let i = worksheet.rowCount - 12; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      if (i === worksheet.rowCount - 12 || i === worksheet.rowCount - 6 || i === worksheet.rowCount - 1) {
        // Header rows
        row.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E86C1' } };
        });
      } else {
        // Data rows
        row.getCell(6).numFmt = '#,##0.00'; // Format numbers
      }
    }

    // Set response headers
    const filename = startDate && endDate
      ? `finance_report_${startDate}_to_${endDate}_${currency}.xlsx`
      : `finance_report_${month || 'all'}_${year || 'all'}_${currency}.xlsx`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('❌ Error generating Excel:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
module.exports = {
  addIncome,
  addExpense,
  getIncomes,
  getExpenses,
  getFinanceSummary,
  updateIncome,
  deleteIncome,
  updateExpense,
  deleteExpense,
  downloadFinanceExcel,
};

//==========================LIVE CURRENCY==================


// const Income = require('../models/Income');
// const Expense = require('../models/Expense');
// const ExcelJS = require('exceljs');
// // const { getExchangeRates } = require("../utils/currency");

// // ✅ Add new income
// const addIncome = async (req, res) => {
//   try {
//     const { title, type, amount,currency, date, category, notes } = req.body;
//     if (!title || !type || !amount || !date) {
//       return res.status(400).json({ success: false, message: "Title, type, amount, and date are required" });
//     }
//     if (isNaN(amount) || amount <= 0) {
//       return res.status(400).json({ success: false, message: "Amount must be a positive number" });
//     }
//     if (!Date.parse(date)) {
//       return res.status(400).json({ success: false, message: "Invalid date format" });
//     }

//     const income = new Income({
//       title,
//       type,
//       amount: Number(amount),
//         currency: currency || 'INR', // Use provided currency or default to INR
//       date: new Date(date),
//       category: category || undefined,
//       notes,
//       user: req.user.id,
//     });

//     await income.save();
//     res.status(201).json({ success: true, message: "Income added successfully", income });
//   } catch (err) {
//     console.error("❌ Error adding income:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // ✅ Add new expense
// const addExpense = async (req, res) => {
//   try {
//     const { title, type, amount,currency, date, category, notes } = req.body;
//     if (!title || !type || !amount || !date) {
//       return res.status(400).json({ success: false, message: "Title, type, amount, and date are required" });
//     }
//     if (isNaN(amount) || amount <= 0) {
//       return res.status(400).json({ success: false, message: "Amount must be a positive number" });
//     }
//     if (!Date.parse(date)) {
//       return res.status(400).json({ success: false, message: "Invalid date format" });
//     }

//     const expense = new Expense({
//       title,
//       type,
//       amount: Number(amount),
//       currency: currency || 'INR', // Use provided currency or default to INR
//       date: new Date(date),
//       category: category || undefined,
//       notes,
//       user: req.user.id,
//     });

//     await expense.save();
//     res.status(201).json({ success: true, message: "Expense added successfully", expense });
//   } catch (err) {
//     console.error("❌ Error adding expense:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };


// const getIncomes = async (req, res) => {
//   try {
//     const { month, year, type, category } = req.query;
//     let filter = {}; // Remove user filter to show ALL data to everyone

//     if (month && year) {
//       const start = new Date(year, month - 1, 1);
//       const end = new Date(year, month, 0, 23, 59, 59);
//       filter.date = { $gte: start, $lte: end };
//     }
//     if (type) filter.type = type;
//     if (category) filter.category = category;

//     const incomes = await Income.find(filter).sort({ date: -1 });
//     res.json({ success: true, incomes });
//   } catch (err) {
//     console.error("❌ Error fetching incomes:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // ✅ Get expenses with filters
// const getExpenses = async (req, res) => {
//   try {
//     const { month, year, type, category } = req.query;
//     let filter = {}; // Remove user filter to show ALL data to everyone

//     if (month && year) {
//       const start = new Date(year, month - 1, 1);
//       const end = new Date(year, month, 0, 23, 59, 59);
//       filter.date = { $gte: start, $lte: end };
//     }
//     if (type) filter.type = type;
//     if (category) filter.category = category;

//     const expenses = await Expense.find(filter).sort({ date: -1 });
//     res.json({ success: true, expenses });
//   } catch (err) {
//     console.error("❌ Error fetching expenses:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };


// // ✅ Finance Summary WITH LIVE CURRENCY CONVERSION
// const getFinanceSummary = async (req, res) => {
//   try {
//     const { month, year, currency = "INR" } = req.query;
//     let dateFilter = {};

//     if (month && year) {
//       const start = new Date(year, month - 1, 1);
//       const end = new Date(year, month, 0, 23, 59, 59);
//       dateFilter.date = { $gte: start, $lte: end };
//     }

//     const [incomes, expenses, rates] = await Promise.all([
//       Income.find(dateFilter),
//       Expense.find(dateFilter),
//       getExchangeRates("INR"), // base INR
//     ]);

//     // Convert all amounts to INR
//     const totalIncomeINR = incomes.reduce((acc, i) => acc + (i.amount * (rates.INR / rates[i.currency] || 1)), 0);
//     const totalExpenseINR = expenses.reduce((acc, e) => acc + (e.amount * (rates.INR / rates[e.currency] || 1)), 0);
//     const balanceINR = totalIncomeINR - totalExpenseINR;

//     // Convert INR → target currency
//     const convertToCurrency = (amountINR, target) => {
//       if (target === "INR") return amountINR;
//       return amountINR * (rates[target] || 1); // use live rate
//     };

//     res.json({
//       success: true,
//       totalIncome: convertToCurrency(totalIncomeINR, currency),
//       totalExpense: convertToCurrency(totalExpenseINR, currency),
//       balance: convertToCurrency(balanceINR, currency),
//       totalIncomeINR,
//       totalExpenseINR,
//       balanceINR,
//       currency,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching summary:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };



// // ✅ Update income
// const updateIncome = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, type, amount,currency, date, category, notes } = req.body;
//     if (!title || !type || !amount || !date) {
//       return res.status(400).json({ success: false, message: "Title, type, amount, and date are required" });
//     }
//     if (isNaN(amount) || amount <= 0) {
//       return res.status(400).json({ success: false, message: "Amount must be a positive number" });
//     }
//     if (!Date.parse(date)) {
//       return res.status(400).json({ success: false, message: "Invalid date format" });
//     }

//     const income = await Income.findOneAndUpdate(
//       { _id: id, user: req.user.id },
//       { title, type, amount: Number(amount), date: new Date(date), category: category || undefined, notes ,currency},
//       { new: true }
//     );
//     if (!income) {
//       return res.status(404).json({ success: false, message: "Income not found or unauthorized" });
//     }
//     res.json({ success: true, message: "Income updated successfully", income });
//   } catch (err) {
//     console.error("❌ Error updating income:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // ✅ Delete income
// const deleteIncome = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const income = await Income.findOneAndDelete({ _id: id, user: req.user.id });
//     if (!income) {
//       return res.status(404).json({ success: false, message: "Income not found or unauthorized" });
//     }
//     res.json({ success: true, message: "Income deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting income:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // ✅ Update expense
// const updateExpense = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, type, amount,currency, date, category, notes } = req.body;
//     if (!title || !type || !amount || !date) {
//       return res.status(400).json({ success: false, message: "Title, type, amount, and date are required" });
//     }
//     if (isNaN(amount) || amount <= 0) {
//       return res.status(400).json({ success: false, message: "Amount must be a positive number" });
//     }
//     if (!Date.parse(date)) {
//       return res.status(400).json({ success: false, message: "Invalid date format" });
//     }

//     const expense = await Expense.findOneAndUpdate(
//       { _id: id, user: req.user.id },
//       { title, type, amount: Number(amount), date: new Date(date), category: category || undefined, notes,currency },
//       { new: true }
//     );
//     if (!expense) {
//       return res.status(404).json({ success: false, message: "Expense not found or unauthorized" });
//     }
//     res.json({ success: true, message: "Expense updated successfully", expense });
//   } catch (err) {
//     console.error("❌ Error updating expense:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // ✅ Delete expense
// const deleteExpense = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const expense = await Expense.findOneAndDelete({ _id: id, user: req.user.id });
//     if (!expense) {
//       return res.status(404).json({ success: false, message: "Expense not found or unauthorized" });
//     }
//     res.json({ success: true, message: "Expense deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting expense:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };


// // ✅ Download Excel WITH LIVE CURRENCY CONVERSION

// // const downloadFinanceExcel = async (req, res) => {
// //   try {
// //     const { month, year, startDate, endDate, currency = "INR" } = req.query;
// //     let filter = { user: req.user.id };

// //     // 🔹 Date filtering
// //     if (startDate && endDate) {
// //       if (!Date.parse(startDate) || !Date.parse(endDate)) {
// //         return res
// //           .status(400)
// //           .json({ success: false, message: "Invalid startDate or endDate format" });
// //       }
// //       const start = new Date(startDate);
// //       const end = new Date(endDate);
// //       end.setHours(23, 59, 59, 999);
// //       if (start > end) {
// //         return res
// //           .status(400)
// //           .json({ success: false, message: "startDate cannot be after endDate" });
// //       }
// //       filter.date = { $gte: start, $lte: end };
// //     } else if (month && year) {
// //       const monthNum = parseInt(month, 10);
// //       const yearNum = parseInt(year, 10);
// //       if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
// //         return res
// //           .status(400)
// //           .json({ success: false, message: "Invalid month or year" });
// //       }
// //       const start = new Date(yearNum, monthNum - 1, 1);
// //       const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
// //       filter.date = { $gte: start, $lte: end };
// //     }

// //     // 🔹 Fetch data
// //     const [incomes, expenses] = await Promise.all([
// //       Income.find(filter).sort({ date: -1 }),
// //       Expense.find(filter).sort({ date: -1 }),
// //     ]);

// //     // 🔹 Get live exchange rates (base INR)
// //     const rates = await getExchangeRates("INR"); // { USD: X, AED: Y, CAD: Z, ... }

// //     if (!rates || !rates[currency]) {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: `Unsupported currency: ${currency}` });
// //     }

// //     // 🔹 Convert all to INR first
// //     const totalIncomeINR = incomes.reduce((acc, income) => {
// //       const rate = rates[income.currency] || 1;
// //       const amountInINR = income.amount * (rates.INR / rate);
// //       return acc + amountInINR;
// //     }, 0);

// //     const totalExpenseINR = expenses.reduce((acc, expense) => {
// //       const rate = rates[expense.currency] || 1;
// //       const amountInINR = expense.amount * (rates.INR / rate);
// //       return acc + amountInINR;
// //     }, 0);

// //     const balanceINR = totalIncomeINR - totalExpenseINR;

// //     // 🔹 INR → target currency
// //     const convertToCurrency = (amountINR, targetCurrency) => {
// //       if (targetCurrency === "INR") return amountINR;
// //       const rate = rates[targetCurrency] || 1;
// //       return amountINR * rate; // convert INR → target
// //     };

// //     const totalIncome = convertToCurrency(totalIncomeINR, currency);
// //     const totalExpense = convertToCurrency(totalExpenseINR, currency);
// //     const balance = convertToCurrency(balanceINR, currency);

// //     // 🔹 Setup Excel workbook
// //     const workbook = new ExcelJS.Workbook();
// //     const worksheet = workbook.addWorksheet("Finance Report");

// //     // Columns
// //     worksheet.columns = [
// //       { header: "Type", key: "type", width: 15 },
// //       { header: "Title", key: "title", width: 30 },
// //       { header: "Category", key: "category", width: 20 },
// //       { header: "Amount", key: "amount", width: 15 },
// //       { header: "Currency", key: "currency", width: 10 },
// //       { header: "Amount (INR)", key: "amountINR", width: 15 },
// //       { header: "Date", key: "date", width: 15 },
// //       { header: "Notes", key: "notes", width: 30 },
// //     ];

// //     // 🔹 Add income rows
// //     incomes.forEach((i) => {
// //       const rate = rates[i.currency] || 1;
// //       const amountInINR = i.amount * (rates.INR / rate);
// //       worksheet.addRow({
// //         type: "Income",
// //         title: i.title,
// //         category: i.category || "-",
// //         amount: i.amount,
// //         currency: i.currency,
// //         amountINR,
// //         date: new Date(i.date).toLocaleDateString("en-IN"),
// //         notes: i.notes || "-",
// //       });
// //     });

// //     // 🔹 Add expense rows
// //     expenses.forEach((e) => {
// //       const rate = rates[e.currency] || 1;
// //       const amountInINR = e.amount * (rates.INR / rate);
// //       worksheet.addRow({
// //         type: "Expense",
// //         title: e.title,
// //         category: e.category || "-",
// //         amount: e.amount,
// //         currency: e.currency,
// //         amountINR,
// //         date: new Date(e.date).toLocaleDateString("en-IN"),
// //         notes: e.notes || "-",
// //       });
// //     });

// //     // 🔹 Style header
// //     worksheet.getRow(1).eachCell((cell) => {
// //       cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
// //       cell.fill = {
// //         type: "pattern",
// //         pattern: "solid",
// //         fgColor: { argb: "FF2E86C1" },
// //       };
// //       cell.alignment = { vertical: "middle", horizontal: "center" };
// //     });

// //     // 🔹 Style data rows
// //     worksheet.eachRow((row, rowNumber) => {
// //       if (rowNumber > 1) {
// //         row.eachCell((cell) => {
// //           cell.alignment = { vertical: "middle", horizontal: "left" };
// //         });
// //       }
// //     });

// //     // 🔹 Add summary
// //     worksheet.addRow([]);
// //     const summaryStart = worksheet.rowCount + 1;

// //     worksheet.addRow(["FINANCIAL SUMMARY"]);
// //     worksheet.addRow(["Report Currency", currency]);
// //     worksheet.addRow([]);

// //     worksheet.addRow(["Exchange Rates (base INR)"]);
// //     Object.entries(rates).forEach(([cur, rate]) => {
// //       if (["USD", "AED", "CAD", "AUD", "INR"].includes(cur)) {
// //         worksheet.addRow([`${cur} → INR`, rates.INR / rate]);
// //       }
// //     });
// //     worksheet.addRow([]);

// //     worksheet.addRow([`SUMMARY IN ${currency}`]);
// //     worksheet.addRow(["Total Income", totalIncome]);
// //     worksheet.addRow(["Total Expense", totalExpense]);
// //     worksheet.addRow(["Balance", balance]);
// //     worksheet.addRow([]);

// //     worksheet.addRow(["SUMMARY IN INR"]);
// //     worksheet.addRow(["Total Income (INR)", totalIncomeINR]);
// //     worksheet.addRow(["Total Expense (INR)", totalExpenseINR]);
// //     worksheet.addRow(["Balance (INR)", balanceINR]);

// //     // 🔹 Style summary
// //     const summaryEnd = worksheet.rowCount;
// //     for (let i = summaryStart; i <= summaryEnd; i++) {
// //       const row = worksheet.getRow(i);
// //       if (
// //         row.getCell(1).value &&
// //         [
// //           "FINANCIAL SUMMARY",
// //           "Exchange Rates (base INR)",
// //           `SUMMARY IN ${currency}`,
// //           "SUMMARY IN INR",
// //         ].includes(row.getCell(1).value)
// //       ) {
// //         row.eachCell((cell) => {
// //           cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
// //           cell.fill = {
// //             type: "pattern",
// //             pattern: "solid",
// //             fgColor: { argb: "FF2E86C1" },
// //           };
// //         });
// //       } else {
// //         row.getCell(2).numFmt = "#,##0.00";
// //       }
// //     }

// //     // 🔹 Response headers
// //     const filename =
// //       startDate && endDate
// //         ? `finance_report_${startDate}_to_${endDate}_${currency}.xlsx`
// //         : `finance_report_${month || "all"}_${year || "all"}_${currency}.xlsx`;

// //     res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
// //     res.setHeader(
// //       "Content-Type",
// //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// //     );

// //     await workbook.xlsx.write(res);
// //     res.end();
// //   } catch (err) {
// //     console.error("❌ Error generating Excel:", err);
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };


// const downloadFinanceExcel = async (req, res) => {
//   try {
//     // Validate user authentication
//     if (!req.user?.id) {
//       console.error("Authentication error: req.user.id is undefined");
//       return res.status(401).json({ success: false, message: "Unauthorized: User not authenticated" });
//     }

//     const { month, year, startDate, endDate, currency = "INR" } = req.query;
//     let filter = { user: req.user.id };

//     // Date filtering
//     if (startDate && endDate) {
//       if (!Date.parse(startDate) || !Date.parse(endDate)) {
//         return res.status(400).json({ success: false, message: "Invalid startDate or endDate format" });
//       }
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//       if (start > end) {
//         return res.status(400).json({ success: false, message: "startDate cannot be after endDate" });
//       }
//       filter.date = { $gte: start, $lte: end };
//     } else if (month && year) {
//       const monthNum = parseInt(month, 10);
//       const yearNum = parseInt(year, 10);
//       if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
//         return res.status(400).json({ success: false, message: "Invalid month or year" });
//       }
//       const start = new Date(yearNum, monthNum - 1, 1);
//       const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
//       filter.date = { $gte: start, $lte: end };
//     }

//     // Fetch data
//     console.log("Fetching incomes and expenses with filter:", filter);
//     const [incomes, expenses] = await Promise.all([
//       Income.find(filter).sort({ date: -1 }).catch(err => {
//         console.error("Error fetching incomes:", err);
//         throw new Error("Failed to fetch incomes");
//       }),
//       Expense.find(filter).sort({ date: -1 }).catch(err => {
//         console.error("Error fetching expenses:", err);
//         throw new Error("Failed to fetch expenses");
//       }),
//     ]);

//     // Get live exchange rates (base INR)
//     console.log("Fetching exchange rates for base currency INR");
//     const rates = await getExchangeRates("INR").catch(err => {
//       console.error("Failed to fetch exchange rates, using fallback:", err);
//       return { INR: 1, USD: 83, AED: 22, CAD: 61, AUD: 54 }; // Fallback rates
//     });

//     if (!rates || !rates[currency]) {
//       console.error(`Unsupported currency: ${currency}, available rates:`, Object.keys(rates));
//       return res.status(400).json({ success: false, message: `Unsupported currency: ${currency}` });
//     }

//     // Convert all to INR
//     console.log("Converting amounts to INR");
//     const totalIncomeINR = incomes.reduce((acc, income) => {
//       const rate = rates[income.currency] || 1;
//       const amountInINR = income.amount * (rates.INR / rate);
//       return acc + amountInINR;
//     }, 0);

//     const totalExpenseINR = expenses.reduce((acc, expense) => {
//       const rate = rates[expense.currency] || 1;
//       const amountInINR = expense.amount * (rates.INR / rate);
//       return acc + amountInINR;
//     }, 0);

//     const balanceINR = totalIncomeINR - totalExpenseINR;

//     // INR → target currency
//     const convertToCurrency = (amountINR, targetCurrency) => {
//       if (targetCurrency === "INR") return amountINR;
//       const rate = rates[targetCurrency] || 1;
//       return amountINR * rate;
//     };

//     const totalIncome = convertToCurrency(totalIncomeINR, currency);
//     const totalExpense = convertToCurrency(totalExpenseINR, currency);
//     const balance = convertToCurrency(balanceINR, currency);

//     // Setup Excel workbook
//     console.log("Creating Excel workbook");
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Finance Report");

//     // Columns
//     worksheet.columns = [
//       { header: "Type", key: "type", width: 15 },
//       { header: "Title", key: "title", width: 30 },
//       { header: "Category", key: "category", width: 20 },
//       { header: "Amount", key: "amount", width: 15 },
//       { header: "Currency", key: "currency", width: 10 },
//       { header: "Amount (INR)", key: "amountINR", width: 15 },
//       { header: "Date", key: "date", width: 15 },
//       { header: "Notes", key: "notes", width: 30 },
//     ];

//     // Add income rows
//     incomes.forEach((i) => {
//       const rate = rates[i.currency] || 1;
//       const amountInINR = i.amount * (rates.INR / rate);
//       worksheet.addRow({
//         type: "Income",
//         title: i.title,
//         category: i.category || "-",
//         amount: i.amount,
//         currency: i.currency || "INR",
//         amountINR: Number(amountInINR.toFixed(2)),
//         date: new Date(i.date).toLocaleDateString("en-IN"),
//         notes: i.notes || "-",
//       });
//     });

//     // Add expense rows
//     expenses.forEach((e) => {
//       const rate = rates[e.currency] || 1;
//       const amountInINR = e.amount * (rates.INR / rate);
//       worksheet.addRow({
//         type: "Expense",
//         title: e.title,
//         category: e.category || "-",
//         amount: e.amount,
//         currency: e.currency || "INR",
//         amountINR: Number(amountInINR.toFixed(2)),
//         date: new Date(e.date).toLocaleDateString("en-IN"),
//         notes: e.notes || "-",
//       });
//     });

//     // Style header
//     worksheet.getRow(1).eachCell((cell) => {
//       cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FF2E86C1" },
//       };
//       cell.alignment = { vertical: "middle", horizontal: "center" };
//     });

//     // Style data rows
//     worksheet.eachRow((row, rowNumber) => {
//       if (rowNumber > 1) {
//         row.eachCell((cell) => {
//           cell.alignment = { vertical: "middle", horizontal: "left" };
//         });
//       }
//     });

//     // Add summary
//     worksheet.addRow([]);
//     const summaryStart = worksheet.rowCount + 1;

//     worksheet.addRow(["FINANCIAL SUMMARY"]);
//     worksheet.addRow(["Report Currency", currency]);
//     worksheet.addRow([]);

//     worksheet.addRow(["Exchange Rates (base INR)"]);
//     Object.entries(rates).forEach(([cur, rate]) => {
//       if (["USD", "AED", "CAD", "AUD", "INR"].includes(cur)) {
//         worksheet.addRow([`${cur} → INR`, Number((rates.INR / rate).toFixed(4))]);
//       }
//     });
//     worksheet.addRow([]);

//     worksheet.addRow([`SUMMARY IN ${currency}`]);
//     worksheet.addRow(["Total Income", Number(totalIncome.toFixed(2))]);
//     worksheet.addRow(["Total Expense", Number(totalExpense.toFixed(2))]);
//     worksheet.addRow(["Balance", Number(balance.toFixed(2))]);
//     worksheet.addRow([]);

//     worksheet.addRow(["SUMMARY IN INR"]);
//     worksheet.addRow(["Total Income (INR)", Number(totalIncomeINR.toFixed(2))]);
//     worksheet.addRow(["Total Expense (INR)", Number(totalExpenseINR.toFixed(2))]);
//     worksheet.addRow(["Balance (INR)", Number(balanceINR.toFixed(2))]);

//     // Style summary
//     const summaryEnd = worksheet.rowCount;
//     for (let i = summaryStart; i <= summaryEnd; i++) {
//       const row = worksheet.getRow(i);
//       if (
//         row.getCell(1).value &&
//         [
//           "FINANCIAL SUMMARY",
//           "Exchange Rates (base INR)",
//           `SUMMARY IN ${currency}`,
//           "SUMMARY IN INR",
//         ].includes(row.getCell(1).value)
//       ) {
//         row.eachCell((cell) => {
//           cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
//           cell.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: "FF2E86C1" },
//           };
//         });
//       } else {
//         row.getCell(2).numFmt = "#,##0.00";
//       }
//     }

//     // Response headers
//     const filename =
//       startDate && endDate
//         ? `finance_report_${startDate}_to_${endDate}_${currency}.xlsx`
//         : `finance_report_${month || "all"}_${year || "all"}_${currency}.xlsx`;

//     res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     // Write workbook to response
//     console.log("Writing Excel file to response");
//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (err) {
//     console.error("Error generating Excel:", {
//       message: err.message,
//       stack: err.stack,
//       query: req.query,
//       userId: req.user?.id,
//     });
//     res.status(500).json({ success: false, message: "Failed to generate Excel file. Please try again." });
//   }
// };

// // const getLiveExchangeRates = async (req, res) => {
// //   try {
// //     const { base = "INR" } = req.query;
// //     const rates = await getExchangeRates(base);
// //     res.json({ success: true, rates });
// //   } catch (err) {
// //     console.error("❌ Error fetching exchange rates:", err);
// //     res.status(500).json({ success: false, message: "Failed to fetch exchange rates" });
// //   }
// // };

// module.exports = {
//   addIncome,
//   addExpense,
//   getIncomes,
//   getExpenses,
//   getFinanceSummary,
//   updateIncome,
//   deleteIncome,
//   updateExpense,
//   deleteExpense,
//   downloadFinanceExcel,
//   // getLiveExchangeRates
// };
























// //================*===============


// // const Income = require('../models/Income');
// // const Expense = require('../models/Expense');
// // const ExcelJS = require('exceljs');

// // // ✅ Add new income (Admin only)
// // const addIncome = async (req, res) => {
// //   try {
// //     // Admin check is handled by adminOnly middleware
// //     const { title, type, amount, currency, date, category, notes } = req.body;
// //     if (!title || !type || !amount || !date) {
// //       return res.status(400).json({ success: false, message: 'Title, type, amount, and date are required' });
// //     }
// //     if (isNaN(amount) || amount <= 0) {
// //       return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
// //     }
// //     if (!Date.parse(date)) {
// //       return res.status(400).json({ success: false, message: 'Invalid date format' });
// //     }

// //     const income = new Income({
// //       title,
// //       type,
// //       amount: Number(amount),
// //       currency: currency || 'INR',
// //       date: new Date(date),
// //       category: category || undefined,
// //       notes,
// //       user: req.user.id, // Admin's user ID
// //     });

// //     await income.save();
// //     res.status(201).json({ success: true, message: 'Income added successfully', income });
// //   } catch (err) {
// //     console.error('❌ Error adding income:', err);
// //     res.status(500).json({ success: false, error: 'Server error' });
// //   }
// // };

// // // ✅ Add new expense (Admin only)
// // const addExpense = async (req, res) => {
// //   try {
// //     // Admin check is handled by adminOnly middleware
// //     const { title, type, amount, currency, date, category, notes } = req.body;
// //     if (!title || !type || !amount || !date) {
// //       return res.status(400).json({ success: false, message: 'Title, type, amount, and date are required' });
// //     }
// //     if (isNaN(amount) || amount <= 0) {
// //       return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
// //     }
// //     if (!Date.parse(date)) {
// //       return res.status(400).json({ success: false, message: 'Invalid date format' });
// //     }

// //     const expense = new Expense({
// //       title,
// //       type,
// //       amount: Number(amount),
// //       currency: currency || 'INR',
// //       date: new Date(date),
// //       category: category || undefined,
// //       notes,
// //       user: req.user.id, // Admin's user ID
// //     });

// //     await expense.save();
// //     res.status(201).json({ success: true, message: 'Expense added successfully', expense });
// //   } catch (err) {
// //     console.error('❌ Error adding expense:', err);
// //     res.status(500).json({ success: false, error: 'Server error' });
// //   }
// // };

// // // ✅ Get incomes with filters (Admin and Guest)
// // const getIncomes = async (req, res) => {
// //   try {
// //     const { month, year, type, category } = req.query;
// //     let filter = {}; // No user filter to allow guests to see all data

// //     if (month && year) {
// //       const monthNum = parseInt(month, 10);
// //       const yearNum = parseInt(year, 10);
// //       if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
// //         return res.status(400).json({ success: false, message: 'Invalid month or year' });
// //       }
// //       const start = new Date(yearNum, monthNum - 1, 1);
// //       const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
// //       filter.date = { $gte: start, $lte: end };
// //     }
// //     if (type) filter.type = type;
// //     if (category) filter.category = category;

// //     const incomes = await Income.find(filter).populate('user', 'name email').sort({ date: -1 });
// //     res.json({ success: true, incomes });
// //   } catch (err) {
// //     console.error('❌ Error fetching incomes:', err);
// //     res.status(500).json({ success: false, error: 'Server error' });
// //   }
// // };

// // // ✅ Get expenses with filters (Admin and Guest)
// // const getExpenses = async (req, res) => {
// //   try {
// //     const { month, year, type, category } = req.query;
// //     let filter = {}; // No user filter to allow guests to see all data

// //     if (month && year) {
// //       const monthNum = parseInt(month, 10);
// //       const yearNum = parseInt(year, 10);
// //       if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
// //         return res.status(400).json({ success: false, message: 'Invalid month or year' });
// //       }
// //       const start = new Date(yearNum, monthNum - 1, 1);
// //       const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
// //       filter.date = { $gte: start, $lte: end };
// //     }
// //     if (type) filter.type = type;
// //     if (category) filter.category = category;

// //     const expenses = await Expense.find(filter).populate('user', 'name email').sort({ date: -1 });
// //     res.json({ success: true, expenses });
// //   } catch (err) {
// //     console.error('❌ Error fetching expenses:', err);
// //     res.status(500).json({ success: false, error: 'Server error' });
// //   }
// // };

// // // ✅ Finance Summary with Currency Conversion (Admin and Guest)
// // const getFinanceSummary = async (req, res) => {
// //   try {
// //     const { month, year, currency = 'INR' } = req.query;
// //     let filter = {}; // No user filter to show all data

// //     if (month && year) {
// //       const monthNum = parseInt(month, 10);
// //       const yearNum = parseInt(year, 10);
// //       if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
// //         return res.status(400).json({ success: false, message: 'Invalid month or year' });
// //       }
// //       const start = new Date(yearNum, monthNum - 1, 1);
// //       const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
// //       filter.date = { $gte: start, $lte: end };
// //     }

// //     const [incomes, expenses] = await Promise.all([
// //       Income.find(filter),
// //       Expense.find(filter),
// //     ]);

// //     // Currency conversion rates
// //     const conversionRates = {
// //       USD: 83.33,
// //       AED: 22.67,
// //       INR: 1,
// //       CAD: 61.50,
// //       AUD: 54.00,
// //     };

// //     // Convert to INR for calculations
// //     const totalIncomeINR = incomes.reduce((acc, income) => {
// //       return acc + income.amount * (conversionRates[income.currency] || 1);
// //     }, 0);

// //     const totalExpenseINR = expenses.reduce((acc, expense) => {
// //       return acc + expense.amount * (conversionRates[expense.currency] || 1);
// //     }, 0);

// //     const balanceINR = totalIncomeINR - totalExpenseINR;

// //     // Convert to requested currency
// //     const convertToCurrency = (amountINR, targetCurrency) => {
// //       if (!conversionRates[targetCurrency]) {
// //         throw new Error('Unsupported currency');
// //       }
// //       return targetCurrency === 'INR' ? amountINR : amountINR / conversionRates[targetCurrency];
// //     };

// //     res.json({
// //       success: true,
// //       totalIncome: convertToCurrency(totalIncomeINR, currency),
// //       totalExpense: convertToCurrency(totalExpenseINR, currency),
// //       balance: convertToCurrency(balanceINR, currency),
// //       totalIncomeINR,
// //       totalExpenseINR,
// //       balanceINR,
// //       currency,
// //     });
// //   } catch (err) {
// //     console.error('❌ Error fetching summary:', err);
// //     res.status(500).json({ success: false, error: err.message || 'Server error' });
// //   }
// // };

// // // ✅ Update income (Admin only)
// // const updateIncome = async (req, res) => {
// //   try {
// //     // Admin check is handled by adminOnly middleware
// //     const { id } = req.params;
// //     const { title, type, amount, currency, date, category, notes } = req.body;
// //     if (!title || !type || !amount || !date) {
// //       return res.status(400).json({ success: false, message: 'Title, type, amount, and date are required' });
// //     }
// //     if (isNaN(amount) || amount <= 0) {
// //       return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
// //     }
// //     if (!Date.parse(date)) {
// //       return res.status(400).json({ success: false, message: 'Invalid date format' });
// //     }

// //     const income = await Income.findById(id);
// //     if (!income) {
// //       return res.status(404).json({ success: false, message: 'Income not found' });
// //     }
// //     // Update fields
// //     income.title = title;
// //     income.type = type;
// //     income.amount = Number(amount);
// //     income.currency = currency || 'INR';
// //     income.date = new Date(date);
// //     income.category = category || undefined;
// //     income.notes = notes;
// //     await income.save();
// //     res.json({ success: true, message: 'Income updated successfully', income });
// //   } catch (err) {
// //     console.error('❌ Error updating income:', err);
// //     res.status(500).json({ success: false, error: 'Server error' });
// //   }
// // };

// // // ✅ Delete income (Admin only)
// // const deleteIncome = async (req, res) => {
// //   try {
// //     // Admin check is handled by adminOnly middleware
// //     const { id } = req.params;
// //     const income = await Income.findByIdAndDelete(id);
// //     if (!income) {
// //       return res.status(404).json({ success: false, message: 'Income not found' });
// //     }
// //     res.json({ success: true, message: 'Income deleted successfully' });
// //   } catch (err) {
// //     console.error('❌ Error deleting income:', err);
// //     res.status(500).json({ success: false, error: 'Server error' });
// //   }
// // };

// // // ✅ Update expense (Admin only)
// // const updateExpense = async (req, res) => {
// //   try {
// //     // Admin check is handled by adminOnly middleware
// //     const { id } = req.params;
// //     const { title, type, amount, currency, date, category, notes } = req.body;
// //     if (!title || !type || !amount || !date) {
// //       return res.status(400).json({ success: false, message: 'Title, type, amount, and date are required' });
// //     }
// //     if (isNaN(amount) || amount <= 0) {
// //       return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
// //     }
// //     if (!Date.parse(date)) {
// //       return res.status(400).json({ success: false, message: 'Invalid date format' });
// //     }

// //     const expense = await Expense.findById(id);
// //     if (!expense) {
// //       return res.status(404).json({ success: false, message: 'Expense not found' });
// //     }
// //     // Update fields
// //     expense.title = title;
// //     expense.type = type;
// //     expense.amount = Number(amount);
// //     expense.currency = currency || 'INR';
// //     expense.date = new Date(date);
// //     expense.category = category || undefined;
// //     expense.notes = notes;
// //     await expense.save();
// //     res.json({ success: true, message: 'Expense updated successfully', expense });
// //   } catch (err) {
// //     console.error('❌ Error updating expense:', err);
// //     res.status(500).json({ success: false, error: 'Server error' });
// //   }
// // };

// // // ✅ Delete expense (Admin only)
// // const deleteExpense = async (req, res) => {
// //   try {
// //     // Admin check is handled by adminOnly middleware
// //     const { id } = req.params;
// //     const expense = await Expense.findByIdAndDelete(id);
// //     if (!expense) {
// //       return res.status(404).json({ success: false, message: 'Expense not found' });
// //     }
// //     res.json({ success: true, message: 'Expense deleted successfully' });
// //   } catch (err) {
// //     console.error('❌ Error deleting expense:', err);
// //     res.status(500).json({ success: false, error: 'Server error' });
// //   }
// // };

// // // ✅ Download Excel with Currency Conversion (Admin and Guest)
// // const downloadFinanceExcel = async (req, res) => {
// //   try {
// //     const { month, year, startDate, endDate, currency = 'INR' } = req.query;
// //     let filter = {}; // No user filter to allow guests to see all data

// //     // Apply date filtering
// //     if (startDate && endDate) {
// //       if (!Date.parse(startDate) || !Date.parse(endDate)) {
// //         return res.status(400).json({ success: false, message: 'Invalid startDate or endDate format' });
// //       }
// //       const start = new Date(startDate);
// //       const end = new Date(endDate);
// //       end.setHours(23, 59, 59, 999);
// //       if (start > end) {
// //         return res.status(400).json({ success: false, message: 'startDate cannot be after endDate' });
// //       }
// //       filter.date = { $gte: start, $lte: end };
// //     } else if (month && year) {
// //       const monthNum = parseInt(month, 10);
// //       const yearNum = parseInt(year, 10);
// //       if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
// //         return res.status(400).json({ success: false, message: 'Invalid month or year' });
// //       }
// //       const start = new Date(yearNum, monthNum - 1, 1);
// //       const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
// //       filter.date = { $gte: start, $lte: end };
// //     }

// //     const [incomes, expenses] = await Promise.all([
// //       Income.find(filter).populate('user', 'name email').sort({ date: -1 }),
// //       Expense.find(filter).populate('user', 'name email').sort({ date: -1 }),
// //     ]);

// //     // Currency conversion rates
// //     const conversionRates = {
// //       USD: 83.33,
// //       AED: 22.67,
// //       INR: 1,
// //       CAD: 61.50,
// //       AUD: 54.00,
// //     };

// //     // Convert to INR for calculations
// //     const totalIncomeINR = incomes.reduce((acc, income) => {
// //       return acc + income.amount * (conversionRates[income.currency] || 1);
// //     }, 0);

// //     const totalExpenseINR = expenses.reduce((acc, expense) => {
// //       return acc + expense.amount * (conversionRates[expense.currency] || 1);
// //     }, 0);

// //     const balanceINR = totalIncomeINR - totalExpenseINR;

// //     // Convert to requested currency
// //     const convertToCurrency = (amountINR, targetCurrency) => {
// //       if (!conversionRates[targetCurrency]) {
// //         throw new Error('Unsupported currency');
// //       }
// //       return targetCurrency === 'INR' ? amountINR : amountINR / conversionRates[targetCurrency];
// //     };

// //     const totalIncome = convertToCurrency(totalIncomeINR, currency);
// //     const totalExpense = convertToCurrency(totalExpenseINR, currency);
// //     const balance = convertToCurrency(balanceINR, currency);

// //     const workbook = new ExcelJS.Workbook();
// //     const worksheet = workbook.addWorksheet('Finance Report');

// //     // Define columns
// //     worksheet.columns = [
// //       { header: 'Type', key: 'type', width: 15 },
// //       { header: 'Title', key: 'title', width: 30 },
// //       { header: 'Category', key: 'category', width: 20 },
// //       { header: 'Amount', key: 'amount', width: 15 },
// //       { header: 'Currency', key: 'currency', width: 10 },
// //       { header: 'Amount (INR)', key: 'amountINR', width: 15 },
// //       { header: 'Date', key: 'date', width: 15 },
// //       { header: 'Notes', key: 'notes', width: 30 },
// //       { header: 'Created By', key: 'createdBy', width: 30 }, // Added to show user info
// //     ];

// //     // Add income rows
// //     incomes.forEach((i) => {
// //       const amountInINR = i.amount * (conversionRates[i.currency] || 1);
// //       worksheet.addRow({
// //         type: 'Income',
// //         title: i.title,
// //         category: i.category || '-',
// //         amount: i.amount,
// //         currency: i.currency,
// //         amountINR: amountInINR,
// //         date: new Date(i.date).toLocaleDateString('en-IN'),
// //         notes: i.notes || '-',
// //         createdBy: i.user ? `${i.user.name} (${i.user.email})` : '-',
// //       });
// //     });

// //     // Add expense rows
// //     expenses.forEach((e) => {
// //       const amountInINR = e.amount * (conversionRates[e.currency] || 1);
// //       worksheet.addRow({
// //         type: 'Expense',
// //         title: e.title,
// //         category: e.category || '-',
// //         amount: e.amount,
// //         currency: e.currency,
// //         amountINR: amountInINR,
// //         date: new Date(e.date).toLocaleDateString('en-IN'),
// //         notes: e.notes || '-',
// //         createdBy: e.user ? `${e.user.name} (${e.user.email})` : '-',
// //       });
// //     });

// //     // Style header
// //     worksheet.getRow(1).eachCell((cell) => {
// //       cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
// //       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E86C1' } };
// //       cell.alignment = { vertical: 'middle', horizontal: 'center' };
// //     });

// //     // Style data rows
// //     worksheet.eachRow((row, rowNumber) => {
// //       if (rowNumber > 1) {
// //         row.eachCell((cell) => {
// //           cell.alignment = { vertical: 'middle', horizontal: 'left' };
// //         });
// //         row.getCell('amount').numFmt = '#,##0.00';
// //         row.getCell('amountINR').numFmt = '#,##0.00';
// //       }
// //     });

// //     // Add summary section
// //     worksheet.addRow([]);
// //     worksheet.addRow(['FINANCIAL SUMMARY', '', '', '', '', '', '', '', '']);
// //     worksheet.addRow(['Report Currency', currency, '', '', '', '', '', '', '']);
// //     worksheet.addRow(['Exchange Rates', '', '', '', '', '', '', '', '']);
// //     Object.entries(conversionRates).forEach(([curr, rate]) => {
// //       worksheet.addRow([`${curr} → INR`, rate, '', '', '', '', '', '', '']);
// //     });
// //     worksheet.addRow([]);
// //     worksheet.addRow([`SUMMARY IN ${currency}`, '', '', '', '', '', '', '', '']);
// //     worksheet.addRow(['Total Income', '', '', '', '', totalIncome, '', '', '']);
// //     worksheet.addRow(['Total Expense', '', '', '', '', totalExpense, '', '', '']);
// //     worksheet.addRow(['Balance', '', '', '', '', balance, '', '', '']);
// //     worksheet.addRow([]);
// //     worksheet.addRow(['SUMMARY IN INR', '', '', '', '', '', '', '', '']);
// //     worksheet.addRow(['Total Income (INR)', '', '', '', '', totalIncomeINR, '', '', '']);
// //     worksheet.addRow(['Total Expense (INR)', '', '', '', '', totalExpenseINR, '', '', '']);
// //     worksheet.addRow(['Balance (INR)', '', '', '', '', balanceINR, '', '', '']);

// //     // Style summary rows
// //     for (let i = worksheet.rowCount - 13; i <= worksheet.rowCount; i++) {
// //       const row = worksheet.getRow(i);
// //       if (
// //         i === worksheet.rowCount - 13 ||
// //         i === worksheet.rowCount - 7 ||
// //         i === worksheet.rowCount - 2
// //       ) {
// //         row.eachCell((cell) => {
// //           cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
// //           cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E86C1' } };
// //         });
// //       } else {
// //         row.getCell(6).numFmt = '#,##0.00';
// //       }
// //     }

// //     // Set response headers
// //     const filename = startDate && endDate
// //       ? `finance_report_${startDate}_to_${endDate}_${currency}.xlsx`
// //       : `finance_report_${month || 'all'}_${year || 'all'}_${currency}.xlsx`;
// //     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
// //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

// //     await workbook.xlsx.write(res);
// //     res.end();
// //   } catch (err) {
// //     console.error('❌ Error generating Excel:', err);
// //     res.status(500).json({ success: false, message: err.message || 'Server error' });
// //   }
// // };

// // module.exports = {
// //   addIncome,
// //   addExpense,
// //   getIncomes,
// //   getExpenses,
// //   getFinanceSummary,
// //   updateIncome,
// //   deleteIncome,
// //   updateExpense,
// //   deleteExpense,
// //   downloadFinanceExcel,
// // };