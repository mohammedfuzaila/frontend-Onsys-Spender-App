import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Search, Plus, Filter, Edit2, Trash2, Calendar, 
  Tag, FileText, Loader2, IndianRupee, AlertCircle, Receipt,
  Clock, ArrowUpFromLine
} from 'lucide-react';
import { format } from 'date-fns';
import BottomSheet from '../components/BottomSheet';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const categories = ['Food', 'Lunch', 'Snacks', 'Tea / Coffee', 'Travel', 'Office', 'Shopping', 'Entertainment', 'Other'];

  const initialFormState = {
    expense_name: '',
    amount: '',
    category: 'Food',
    purpose: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm')
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchExpenses();
  }, [search, categoryFilter]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      let url = '/expenses/';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.get(url);
      setExpenses(response.data);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setIsEditMode(true);
      setCurrentExpense(expense);
      setFormData({
        expense_name: expense.expense_name,
        amount: expense.amount,
        category: expense.category,
        purpose: expense.purpose,
        description: expense.description || '',
        date: expense.date,
        time: expense.time
      });
    } else {
      setIsEditMode(false);
      setCurrentExpense(null);
      setFormData(initialFormState);
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditMode) {
        await api.put(`/expenses/${currentExpense.id}/`, formData);
      } else {
        await api.post('/expenses/', formData);
      }
      handleCloseModal();
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.amount?.[0] || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    setSaving(true);
    try {
      await api.delete(`/expenses/${expenseToDelete.id}/`);
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
      fetchExpenses();
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setSaving(false);
    }
  };

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-5 fade-in w-full max-w-full overflow-hidden">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Expense Ledger</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Daily Expenses</h1>
          <p className="text-xs text-slate-400 mt-0.5">Total Outflow: <span className="text-rose-400 font-bold">₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-1.5 gold-gradient-bg text-slate-950 font-black px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md shadow-amber-500/20 text-xs w-full sm:w-auto active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Search Bar & Category Chips (Mobile Horizontal Scrollable) */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by expense name..." 
            className="w-full pl-10 pr-4 py-2.5 bg-[#12151C] border border-[#1E2532] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-white placeholder-slate-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Scrollable Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${!categoryFilter ? 'gold-gradient-bg text-slate-950 shadow-sm' : 'bg-[#12151C] border border-[#1E2532] text-slate-400 hover:text-white'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat === categoryFilter ? '' : cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${categoryFilter === cat ? 'gold-gradient-bg text-slate-950 shadow-sm' : 'bg-[#12151C] border border-[#1E2532] text-slate-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Expense Feed & Table */}
      <div className="rounded-2xl bg-[#12151C] border border-[#1E2532] overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-[#1A202C] rounded-2xl flex items-center justify-center mx-auto mb-2.5 text-slate-500">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">No expenses found</h3>
            <p className="text-xs text-slate-500 mb-4">No transactions matched your search criteria.</p>
            <button 
              onClick={() => handleOpenModal()}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              + Record New Expense
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0E1117] border-b border-[#1E2532] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Expense</th>
                    <th className="py-3 px-5">Category</th>
                    <th className="py-3 px-5">Purpose</th>
                    <th className="py-3 px-5 text-right">Amount</th>
                    <th className="py-3 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A202C]">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-[#161B24] transition-colors group">
                      <td className="py-3.5 px-5 text-xs text-slate-400 whitespace-nowrap">
                        <span className="font-semibold text-white block">{format(new Date(expense.date), 'dd MMM yyyy')}</span>
                        <span className="text-slate-500 text-[10px]">{expense.time}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-xs sm:text-sm text-white">{expense.expense_name}</div>
                        {expense.description && (
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{expense.description}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#1C2330] text-amber-400 border border-amber-500/20">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-300 font-medium">{expense.purpose}</td>
                      <td className="py-3.5 px-5 text-right font-extrabold text-sm text-white whitespace-nowrap">
                        ₹{parseFloat(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex justify-center items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(expense)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-[#1E2532] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(expense)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Native App Cards */}
            <div className="md:hidden divide-y divide-[#1A202C]">
              {expenses.map((expense) => (
                <div key={expense.id} className="p-3.5 flex flex-col space-y-2 hover:bg-[#151922] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5 overflow-hidden pr-2">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                        <ArrowUpFromLine className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-xs text-white truncate leading-tight">{expense.expense_name}</h4>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{format(new Date(expense.date), 'dd MMM yyyy')}</span>
                          <span>&middot;</span>
                          <Clock className="w-2.5 h-2.5" />
                          <span>{expense.time}</span>
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-sm text-slate-100 flex-shrink-0">
                      -₹{parseFloat(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#1C2330] text-amber-400 border border-amber-500/20">
                        {expense.category}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[130px]">{expense.purpose}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleOpenModal(expense)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 bg-[#171C26] rounded-lg"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(expense)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 bg-[#171C26] rounded-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Expense Bottom Sheet */}
      <BottomSheet
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? 'Edit Expense' : 'Add New Expense'}
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2.5 text-slate-400 text-xs font-semibold hover:bg-[#1A202C] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="expense-form"
              disabled={saving}
              className="px-5 py-2.5 gold-gradient-bg text-slate-950 text-xs font-black rounded-xl hover:opacity-90 flex items-center min-w-[120px] justify-center shadow-md active:scale-95 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditMode ? 'Save Changes' : 'Record Expense')}
            </button>
          </>
        }
      >
        {error && (
          <div className="mb-1 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2.5 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form id="expense-form" onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Expense Name</label>
            <input
              type="text"
              name="expense_name"
              required
              value={formData.expense_name}
              onChange={handleInputChange}
              className="w-full px-3.5 py-3 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm"
              placeholder="e.g. Lunch with Team"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-2.5 py-3 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm font-bold"
                  placeholder="150.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm font-medium"
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-[#12151C]">{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time</label>
              <input
                type="time"
                name="time"
                required
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Purpose</label>
            <input
              type="text"
              name="purpose"
              required
              value={formData.purpose}
              onChange={handleInputChange}
              className="w-full px-3.5 py-3 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm"
              placeholder="e.g. Office daily refreshment"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description (Optional)</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white resize-none text-sm"
              placeholder="Additional details..."
            />
          </div>
        </form>
      </BottomSheet>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-[#232B3A] rounded-2xl shadow-2xl w-full max-w-sm p-5 text-center">
            <div className="w-11 h-11 bg-rose-500/15 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Delete Expense?</h3>
            <p className="text-slate-400 text-xs mb-4">
              Remove <span className="font-bold text-white">{expenseToDelete?.expense_name}</span> (₹{expenseToDelete?.amount})?
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-[#1A202C] text-slate-300 text-xs font-semibold rounded-xl hover:bg-[#252E40]"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 flex justify-center items-center shadow-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
