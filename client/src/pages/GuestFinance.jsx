
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api';
// import {
//   FiTrendingUp,
//   FiDollarSign,
//   FiDownload,
//   FiLogOut,
//   FiChevronLeft,
//   FiChevronRight,
// } from 'react-icons/fi';

// const CURRENCIES = ['USD', 'AED', 'INR', 'CAD', 'AUD'];

// const GuestFinance = () => {
//   const [summary, setSummary] = useState(null);
//   const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [selectedCurrency, setSelectedCurrency] = useState('INR');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [filterType, setFilterType] = useState('monthYear');
//   const [currentIncomePage, setCurrentIncomePage] = useState(1);
//   const [currentExpensePage, setCurrentExpensePage] = useState(1);
//   const itemsPerPage = 10;
//   const navigate = useNavigate();

//   // Currency symbol mapping
//   const currencySymbols = {
//     USD: '$', AED: 'د.إ', INR: '₹', CAD: 'C$', AUD: 'A$',
//   };

//   // Validate date range
//   const validateDateRange = () => {
//     if (filterType !== 'dateRange') return true;
//     if (!startDate || !endDate) {
//       setError('Both start date and end date are required.');
//       setTimeout(() => setError(''), 3000);
//       return false;
//     }
//     if (!Date.parse(startDate) || !Date.parse(endDate)) {
//       setError('Invalid date format for start or end date.');
//       setTimeout(() => setError(''), 3000);
//       return false;
//     }
//     if (new Date(startDate) > new Date(endDate)) {
//       setError('Start date cannot be after end date.');
//       setTimeout(() => setError(''), 3000);
//       return false;
//     }
//     return true;
//   };

//   // Fetch data
//   const fetchData = async () => {
//     if (filterType === 'dateRange' && !validateDateRange()) return;
//     setIsLoading(true);
//     try {
//       const query = filterType === 'dateRange'
//         ? `startDate=${startDate}&endDate=${endDate}&currency=${selectedCurrency}`
//         : `month=${month}&year=${year}&currency=${selectedCurrency}`;

//       const [summaryRes, incomesRes, expensesRes] = await Promise.all([
//         api.get(`/finance/summary?${query}`),
//         api.get(`/finance/incomes?${query}`),
//         api.get(`/finance/expenses?${query}`),
//       ]);

//       setSummary(summaryRes.data);
//       setIncomes(incomesRes.data.incomes || []);
//       setExpenses(expensesRes.data.expenses || []);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch financial data.');
//       setTimeout(() => setError(''), 3000);
//       setIncomes([]);
//       setExpenses([]);
//       setSummary(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [month, year, startDate, endDate, filterType, selectedCurrency]);

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('userId');
//     setTimeout(() => navigate('/login'), 1500);
//   };

//   // Excel download
//   // const handleDownloadExcel = async () => {
//   //   if (filterType === 'dateRange' && !validateDateRange()) return;
//   //   try {
//   //     const query = filterType === 'dateRange'
//   //       ? `startDate=${startDate}&endDate=${endDate}&currency=${selectedCurrency}`
//   //       : `month=${month}&year=${year}&currency=${selectedCurrency}`;

//   //     const res = await api.get(`/finance/download/excel?${query}`, { responseType: 'blob' });
//   //     const url = window.URL.createObjectURL(new Blob([res.data]));
//   //     const link = document.createElement('a');
//   //     link.href = url;
//   //     link.setAttribute(
//   //       'download',
//   //       filterType === 'dateRange'
//   //         ? `finance_report_${startDate}_to_${endDate}_${selectedCurrency}.xlsx`
//   //         : `finance_report_${month}_${year}_${selectedCurrency}.xlsx`
//   //     );
//   //     document.body.appendChild(link);
//   //     link.click();
//   //     document.body.removeChild(link);
//   //     window.URL.revokeObjectURL(url);
//   //   } catch (err) {
//   //     setError(err.response?.data?.message || 'Failed to download Excel file.');
//   //     setTimeout(() => setError(''), 3000);
//   //   }
//   // };



//   const handleDownloadExcel = async () => {
//     if (filterType === 'dateRange' && !validateDateRange()) return;
//     try {
//       const query = filterType === 'dateRange'
//         ? `startDate=${startDate}&endDate=${endDate}&currency=${selectedCurrency}`
//         : `month=${month}&year=${year}&currency=${selectedCurrency}`;

//       const res = await api.get(`/finance/download/excel?${query}`, {
//         responseType: 'blob'
//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute(
//         'download',
//         filterType === 'dateRange'
//           ? `finance_report_${startDate}_to_${endDate}_${selectedCurrency}.xlsx`
//           : `finance_report_${month}_${year}_${selectedCurrency}.xlsx`
//       );
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error('❌ Error downloading Excel:', err);
//       setError(err.response?.data?.message || 'Failed to download Excel file. Please try again.');
//       setTimeout(() => setError(''), 3000);
//     }
//   };


