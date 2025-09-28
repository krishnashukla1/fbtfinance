
//==============CORRECT WITH HARDCODED CURRNECY===========================


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  FiTrendingUp,
  FiDollarSign,
  FiTrash2,
  FiDownload,
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

// 🔹 Predefined categories from backend schemas
const INCOME_CATEGORIES = [
  'MCO Meta',
  'MCO PPC',
  'Meta Rental',
  'Commission',
  'Technology Sale',
  'Domestic Tour Package',
  'International Tour Package',
  'Airline Ticket',
  'Hotel',
  'Car Hire',
  'Activities',
  'Airport Transfers',
  'Visa',
  'Others'
];

const EXPENSE_CATEGORIES = [
  'Salaries',
  'Incentives',
  'Rent',
  'Travel Allowance Agent',
  'Travel Allowance Owner',
  'Meta Recharge',
  'Chargeback',
  'Refunds',
  'Miscellaneous Expenses',
  'Call Payment',
  'Others'
];

const CURRENCIES = ['USD', 'AED', 'INR', 'CAD', 'AUD'];

const Finance = () => {
  const [summary, setSummary] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newIncome, setNewIncome] = useState({
    type: 'Income',
    category: '',
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    currency: 'INR',
  });
  const [newExpense, setNewExpense] = useState({
    type: 'Expense',
    category: '',
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    currency: 'INR',
  });
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState('monthYear');
  const [currentIncomePage, setCurrentIncomePage] = useState(1);
  const [currentExpensePage, setCurrentExpensePage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // 🔹 Currency symbol mapping
  const currencySymbols = {
    USD: '$',
    AED: 'د.إ',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
  };

  // 🔹 CORRECT Currency conversion rates (1 foreign currency = X INR)
  const conversionRates = {
    USD: 83.33,    // 1 USD = 83.33 INR
    AED: 22.67,    // 1 AED = 22.67 INR
    INR: 1,        // Base currency
    CAD: 61.50,    // 1 CAD = 61.50 INR
    AUD: 54.00,    // 1 AUD = 54.00 INR
  };

  // 🔹 Convert amount to INR for summary calculations
  const convertToINR = (amount, fromCurrency) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return 0;
    }

    if (fromCurrency === 'INR') {
      return Number(amount);
    }

    try {
      return Number(amount) * conversionRates[fromCurrency];
    } catch (error) {
      console.error('Error in currency conversion to INR:', error);
      return Number(amount) || 0;
    }
  };

  // 🔹 Convert amount from INR to target currency for display
  const convertFromINR = (amountInINR, toCurrency) => {
    if (isNaN(amountInINR) || amountInINR === null || amountInINR === undefined) {
      return 0;
    }

    if (toCurrency === 'INR') {
      return Number(amountInINR);
    }

    try {
      return Number(amountInINR) / conversionRates[toCurrency];
    } catch (error) {
      console.error('Error in currency conversion from INR:', error);
      return Number(amountInINR) || 0;
    }
  };

  // 🔹 Validate input
  const validateInput = (input) => {
    if (!input.title || !input.amount || !input.date || !input.currency) {
      setError('Title, amount, date, and currency are required.');
      setTimeout(() => setError(''), 3000);
      return false;
    }
    if (isNaN(input.amount) || Number(input.amount) <= 0) {
      setError('Amount must be a positive number.');
      setTimeout(() => setError(''), 3000);
      return false;
    }
    if (!Date.parse(input.date)) {
      setError('Invalid date format.');
      setTimeout(() => setError(''), 3000);
      return false;
    }
    if (input.category && input.type === 'Income' && !INCOME_CATEGORIES.includes(input.category)) {
      setError(`Category must be one of: ${INCOME_CATEGORIES.join(', ')}.`);
      setTimeout(() => setError(''), 3000);
      return false;
    }
    if (input.category && input.type === 'Expense' && !EXPENSE_CATEGORIES.includes(input.category)) {
      setError(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}.`);
      setTimeout(() => setError(''), 3000);
      return false;
    }
    if (!CURRENCIES.includes(input.currency)) {
      setError(`Currency must be one of: ${CURRENCIES.join(', ')}.`);
      setTimeout(() => setError(''), 3000);
      return false;
    }
    return true;
  };

  // 🔹 Validate date range
  const validateDateRange = () => {
    if (filterType !== 'dateRange') return true;
    if (!startDate || !endDate) {
      setError('Both start date and end date are required for date range filtering.');
      setTimeout(() => setError(''), 3000);
      return false;
    }
    if (!Date.parse(startDate) || !Date.parse(endDate)) {
      setError('Invalid date format for start or end date.');
      setTimeout(() => setError(''), 3000);
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      setTimeout(() => setError(''), 3000);
      return false;
    }
    return true;
  };

  // 🔹 Fetch Finance Data


  const fetchData = async () => {
    if (filterType === 'dateRange' && !validateDateRange()) return;
    setIsLoading(true);
    try {
      const query = filterType === 'dateRange'
        ? `startDate=${startDate}&endDate=${endDate}&currency=INR`  // Add currency=INR
        : `month=${month}&year=${year}&currency=INR`;  // Add currency=INR

      const [summaryRes, incomesRes, expensesRes] = await Promise.all([
        api.get(`/finance/summary?${query}`),
        api.get(`/finance/incomes?${query}`),
        api.get(`/finance/expenses?${query}`),
      ]);

      // Summary is in INR (converted by backend)
      setSummary(summaryRes.data);

      // Process incomes - Show original amounts with their currencies
      const processedIncomes = Array.isArray(incomesRes.data?.incomes)
        ? incomesRes.data.incomes.map(i => ({
          ...i,
          amount: Number(i.amount) || 0,
          currency: i.currency || 'INR',
        })).sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];

      setIncomes(processedIncomes);

      // Process expenses - Show original amounts with their currencies
      const processedExpenses = Array.isArray(expensesRes.data?.expenses)
        ? expensesRes.data.expenses.map(e => ({
          ...e,
          amount: Number(e.amount) || 0,
          currency: e.currency || 'INR',
        })).sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];

      setExpenses(processedExpenses);

    } catch (err) {
      console.error('❌ Error fetching finance data:', err);
      setError(err.response?.data?.message || 'Failed to fetch financial data. Please try again.');
      setTimeout(() => setError(''), 3000);
      setIncomes([]);
      setExpenses([]);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year, startDate, endDate, filterType]);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setMessage('✅ You have successfully logged out!');
    setTimeout(() => navigate('/login'), 1500);
  };

  // 🔹 Excel Download

  // 🔹 Excel Download - Updated to include currency
  const handleDownloadExcel = async () => {
    if (filterType === 'dateRange' && !validateDateRange()) return;
    try {
      const query = filterType === 'dateRange'
        ? `startDate=${startDate}&endDate=${endDate}&currency=${selectedCurrency}`
        : `month=${month}&year=${year}&currency=${selectedCurrency}`;

      const res = await api.get(`/finance/download/excel?${query}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        filterType === 'dateRange'
          ? `finance_report_${startDate}_to_${endDate}_${selectedCurrency}.xlsx`
          : `finance_report_${month}_${year}_${selectedCurrency}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('❌ Error downloading Excel:', err);
      setError(err.response?.data?.message || 'Failed to download Excel file. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };
  // 🔹 Add Income
  const handleAddIncome = async () => {
    if (!validateInput(newIncome)) return;
    try {
      const incomeData = {
        ...newIncome,
        amount: Number(newIncome.amount),
        currency: newIncome.currency,
      };

      await api.post('/finance/income', incomeData);
      setNewIncome({
        type: 'Income',
        category: '',
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        currency: 'INR',
      });
      setMessage('✅ Income added successfully!');
      setTimeout(() => setMessage(''), 1500);
      fetchData();
    } catch (err) {
      console.error('❌ Error adding income:', err);
      setError(err.response?.data?.message || 'Failed to add income. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // 🔹 Add Expense
  const handleAddExpense = async () => {
    if (!validateInput(newExpense)) return;
    try {
      const expenseData = {
        ...newExpense,
        amount: Number(newExpense.amount),
        currency: newExpense.currency,
      };

      await api.post('/finance/expense', expenseData);
      setNewExpense({
        type: 'Expense',
        category: '',
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        currency: 'INR',
      });
      setMessage('✅ Expense added successfully!');
      setTimeout(() => setMessage(''), 1500);
      fetchData();
    } catch (err) {
      console.error('❌ Error adding expense:', err);
      setError(err.response?.data?.message || 'Failed to add expense. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // 🔹 Delete Handlers
  const handleDeleteIncome = async (id) => {
    try {
      await api.delete(`/finance/income/${id}`);
      setMessage('✅ Income deleted successfully!');
      setTimeout(() => setMessage(''), 1500);
      fetchData();
    } catch (err) {
      console.error('❌ Error deleting income:', err);
      setError(err.response?.data?.message || 'Failed to delete income. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/finance/expense/${id}`);
      setMessage('✅ Expense deleted successfully!');
      setTimeout(() => setMessage(''), 1500);
      fetchData();
    } catch (err) {
      console.error('❌ Error deleting expense:', err);
      setError(err.response?.data?.message || 'Failed to delete expense. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // 🔹 Edit Handlers
  const startEditIncome = (income) => {
    setEditingIncome({
      ...income,
      date: new Date(income.date).toISOString().split('T')[0],
    });
  };

  const cancelEditIncome = () => setEditingIncome(null);


  const saveEditIncome = async () => {
    if (!validateInput(editingIncome)) return;
    try {
      await api.put(`/finance/income/${editingIncome._id}`, {
        ...editingIncome,
        amount: Number(editingIncome.amount),
        currency: editingIncome.currency, // Make sure currency is included
      });
      setEditingIncome(null);
      setMessage('✅ Income updated successfully!');
      setTimeout(() => setMessage(''), 1500);
      fetchData();
    } catch (err) {
      console.error('❌ Error updating income:', err);
      setError(err.response?.data?.message || 'Failed to update income. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };
  const startEditExpense = (expense) => {
    setEditingExpense({
      ...expense,
      date: new Date(expense.date).toISOString().split('T')[0],
    });
  };

  const cancelEditExpense = () => setEditingExpense(null);


  const saveEditExpense = async () => {
    if (!validateInput(editingExpense)) return;
    try {
      await api.put(`/finance/expense/${editingExpense._id}`, {
        ...editingExpense,
        amount: Number(editingExpense.amount),
        currency: editingExpense.currency, // Make sure currency is included
      });
      setEditingExpense(null);
      setMessage('✅ Expense updated successfully!');
      setTimeout(() => setMessage(''), 1500);
      fetchData();
    } catch (err) {
      console.error('❌ Error updating expense:', err);
      setError(err.response?.data?.message || 'Failed to update expense. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getConvertedSummary = () => {
    if (!summary) return null;

    return {
      totalIncome: convertFromINR(summary.totalIncome, selectedCurrency),
      totalExpense: convertFromINR(summary.totalExpense, selectedCurrency),
      balance: convertFromINR(summary.balance, selectedCurrency),
    };
  };

  const convertedSummary = getConvertedSummary();

  // Pagination for Incomes
  const totalIncomePages = Math.ceil(incomes.length / itemsPerPage);
  const paginatedIncomes = incomes.slice((currentIncomePage - 1) * itemsPerPage, currentIncomePage * itemsPerPage);

  // Pagination for Expenses
  const totalExpensePages = Math.ceil(expenses.length / itemsPerPage);
  const paginatedExpenses = expenses.slice((currentExpensePage - 1) * itemsPerPage, currentExpensePage * itemsPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Fixed Title Bar */}
      <header className="fixed top-0 left-0 right-0 bg-blue-700 text-white shadow-lg z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
          {/* <h1 className="text-xl sm:text-2xl font-bold tracking-wide">FareBuzzer Accounting Report</h1> */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">FareBuzzer Admin Dashboard</h1>


       
          {/* <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition mt-2 sm:mt-0"
            aria-label="Logout"
          >
            <FiLogOut /> Logout
          </button> */}
          <button
  onClick={handleLogout}
  className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition mt-2 sm:mt-0 cursor-pointer"
  aria-label="Logout"
>
  <FiLogOut /> Logout
</button>

        </div>
      </header>

      {/* Scrollable Content */}
      <div className="mt-20 sm:mt-16 max-w-7xl mx-auto p-4 sm:p-6 space-y-8 overflow-y-auto">
        {/* Messages */}
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg shadow">{message}</div>
        )}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow">{error}</div>}

        {/* Title + Excel Download */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiTrendingUp className="text-blue-600" /> Accounting Dashboard
          </h2>
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
            aria-label="Download Excel Report"
          >
            <FiDownload /> Download Excel
          </button>
        </div>

        {/* Filter Type and Currency Selector */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setStartDate('');
              setEndDate('');
              setMonth(new Date().getMonth() + 1);
              setYear(new Date().getFullYear());
            }}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
            aria-label="Select Filter Type"
          >
            <option value="monthYear">Month/Year</option>
            <option value="dateRange">Date Range</option>
          </select>

          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
            aria-label="Select Currency"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          {filterType === 'monthYear' ? (
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
                aria-label="Select Month"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
                aria-label="Select Year"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 1 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
                aria-label="Select Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto cursor-pointer"
                aria-label="Select End Date"
              />
            </div>
          )}
        </div>

        {/* Summary */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : summary ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="p-4 bg-green-50 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-lg sm:text-xl font-bold text-green-600">
                  {currencySymbols[selectedCurrency]}{(convertedSummary?.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (₹{summary.totalIncome?.toLocaleString() || '0'} INR)
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-lg sm:text-xl font-bold text-red-600">
                  {currencySymbols[selectedCurrency]}{(convertedSummary?.totalExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (₹{summary.totalExpense?.toLocaleString() || '0'} INR)
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg shadow">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="text-lg sm:text-xl font-bold text-blue-600">
                  {currencySymbols[selectedCurrency]}{(convertedSummary?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (₹{summary.balance?.toLocaleString() || '0'} INR)
                </p>
              </div>
            </div>

            {/* Multi-Currency Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-4 text-center">
              {CURRENCIES.map((currency) => {
                const currencySummary = {
                  income: convertFromINR(summary.totalIncome || 0, currency),
                  expense: convertFromINR(summary.totalExpense || 0, currency),
                  balance: convertFromINR(summary.balance || 0, currency),
                };

                return (
                  <div key={currency} className="p-4 bg-gray-50 rounded-lg shadow">
                    <p className="text-sm text-gray-500">{currency}</p>
                    <p className="text-sm font-bold text-green-600">
                      Income: {currencySymbols[currency]}{currencySummary.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm font-bold text-red-600">
                      Expenses: {currencySymbols[currency]}{currencySummary.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm font-bold text-blue-600">
                      Balance: {currencySymbols[currency]}{currencySummary.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">No summary data available.</div>
        )}

        {/* Income Section */}
        <div className="bg-white p-4 sm:p-10 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <FiDollarSign className="text-green-500" /> Income
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Title"
              value={newIncome.title}
              onChange={(e) => setNewIncome({ ...newIncome, title: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Income Title"
            />
            <select
              value={newIncome.category}
              onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Select Income Category"
            >
              <option value="">Select Category (Optional)</option>
              {INCOME_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Income Amount"
              min="0"
              step="0.01"
            />
            <input
              type="date"
              value={newIncome.date}
              onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Income Date"
            />
            <select
              value={newIncome.currency}
              onChange={(e) => setNewIncome({ ...newIncome, currency: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Select Income Currency"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newIncome.notes}
              onChange={(e) => setNewIncome({ ...newIncome, notes: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Income Notes"
            />
            <button
              onClick={handleAddIncome}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto cursor-pointer"
              aria-label="Add Income"
            >
              Add
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left text-xs sm:text-base">Type</th>
                  <th className="p-3 text-left text-xs sm:text-base">Category</th>
                  <th className="p-3 text-left text-xs sm:text-base">Title</th>
                  <th className="p-3 text-left text-xs sm:text-base">Amount</th>
                  <th className="p-3 text-left text-xs sm:text-base">Currency</th>
                  <th className="p-3 text-left text-xs sm:text-base">Date</th>
                  <th className="p-3 text-left text-xs sm:text-base">Notes</th>
                  <th className="p-3 text-left text-xs sm:text-base">Action</th>
                </tr>
              </thead>


              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedIncomes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">
                      No income records found.
                    </td>
                  </tr>
                ) : (
                  paginatedIncomes.map((i) => (
                    <tr key={i._id} className="border-b hover:bg-gray-50 transition">
                      {/* Type */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingIncome?._id === i._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={editingIncome.type}
                            readOnly
                          />
                        ) : (
                          i.type
                        )}
                      </td>

                      {/* Category */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingIncome?._id === i._id ? (
                          <select
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={editingIncome.category || ''}
                            onChange={(e) => setEditingIncome({ ...editingIncome, category: e.target.value })}
                          >
                            <option value="">Select Category</option>
                            {INCOME_CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        ) : (
                          i.category || '-'
                        )}
                      </td>

                      {/* Title */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingIncome?._id === i._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={editingIncome.title}
                            onChange={(e) => setEditingIncome({ ...editingIncome, title: e.target.value })}
                          />
                        ) : (
                          i.title
                        )}
                      </td>

                      {/* Amount */}
                      <td className="p-3 text-green-600 font-semibold text-xs sm:text-base">
                        {editingIncome?._id === i._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="number"
                            value={editingIncome.amount}
                            onChange={(e) => setEditingIncome({ ...editingIncome, amount: e.target.value })}
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          `${currencySymbols[i.currency]}${i.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        )}
                      </td>

                      {/* Currency */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingIncome?._id === i._id ? (
                          <select
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={editingIncome.currency}
                            onChange={(e) => setEditingIncome({ ...editingIncome, currency: e.target.value })}
                          >
                            {CURRENCIES.map((currency) => (
                              <option key={currency} value={currency}>{currency}</option>
                            ))}
                          </select>
                        ) : (
                          i.currency
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingIncome?._id === i._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="date"
                            value={editingIncome.date}
                            onChange={(e) => setEditingIncome({ ...editingIncome, date: e.target.value })}
                          />
                        ) : (
                          new Date(i.date).toLocaleDateString('en-IN')
                        )}
                      </td>

                      {/* Notes */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingIncome?._id === i._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={editingIncome.notes || ''}
                            onChange={(e) => setEditingIncome({ ...editingIncome, notes: e.target.value })}
                          />
                        ) : (
                          i.notes || '-'
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-3 flex gap-2 ">
                        {editingIncome?._id === i._id ? (
                          <>
                            <button
                              onClick={saveEditIncome}
                              className="text-green-600 hover:text-green-800 cursor-pointer"
                              aria-label="Save Income Edit"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={cancelEditIncome}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                              aria-label="Cancel Income Edit"
                            >
                              <FiX />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditIncome(i)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              aria-label="Edit Income"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDeleteIncome(i._id)}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                              aria-label="Delete Income"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
          {/* Income Pagination */}
          {totalIncomePages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setCurrentIncomePage((prev) => Math.max(prev - 1, 1))}
                disabled={currentIncomePage === 1}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                aria-label="Previous Income Page"
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="text-gray-700">
                Page {currentIncomePage} of {totalIncomePages}
              </span>
              <button
                onClick={() => setCurrentIncomePage((prev) => Math.min(prev + 1, totalIncomePages))}
                disabled={currentIncomePage === totalIncomePages}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                aria-label="Next Income Page"
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* Expenses Section */}
        <div className="bg-white p-4 sm:p-10 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <FiDollarSign className="text-red-500" /> Expenses
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Title"
              value={newExpense.title}
              onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Expense Title"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Select Expense Category"
            >
              <option value="">Select Category (Optional)</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Expense Amount"
              min="0"
              step="0.01"
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Expense Date"
            />
            <select
              value={newExpense.currency}
              onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Select Expense Currency"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newExpense.notes}
              onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-1/5 cursor-pointer"
              aria-label="Expense Notes"
            />
            <button
              onClick={handleAddExpense}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full sm:w-auto cursor-pointer"
              aria-label="Add Expense"
            >
              Add
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-sm">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-3 text-left text-xs sm:text-base">Type</th>
                  <th className="p-3 text-left text-xs sm:text-base">Category</th>
                  <th className="p-3 text-left text-xs sm:text-base">Title</th>
                  <th className="p-3 text-left text-xs sm:text-base">Amount</th>
                  <th className="p-3 text-left text-xs sm:text-base">Currency</th>
                  <th className="p-3 text-left text-xs sm:text-base">Date</th>
                  <th className="p-3 text-left text-xs sm:text-base">Notes</th>
                  <th className="p-3 text-left text-xs sm:text-base">Action</th>
                </tr>
              </thead>


              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">
                      No expense records found.
                    </td>
                  </tr>
                ) : (
                  paginatedExpenses.map((e) => (
                    <tr key={e._id} className="border-b hover:bg-gray-50 transition">
                      {/* Type */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingExpense?._id === e._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={editingExpense.type}
                            readOnly
                          />
                        ) : (
                          e.type
                        )}
                      </td>

                      {/* Category */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingExpense?._id === e._id ? (
                          <select
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={editingExpense.category || ''}
                            onChange={(ev) => setEditingExpense({ ...editingExpense, category: ev.target.value })}
                          >
                            <option value="">Select Category</option>
                            {EXPENSE_CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        ) : (
                          e.category || '-'
                        )}
                      </td>

                      {/* Title */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingExpense?._id === e._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={editingExpense.title}
                            onChange={(ev) => setEditingExpense({ ...editingExpense, title: ev.target.value })}
                          />
                        ) : (
                          e.title
                        )}
                      </td>

                      {/* Amount */}
                      <td className="p-3 text-red-600 font-semibold text-xs sm:text-base">
                        {editingExpense?._id === e._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            type="number"
                            value={editingExpense.amount}
                            onChange={(ev) => setEditingExpense({ ...editingExpense, amount: ev.target.value })}
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          `${currencySymbols[e.currency]}${e.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        )}
                      </td>

                      {/* Currency */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingExpense?._id === e._id ? (
                          <select
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={editingExpense.currency}
                            onChange={(ev) => setEditingExpense({ ...editingExpense, currency: ev.target.value })}
                          >
                            {CURRENCIES.map((currency) => (
                              <option key={currency} value={currency}>{currency}</option>
                            ))}
                          </select>
                        ) : (
                          e.currency
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingExpense?._id === e._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            type="date"
                            value={editingExpense.date}
                            onChange={(ev) => setEditingExpense({ ...editingExpense, date: ev.target.value })}
                          />
                        ) : (
                          new Date(e.date).toLocaleDateString('en-IN')
                        )}
                      </td>

                      {/* Notes */}
                      <td className="p-3 text-xs sm:text-base">
                        {editingExpense?._id === e._id ? (
                          <input
                            className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={editingExpense.notes || ''}
                            onChange={(ev) => setEditingExpense({ ...editingExpense, notes: ev.target.value })}
                          />
                        ) : (
                          e.notes || '-'
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-3 flex gap-2">
                        {editingExpense?._id === e._id ? (
                          <>
                            <button
                              onClick={saveEditExpense}
                              className="text-green-600 hover:text-green-800 cursor-pointer "
                              aria-label="Save Expense Edit"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={cancelEditExpense}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                              aria-label="Cancel Expense Edit"
                            >
                              <FiX />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditExpense(e)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer "
                              aria-label="Edit Expense"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(e._id)}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                              aria-label="Delete Expense"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
          {/* Expense Pagination */}
          {totalExpensePages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setCurrentExpensePage((prev) => Math.max(prev - 1, 1))}
                disabled={currentExpensePage === 1}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                aria-label="Previous Expense Page"
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="text-gray-700">
                Page {currentExpensePage} of {totalExpensePages}
              </span>
              <button
                onClick={() => setCurrentExpensePage((prev) => Math.min(prev + 1, totalExpensePages))}
                disabled={currentExpensePage === totalExpensePages}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                aria-label="Next Expense Page"
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;



