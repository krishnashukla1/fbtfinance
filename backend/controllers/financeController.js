
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
    // let filter = { user: req.user.id };

     let filter = {};  // remove user filter, show all data

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