//   // Pagination
//   const totalIncomePages = Math.ceil(incomes.length / itemsPerPage);
//   const paginatedIncomes = incomes.slice((currentIncomePage - 1) * itemsPerPage, currentIncomePage * itemsPerPage);
//   const totalExpensePages = Math.ceil(expenses.length / itemsPerPage);
//   const paginatedExpenses = expenses.slice((currentExpensePage - 1) * itemsPerPage, currentExpensePage * itemsPerPage);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Fixed Title Bar */}
//       <header className="fixed top-0 left-0 right-0 bg-blue-700 text-white shadow-lg z-10">
//         <div className="max-w-full mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-78 py-3 sm:py-4">
//           <h1 className="text-xl sm:text-2xl font-bold tracking-wide">FareBuzzer Guest Dashboard</h1>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition mt-2 sm:mt-0 cursor-pointer"
//             aria-label="Logout"
//           >
//             <FiLogOut /> Logout
//           </button>
//         </div>
//       </header>

//       {/* Scrollable Content */}
//       <div className="mt-20 sm:mt-16 max-w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8 overflow-y-auto">
//         {/* Messages */}
//         {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow max-w-6xl mx-auto">{error}</div>}

//         {/* Title + Excel Download */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 max-w-6xl mx-auto">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <FiTrendingUp className="text-blue-600" /> Guest Accounting Dashboard
//           </h2>
//           <button
//             onClick={handleDownloadExcel}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
//             aria-label="Download Excel Report"
//           >
//             <FiDownload /> Download Excel
//           </button>
//         </div>

//         {/* Filter Type and Currency Selector */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6 max-w-6xl mx-auto">
//           <select
//             value={filterType}
//             onChange={(e) => {
//               setFilterType(e.target.value);
//               setStartDate('');
//               setEndDate('');
//               setMonth(new Date().getMonth() + 1);
//               setYear(new Date().getFullYear());
//             }}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
//             aria-label="Select Filter Type"
//           >
//             <option value="monthYear">Month/Year</option>
//             <option value="dateRange">Date Range</option>
//           </select>
//           <select
//             value={selectedCurrency}
//             onChange={(e) => setSelectedCurrency(e.target.value)}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-32 cursor-pointer"
//             aria-label="Select Currency"
//           >
//             {CURRENCIES.map((currency) => (
//               <option key={currency} value={currency}>{currency}</option>
//             ))}
//           </select>
//           {filterType === 'monthYear' ? (
//             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(Number(e.target.value))}
//                 className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
//                 aria-label="Select Month"
//               >
//                 {[...Array(12)].map((_, i) => (
//                   <option key={i + 1} value={i + 1}>
//                     {new Date(0, i).toLocaleString('default', { month: 'long' })}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={year}
//                 onChange={(e) => setYear(Number(e.target.value))}
//                 className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-32 cursor-pointer"
//                 aria-label="Select Year"
//               >
//                 {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 1 + i).map((y) => (
//                   <option key={y} value={y}>{y}</option>
//                 ))}
//               </select>
//             </div>
//           ) : (
//             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
//                 aria-label="Select Start Date"
//               />
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
//                 aria-label="Select End Date"
//               />
//             </div>
//           )}
//         </div>

//         {/* Summary */}
//         {isLoading ? (
//           <div className="text-center text-gray-500 max-w-6xl mx-auto">Loading...</div>
//         ) : summary ? (
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center max-w-6xl mx-auto">
//             <div className="p-4 bg-green-50 rounded-lg shadow">
//               <p className="text-sm text-gray-500">Total Income</p>
//               <p className="text-lg sm:text-xl font-bold text-green-600">
//                 {currencySymbols[selectedCurrency]}{summary.totalIncome?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 (₹{summary.totalIncomeINR?.toLocaleString(undefined, { minimumFractionDigits: 2 })} INR)
//               </p>
//             </div>
//             <div className="p-4 bg-red-50 rounded-lg shadow">
//               <p className="text-sm text-gray-500">Total Expenses</p>
//               <p className="text-lg sm:text-xl font-bold text-red-600">
//                 {currencySymbols[selectedCurrency]}{summary.totalExpense?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 (₹{summary.totalExpenseINR?.toLocaleString(undefined, { minimumFractionDigits: 2 })} INR)
//               </p>
//             </div>
//             <div className="p-4 bg-blue-50 rounded-lg shadow">
//               <p className="text-sm text-gray-500">Balance</p>
//               <p className="text-lg sm:text-xl font-bold text-blue-600">
//                 {currencySymbols[selectedCurrency]}{summary.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 (₹{summary.balanceINR?.toLocaleString(undefined, { minimumFractionDigits: 2 })} INR)
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 max-w-6xl mx-auto">No summary data available.</div>
//         )}



