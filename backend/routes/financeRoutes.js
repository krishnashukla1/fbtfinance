const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const {
  addIncome, getIncomes, updateIncome, deleteIncome,
  addExpense, getExpenses, updateExpense, deleteExpense,
  getFinanceSummary, downloadFinanceExcel
} = require('../controllers/financeController');

const router = express.Router();

// only admins may use these endpoints
router.post('/income', protect, adminOnly, addIncome);
router.get('/incomes', protect, getIncomes);

router.put('/income/:id', protect, adminOnly, updateIncome);
router.delete('/income/:id', protect, adminOnly, deleteIncome);

router.post('/expense', protect, adminOnly, addExpense);
router.get('/expenses', protect, getExpenses);

router.put('/expense/:id', protect, adminOnly, updateExpense);
router.delete('/expense/:id', protect, adminOnly, deleteExpense);

router.get('/summary', protect,  getFinanceSummary);
router.get('/download/excel', protect, downloadFinanceExcel);


module.exports = router;