//         {/* Income Section */}
//         <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg max-w-6xl mx-auto">
//           <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
//             <FiDollarSign className="text-green-500" /> Income
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse rounded-lg shadow-sm table-auto">
//               <thead className="bg-green-600 text-white">
//                 <tr>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Type</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Category</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[150px]">Title</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Amount</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Currency</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Date</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Notes</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Created By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan="8" className="p-3 text-center text-gray-500">Loading...</td>
//                   </tr>
//                 ) : paginatedIncomes.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="p-3 text-center text-gray-500">No income records found.</td>
//                   </tr>
//                 ) : (
//                   paginatedIncomes.map((i) => (
//                     <tr key={i._id} className="border-b hover:bg-gray-50 transition">
//                       <td className="p-3 text-xs sm:text-base">{i.type}</td>
//                       <td className="p-3 text-xs sm:text-base">{i.category || '-'}</td>
//                       <td className="p-3 text-xs sm:text-base">{i.title}</td>
//                       <td className="p-3 text-green-600 font-semibold text-xs sm:text-base">
//                         {currencySymbols[i.currency]}{i.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className="p-3 text-xs sm:text-base">{i.currency}</td>
//                       <td className="p-3 text-xs sm:text-base">{new Date(i.date).toLocaleDateString('en-IN')}</td>
//                       <td className="p-3 text-xs sm:text-base">{i.notes || '-'}</td>
//                       {/* <td className="p-3 text-xs sm:text-base">
//                         {i.user ? `${i.user.name} (${i.user.email})` : '-'}
//                       </td> */}
//                        <td className="p-3 text-xs sm:text-base">Admin
//                         {/* {i.user ? `${i.user.name}` : '-'} */}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalIncomePages > 1 && (
//             <div className="flex justify-center items-center gap-4 mt-4 max-w-6xl mx-auto">
//               <button
//                 onClick={() => setCurrentIncomePage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentIncomePage === 1}
//                 className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 aria-label="Previous Income Page"
//               >
//                 <FiChevronLeft /> Previous
//               </button>
//               <span className="text-gray-700">Page {currentIncomePage} of {totalIncomePages}</span>
//               <button
//                 onClick={() => setCurrentIncomePage((prev) => Math.min(prev + 1, totalIncomePages))}
//                 disabled={currentIncomePage === totalIncomePages}
//                 className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 aria-label="Next Income Page"
//               >
//                 Next <FiChevronRight />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Expense Section */}
//         <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg max-w-6xl mx-auto">
//           <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
//             <FiDollarSign className="text-red-500" /> Expenses
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse rounded-lg shadow-sm table-auto">
//               <thead className="bg-red-600 text-white">
//                 <tr>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Type</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Category</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[150px]">Title</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Amount</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Currency</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Date</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Notes</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Created By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan="8" className="p-3 text-center text-gray-500">Loading...</td>
//                   </tr>
//                 ) : paginatedExpenses.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="p-3 text-center text-gray-500">No expense records found.</td>
//                   </tr>
//                 ) : (
//                   paginatedExpenses.map((e) => (
//                     <tr key={e._id} className="border-b hover:bg-gray-50 transition">
//                       <td className="p-3 text-xs sm:text-base">{e.type}</td>
//                       <td className="p-3 text-xs sm:text-base">{e.category || '-'}</td>
//                       <td className="p-3 text-xs sm:text-base">{e.title}</td>
//                       <td className="p-3 text-red-600 font-semibold text-xs sm:text-base">
//                         {currencySymbols[e.currency]}{e.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className="p-3 text-xs sm:text-base">{e.currency}</td>
//                       <td className="p-3 text-xs sm:text-base">{new Date(e.date).toLocaleDateString('en-IN')}</td>
//                       <td className="p-3 text-xs sm:text-base">{e.notes || '-'}</td>
//                       <td className="p-3 text-xs sm:text-base">Admin
//                         {/* {e.user ? `${e.user.name}` : '-'} */}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalExpensePages > 1 && (
//             <div className="flex justify-center items-center gap-4 mt-4 max-w-6xl mx-auto">
//               <button
//                 onClick={() => setCurrentExpensePage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentExpensePage === 1}
//                 className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 aria-label="Previous Expense Page"
//               >
//                 <FiChevronLeft /> Previous
//               </button>
//               <span className="text-gray-700">Page {currentExpensePage} of {totalExpensePages}</span>
//               <button
//                 onClick={() => setCurrentExpensePage((prev) => Math.min(prev + 1, totalExpensePages))}
//                 disabled={currentExpensePage === totalExpensePages}
//                 className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 aria-label="Next Expense Page"
//               >
//                 Next <FiChevronRight />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestFinance;

//==================HARD CODED CURENCY


// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api';
// import {
//   FiTrendingUp,
//   FiDollarSign,
//   FiDownload,
//   FiLogOut,
//   FiChevronLeft,
//   FiChevronRight,
// } from 'react-icons/fi';

// const CURRENCIES = ['USD', 'AED', 'INR', 'CAD', 'AUD'];

// // Hardcoded conversion rates (replace with API call for dynamic rates)
// // const conversionRates = {
// //   USD: 83.5, // Example: 1 INR = 0.012 USD, so 1 USD = 83.5 INR
// //   AED: 22.7, // Example: 1 INR = 0.044 AED, so 1 AED = 22.7 INR
// //   INR: 1,
// //   CAD: 61.8, // Example: 1 INR = 0.016 CAD, so 1 CAD = 61.8 INR
// //   AUD: 56.7, // Example: 1 INR = 0.018 AUD, so 1 AUD = 56.7 INR
// // };
// const conversionRates = {
//   USD: 83.33,
//   AED: 22.67,
//   INR: 1,
//   CAD: 61.50,
//   AUD: 54.00,
// };

// const GuestFinance = () => {
//   const [summary, setSummary] = useState(null);
//   const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [selectedCurrency, setSelectedCurrency] = useState('INR');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [filterType, setFilterType] = useState('monthYear');
//   const [currentIncomePage, setCurrentIncomePage] = useState(1);
//   const [currentExpensePage, setCurrentExpensePage] = useState(1);
//   const itemsPerPage = 10;
//   const navigate = useNavigate();

//   // Currency symbol mapping
//   const currencySymbols = {
//     USD: '$',
//     AED: 'د.إ',
//     INR: '₹',
//     CAD: 'C$',
//     AUD: 'A$',
//   };

//   // Validate date range
//   const validateDateRange = () => {
//     if (filterType !== 'dateRange') return true;
//     if (!startDate || !endDate) {
//       setError('Both start date and end date are required.');
//       setTimeout(() => setError(''), 3000);
//       return false;
//     }
//     if (!Date.parse(startDate) || !Date.parse(endDate)) {
//       setError('Invalid date format for start or end date.');
//       setTimeout(() => setError(''), 3000);
//       return false;
//     }
//     if (new Date(startDate) > new Date(endDate)) {
//       setError('Start date cannot be after end date.');
//       setTimeout(() => setError(''), 3000);
//       return false;
//     }
//     return true;
//   };

//   // Convert amount from INR to target currency for display
//   const convertFromINR = (amountInINR, toCurrency) => {
//     if (isNaN(amountInINR) || amountInINR === null || amountInINR === undefined) {
//       return 0;
//     }
//     if (toCurrency === 'INR') {
//       return Number(amountInINR).toFixed(2);
//     }
//     try {
//       return (Number(amountInINR) / conversionRates[toCurrency]).toFixed(2);
//     } catch (error) {
//       console.error('Error in currency conversion from INR:', error);
//       return Number(amountInINR).toFixed(2);
//     }
//   };

//   // Fetch data
//   const fetchData = async () => {
//     if (filterType === 'dateRange' && !validateDateRange()) return;
//     setIsLoading(true);
//     try {
//       const query = filterType === 'dateRange'
//         ? `startDate=${startDate}&endDate=${endDate}&currency=${selectedCurrency}`
//         : `month=${month}&year=${year}&currency=${selectedCurrency}`;
//       const [summaryRes, incomesRes, expensesRes] = await Promise.all([
//         api.get(`/finance/summary?${query}`),
//         api.get(`/finance/incomes?${query}`),
//         api.get(`/finance/expenses?${query}`),
//       ]);
//       setSummary(summaryRes.data);
//       setIncomes(incomesRes.data.incomes || []);
//       setExpenses(expensesRes.data.expenses || []);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.response?.data?.message || 'Failed to fetch financial data.');
//       setTimeout(() => setError(''), 3000);
//       setIncomes([]);
//       setExpenses([]);
//       setSummary(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [month, year, startDate, endDate, filterType, selectedCurrency]);

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('userId');
//     navigate('/login');
//   };

//   // Excel download
//   const handleDownloadExcel = async () => {
//     if (filterType === 'dateRange' && !validateDateRange()) return;
//     setIsDownloading(true);
//     try {
//       const query = filterType === 'dateRange'
//         ? `startDate=${startDate}&endDate=${endDate}&currency=${selectedCurrency}`
//         : `month=${month}&year=${year}&currency=${selectedCurrency}`;
//       const res = await api.get(`/finance/download/excel?${query}`, {
//         responseType: 'blob',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         },
//       });

//       // Verify response is a blob
//       if (!(res.data instanceof Blob)) {
//         throw new Error('Invalid response format: Expected a blob.');
//       }

//       const url = window.URL.createObjectURL(res.data);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute(
//         'download',
//         filterType === 'dateRange'
//           ? `finance_report_${startDate}_to_${endDate}_${selectedCurrency}.xlsx`
//           : `finance_report_${month}_${year}_${selectedCurrency}.xlsx`
//       );
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error('Error downloading Excel:', err);
//       let errorMessage = 'Failed to download Excel file. Please try again.';
//       if (err.response?.data instanceof Blob) {
//         try {
//           const text = await err.response.data.text();
//           const json = JSON.parse(text);
//           errorMessage = json.message || errorMessage;
//         } catch (parseErr) {
//           console.error('Error parsing blob error response:', parseErr);
//         }
//       } else if (err.response?.data?.message) {
//         errorMessage = err.response.data.message;
//       }
//       setError(errorMessage);
//       setTimeout(() => setError(''), 3000);
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   // Pagination
//   const totalIncomePages = Math.ceil(incomes.length / itemsPerPage);
//   const paginatedIncomes = incomes.slice((currentIncomePage - 1) * itemsPerPage, currentIncomePage * itemsPerPage);
//   const totalExpensePages = Math.ceil(expenses.length / itemsPerPage);
//   const paginatedExpenses = expenses.slice((currentExpensePage - 1) * itemsPerPage, currentExpensePage * itemsPerPage);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Fixed Title Bar */}
//       <header className="fixed top-0 left-0 right-0 bg-blue-700 text-white shadow-lg z-10">
//         <div className="max-w-full mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-3 sm:py-4">
//           <h1 className="text-xl sm:text-2xl font-bold tracking-wide">FareBuzzer Guest Dashboard</h1>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition mt-2 sm:mt-0 cursor-pointer"
//             aria-label="Logout"
//           >
//             <FiLogOut /> Logout
//           </button>
//         </div>
//       </header>
//       {/* Scrollable Content */}
//       <div className="mt-20 sm:mt-16 max-w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8 overflow-y-auto">
//         {/* Messages */}
//         {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow max-w-6xl mx-auto">{error}</div>}
//         {/* Title + Excel Download */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 max-w-6xl mx-auto">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <FiTrendingUp className="text-blue-600" /> Guest Accounting Dashboard
//           </h2>
//           {/* <button
//             onClick={handleDownloadExcel}
//             disabled={isDownloading}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
//             aria-label="Download Excel Report"
//           >
//             <FiDownload /> {isDownloading ? 'Downloading...' : 'Download Excel'}
//           </button> */}
//         </div>
//         {/* Filter Type and Currency Selector */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6 max-w-6xl mx-auto">
//           <select
//             value={filterType}
//             onChange={(e) => {
//               setFilterType(e.target.value);
//               setStartDate('');
//               setEndDate('');
//               setMonth(new Date().getMonth() + 1);
//               setYear(new Date().getFullYear());
//             }}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
//             aria-label="Select Filter Type"
//           >
//             <option value="monthYear">Month/Year</option>
//             <option value="dateRange">Date Range</option>
//           </select>
//           <select
//             value={selectedCurrency}
//             onChange={(e) => setSelectedCurrency(e.target.value)}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-32 cursor-pointer"
//             aria-label="Select Currency"
//           >
//             {CURRENCIES.map((currency) => (
//               <option key={currency} value={currency}>{currency}</option>
//             ))}
//           </select>
//           {filterType === 'monthYear' ? (
//             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(Number(e.target.value))}
//                 className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
//                 aria-label="Select Month"
//               >
//                 {[...Array(12)].map((_, i) => (
//                   <option key={i + 1} value={i + 1}>
//                     {new Date(0, i).toLocaleString('default', { month: 'long' })}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={year}
//                 onChange={(e) => setYear(Number(e.target.value))}
//                 className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-32 cursor-pointer"
//                 aria-label="Select Year"
//               >
//                 {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 1 + i).map((y) => (
//                   <option key={y} value={y}>{y}</option>
//                 ))}
//               </select>
//             </div>
//           ) : (
//             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
//                 aria-label="Select Start Date"
//               />
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
//                 aria-label="Select End Date"
//               />
//             </div>
//           )}
//         </div>
//         {/* Summary */}
//         {isLoading ? (
//           <div className="text-center text-gray-500 max-w-6xl mx-auto">Loading...</div>
//         ) : summary ? (
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center max-w-6xl mx-auto">
//             <div className="p-4 bg-green-50 rounded-lg shadow">
//               <p className="text-sm text-gray-500">Total Income</p>
//               <p className="text-lg sm:text-xl font-bold text-green-600">
//                 {currencySymbols[selectedCurrency]}{summary.totalIncome ? summary.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 (₹{summary.totalIncomeINR ? summary.totalIncomeINR.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} INR)
//               </p>
//             </div>
//             <div className="p-4 bg-red-50 rounded-lg shadow">
//               <p className="text-sm text-gray-500">Total Expenses</p>
//               <p className="text-lg sm:text-xl font-bold text-red-600">
//                 {currencySymbols[selectedCurrency]}{summary.totalExpense ? summary.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 (₹{summary.totalExpenseINR ? summary.totalExpenseINR.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} INR)
//               </p>
//             </div>
//             <div className="p-4 bg-blue-50 rounded-lg shadow">
//               <p className="text-sm text-gray-500">Balance</p>
//               <p className="text-lg sm:text-xl font-bold text-blue-600">
//                 {currencySymbols[selectedCurrency]}{summary.balance ? summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 (₹{summary.balanceINR ? summary.balanceINR.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} INR)
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 max-w-6xl mx-auto">No summary data available.</div>
//         )}
//         {/* Multi-Currency Summary */}
//         <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-4 text-center max-w-6xl mx-auto">
//           {CURRENCIES.map((currency) => {
//             const currencySummary = {
//               income: convertFromINR(summary?.totalIncomeINR || 0, currency),
//               expense: convertFromINR(summary?.totalExpenseINR || 0, currency),
//               balance: convertFromINR(summary?.balanceINR || 0, currency),
//             };
//             return (
//               <div key={currency} className="p-4 bg-gray-50 rounded-lg shadow">
//                 <p className="text-sm text-gray-500">{currency}</p>
//                 <p className="text-sm font-bold text-green-600">
//                   Income: {currencySymbols[currency]}{currencySummary.income}
//                 </p>
//                 <p className="text-sm font-bold text-red-600">
//                   Expenses: {currencySymbols[currency]}{currencySummary.expense}
//                 </p>
//                 <p className="text-sm font-bold text-blue-600">
//                   Balance: {currencySymbols[currency]}{currencySummary.balance}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//         {/* Income Section */}
//         <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg max-w-6xl mx-auto">
//           <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
//             <FiDollarSign className="text-green-500" /> Income
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse rounded-lg shadow-sm table-auto">
//               <thead className="bg-green-600 text-white">
//                 <tr>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Type</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Category</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[150px]">Title</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Amount</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Currency</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Date</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Notes</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Created By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan="8" className="p-3 text-center text-gray-500">Loading...</td>
//                   </tr>
//                 ) : paginatedIncomes.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="p-3 text-center text-gray-500">No income records found.</td>
//                   </tr>
//                 ) : (
//                   paginatedIncomes.map((i) => (
//                     <tr key={i._id} className="border-b hover:bg-gray-50 transition">
//                       <td className="p-3 text-xs sm:text-base">{i.type}</td>
//                       <td className="p-3 text-xs sm:text-base">{i.category || '-'}</td>
//                       <td className="p-3 text-xs sm:text-base">{i.title}</td>
//                       <td className="p-3 text-green-600 font-semibold text-xs sm:text-base">
//                         {currencySymbols[i.currency]}{i.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className="p-3 text-xs sm:text-base">{i.currency}</td>
//                       <td className="p-3 text-xs sm:text-base">{new Date(i.date).toLocaleDateString('en-IN')}</td>
//                       <td className="p-3 text-xs sm:text-base">{i.notes || '-'}</td>
//                       <td className="p-3 text-xs sm:text-base">Admin</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalIncomePages > 1 && (
//             <div className="flex justify-center items-center gap-4 mt-4 max-w-6xl mx-auto">
//               <button
//                 onClick={() => setCurrentIncomePage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentIncomePage === 1}
//                 className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 aria-label="Previous Income Page"
//               >
//                 <FiChevronLeft /> Previous
//               </button>
//               <span className="text-gray-700">Page {currentIncomePage} of {totalIncomePages}</span>
//               <button
//                 onClick={() => setCurrentIncomePage((prev) => Math.min(prev + 1, totalIncomePages))}
//                 disabled={currentIncomePage === totalIncomePages}
//                 className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 aria-label="Next Income Page"
//               >
//                 Next <FiChevronRight />
//               </button>
//             </div>
//           )}
//         </div>
//         {/* Expense Section */}
//         <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg max-w-6xl mx-auto">
//           <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
//             <FiDollarSign className="text-red-500" /> Expenses
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse rounded-lg shadow-sm table-auto">
//               <thead className="bg-red-600 text-white">
//                 <tr>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Type</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Category</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[150px]">Title</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Amount</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Currency</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Date</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Notes</th>
//                   <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Created By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan="8" className="p-3 text-center text-gray-500">Loading...</td>
//                   </tr>
//                 ) : paginatedExpenses.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="p-3 text-center text-gray-500">No expense records found.</td>
//                   </tr>
//                 ) : (
//                   paginatedExpenses.map((e) => (
//                     <tr key={e._id} className="border-b hover:bg-gray-50 transition">
//                       <td className="p-3 text-xs sm:text-base">{e.type}</td>
//                       <td className="p-3 text-xs sm:text-base">{e.category || '-'}</td>
//                       <td className="p-3 text-xs sm:text-base">{e.title}</td>
//                       <td className="p-3 text-red-600 font-semibold text-xs sm:text-base">
//                         {currencySymbols[e.currency]}{e.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className="p-3 text-xs sm:text-base">{e.currency}</td>
//                       <td className="p-3 text-xs sm:text-base">{new Date(e.date).toLocaleDateString('en-IN')}</td>
//                       <td className="p-3 text-xs sm:text-base">{e.notes || '-'}</td>
//                       <td className="p-3 text-xs sm:text-base">Admin</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalExpensePages > 1 && (
//             <div className="flex justify-center items-center gap-4 mt-4 max-w-6xl mx-auto">
//               <button
//                 onClick={() => setCurrentExpensePage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentExpensePage === 1}
//                 className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 aria-label="Previous Expense Page"
//               >
//                 <FiChevronLeft /> Previous
//               </button>
//               <span className="text-gray-700">Page {currentExpensePage} of {totalExpensePages}</span>
//               <button
//                 onClick={() => setCurrentExpensePage((prev) => Math.min(prev + 1, totalExpensePages))}
//                 disabled={currentExpensePage === totalExpensePages}
//                 className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 aria-label="Next Expense Page"
//               >
//                 Next <FiChevronRight />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestFinance;


//==================LIVE CURRENCY=======

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  FiTrendingUp,
  FiDollarSign,
  FiDownload,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from 'react-icons/fi';

const CURRENCIES = ['USD', 'AED', 'INR', 'CAD', 'AUD'];

const GuestFinance = () => {
  const [summary, setSummary] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState('monthYear');
  const [currentIncomePage, setCurrentIncomePage] = useState(1);
  const [currentExpensePage, setCurrentExpensePage] = useState(1);
  const [liveRates, setLiveRates] = useState(null);
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Currency symbol mapping
  const currencySymbols = {
    USD: '$',
    AED: 'د.إ',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
  };

  // Fetch live exchange rates
  const fetchLiveRates = async () => {
    if (isFetchingRates) return;
    setIsFetchingRates(true);
    try {
      const response = await api.get('/finance/exchange-rates');
      const rates = response.data.rates;
      // Format rates: 1 Foreign = X INR
      const formattedRates = {};
      CURRENCIES.forEach((currency) => {
        if (currency !== 'INR') {
          formattedRates[currency] = Number((1 / rates[currency]).toFixed(2));
        } else {
          formattedRates[currency] = 1;
        }
      });
      setLiveRates(formattedRates);
    } catch (err) {
      console.error('Error fetching live rates:', err);
      setError('Failed to fetch live exchange rates. Using fallback rates.');
      // Fallback rates (approximate values for Sep 25, 2025)
      setLiveRates({
        USD: 88.76,
        AED: 24.16,
        INR: 1,
        CAD: 63.83,
        AUD: 58.41,
      });
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsFetchingRates(false);
    }
  };

  // Convert amount from INR to target currency for display
  const convertFromINR = (amountInINR, toCurrency) => {
    if (isNaN(amountInINR) || amountInINR === null || amountInINR === undefined) {
      return 0;
    }
    if (toCurrency === 'INR') {
      return Number(amountInINR).toFixed(2);
    }
    try {
      if (!liveRates || !liveRates[toCurrency]) {
        throw new Error(`No conversion rate available for ${toCurrency}`);
      }
      return (Number(amountInINR) / liveRates[toCurrency]).toFixed(2);
    } catch (error) {
      console.error('Error in currency conversion from INR:', error);
      return Number(amountInINR).toFixed(2);
    }
  };

  // Validate date range
  const validateDateRange = () => {
    if (filterType !== 'dateRange') return true;
    if (!startDate || !endDate) {
      setError('Both start date and end date are required.');
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

  // Fetch data
  const fetchData = async () => {
    if (filterType === 'dateRange' && !validateDateRange()) return;
    setIsLoading(true);
    try {
      const query = filterType === 'dateRange'
        ? `startDate=${startDate}&endDate=${endDate}&currency=${selectedCurrency}`
        : `month=${month}&year=${year}&currency=${selectedCurrency}`;
      const [summaryRes, incomesRes, expensesRes] = await Promise.all([
        api.get(`/finance/summary?${query}`),
        api.get(`/finance/incomes?${query}`),
        api.get(`/finance/expenses?${query}`),
      ]);
      setSummary(summaryRes.data);
      setIncomes(incomesRes.data.incomes || []);
      setExpenses(expensesRes.data.expenses || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to fetch financial data.');
      setTimeout(() => setError(''), 3000);
      setIncomes([]);
      setExpenses([]);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
    fetchData();
  }, [month, year, startDate, endDate, filterType, selectedCurrency]);

  // Refresh rates periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(fetchLiveRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Excel download
  const handleDownloadExcel = async () => {
    if (filterType === 'dateRange' && !validateDateRange()) return;
    setIsDownloading(true);
    try {
      const query = filterType === 'dateRange'
        ? `startDate=${startDate}&endDate=${endDate}&currency=${selectedCurrency}`
        : `month=${month}&year=${year}&currency=${selectedCurrency}`;
      const res = await api.get(`/finance/download/excel?${query}`, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      // Verify response is a blob
      if (!(res.data instanceof Blob)) {
        throw new Error('Invalid response format: Expected a blob.');
      }

      const url = window.URL.createObjectURL(res.data);
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
      console.error('Error downloading Excel:', err);
      let errorMessage = 'Failed to download Excel file. Please try again.';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch (parseErr) {
          console.error('Error parsing blob error response:', parseErr);
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  // Pagination
  const totalIncomePages = Math.ceil(incomes.length / itemsPerPage);
  const paginatedIncomes = incomes.slice((currentIncomePage - 1) * itemsPerPage, currentIncomePage * itemsPerPage);
  const totalExpensePages = Math.ceil(expenses.length / itemsPerPage);
  const paginatedExpenses = expenses.slice((currentExpensePage - 1) * itemsPerPage, currentExpensePage * itemsPerPage);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Fixed Title Bar */}
      <header className="fixed top-0 left-0 right-0 bg-blue-700 text-white shadow-lg z-10">
        <div className="max-w-full mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">FareBuzzer Guest Dashboard</h1>
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
      <div className="mt-20 sm:mt-16 max-w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8 overflow-y-auto">
        {/* Messages */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow max-w-6xl mx-auto">{error}</div>}
        {/* Title + Excel Download */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiTrendingUp className="text-blue-600" /> Guest Accounting Dashboard
          </h2>
          {/* <button
            onClick={handleDownloadExcel}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
            aria-label="Download Excel Report"
          >
            <FiDownload /> {isDownloading ? 'Downloading...' : 'Download Excel'}
          </button> */}
        </div>
        {/* Live Currency Card */}
        {/* <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiDollarSign className="text-blue-600" /> Live Currency Rates Today ({today})
            </h3>
            <button
              onClick={fetchLiveRates}
              disabled={isFetchingRates}
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition disabled:opacity-50"
              aria-label="Refresh Rates"
            >
              <FiRefreshCw className={isFetchingRates ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
          {isFetchingRates ? (
            <div className="text-center text-gray-500">Fetching live rates...</div>
          ) : liveRates ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {CURRENCIES.filter(c => c !== 'INR').map((currency) => (
                <div key={currency} className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-600">{currency}</p>
                  <p className="text-lg font-bold text-blue-600">
                    1 {currency} = {liveRates[currency]} ₹
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No rates available</div>
          )}
        </div> */}


        {/* Filter Type and Currency Selector */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 max-w-6xl mx-auto">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setStartDate('');
              setEndDate('');
              setMonth(new Date().getMonth() + 1);
              setYear(new Date().getFullYear());
            }}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
            aria-label="Select Filter Type"
          >
            <option value="monthYear">Month/Year</option>
            <option value="dateRange">Date Range</option>
          </select>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-32 cursor-pointer"
            aria-label="Select Currency"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          {filterType === 'monthYear' ? (
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
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
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-32 cursor-pointer"
                aria-label="Select Year"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 1 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
                aria-label="Select Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 cursor-pointer"
                aria-label="Select End Date"
              />
            </div>
          )}
        </div>
        {/* Summary */}
        {isLoading ? (
          <div className="text-center text-gray-500 max-w-6xl mx-auto">Loading...</div>
        ) : summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center max-w-6xl mx-auto">
            <div className="p-4 bg-green-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-lg sm:text-xl font-bold text-green-600">
                {currencySymbols[selectedCurrency]}{summary.totalIncome ? summary.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (₹{summary.totalIncomeINR ? summary.totalIncomeINR.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} INR)
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-lg sm:text-xl font-bold text-red-600">
                {currencySymbols[selectedCurrency]}{summary.totalExpense ? summary.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (₹{summary.totalExpenseINR ? summary.totalExpenseINR.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} INR)
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-lg sm:text-xl font-bold text-blue-600">
                {currencySymbols[selectedCurrency]}{summary.balance ? summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (₹{summary.balanceINR ? summary.balanceINR.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'} INR)
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 max-w-6xl mx-auto">No summary data available.</div>
        )}
        {/* Multi-Currency Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-4 text-center max-w-6xl mx-auto">
          {CURRENCIES.map((currency) => {
            const currencySummary = {
              income: convertFromINR(summary?.totalIncomeINR || 0, currency),
              expense: convertFromINR(summary?.totalExpenseINR || 0, currency),
              balance: convertFromINR(summary?.balanceINR || 0, currency),
            };
            return (
              <div key={currency} className="p-4 bg-gray-50 rounded-lg shadow">
                <p className="text-sm text-gray-500">{currency}</p>
                <p className="text-sm font-bold text-green-600">
                  Income: {currencySymbols[currency]}{currencySummary.income}
                </p>
                <p className="text-sm font-bold text-red-600">
                  Expenses: {currencySymbols[currency]}{currencySummary.expense}
                </p>
                <p className="text-sm font-bold text-blue-600">
                  Balance: {currencySymbols[currency]}{currencySummary.balance}
                </p>
              </div>
            );
          })}
        </div>
        {/* Income Section */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg max-w-6xl mx-auto">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <FiDollarSign className="text-green-500" /> Income
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-sm table-auto">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Type</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Category</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[150px]">Title</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Amount</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Currency</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Date</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Notes</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Created By</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : paginatedIncomes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">No income records found.</td>
                  </tr>
                ) : (
                  paginatedIncomes.map((i) => (
                    <tr key={i._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 text-xs sm:text-base">{i.type}</td>
                      <td className="p-3 text-xs sm:text-base">{i.category || '-'}</td>
                      <td className="p-3 text-xs sm:text-base">{i.title}</td>
                      <td className="p-3 text-green-600 font-semibold text-xs sm:text-base">
                        {currencySymbols[i.currency]}{i.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-xs sm:text-base">{i.currency}</td>
                      <td className="p-3 text-xs sm:text-base">{new Date(i.date).toLocaleDateString('en-IN')}</td>
                      <td className="p-3 text-xs sm:text-base">{i.notes || '-'}</td>
                      <td className="p-3 text-xs sm:text-base">Admin</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalIncomePages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4 max-w-6xl mx-auto">
              <button
                onClick={() => setCurrentIncomePage((prev) => Math.max(prev - 1, 1))}
                disabled={currentIncomePage === 1}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                aria-label="Previous Income Page"
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="text-gray-700">Page {currentIncomePage} of {totalIncomePages}</span>
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
        {/* Expense Section */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg max-w-6xl mx-auto">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <FiDollarSign className="text-red-500" /> Expenses
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-sm table-auto">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Type</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Category</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[150px]">Title</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Amount</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[100px]">Currency</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[120px]">Date</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Notes</th>
                  <th className="p-3 text-left text-xs sm:text-base min-w-[200px]">Created By</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : paginatedExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">No expense records found.</td>
                  </tr>
                ) : (
                  paginatedExpenses.map((e) => (
                    <tr key={e._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 text-xs sm:text-base">{e.type}</td>
                      <td className="p-3 text-xs sm:text-base">{e.category || '-'}</td>
                      <td className="p-3 text-xs sm:text-base">{e.title}</td>
                      <td className="p-3 text-red-600 font-semibold text-xs sm:text-base">
                        {currencySymbols[e.currency]}{e.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-xs sm:text-base">{e.currency}</td>
                      <td className="p-3 text-xs sm:text-base">{new Date(e.date).toLocaleDateString('en-IN')}</td>
                      <td className="p-3 text-xs sm:text-base">{e.notes || '-'}</td>
                      <td className="p-3 text-xs sm:text-base">Admin</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalExpensePages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4 max-w-6xl mx-auto">
              <button
                onClick={() => setCurrentExpensePage((prev) => Math.max(prev - 1, 1))}
                disabled={currentExpensePage === 1}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                aria-label="Previous Expense Page"
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="text-gray-700">Page {currentExpensePage} of {totalExpensePages}</span>
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

export default GuestFinance;