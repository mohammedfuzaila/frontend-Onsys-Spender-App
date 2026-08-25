import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { OnSysLogo, OnSysIcon } from '../components/OnSysLogo';
import {
  Wallet, Eye, Edit3, AlertTriangle, Loader2, ArrowDownToLine, ArrowUpFromLine,
  Plus, Calendar, IndianRupee, Edit2, Trash2, AlertCircle, Clock
} from 'lucide-react';
import { format } from 'date-fns';

const SharedView = () => {
  const { token } = useParams();
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [permission, setPermission] = useState('VIEW');

  // Modal state for editors
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const categories = ['Food', 'Lunch', 'Snacks', 'Tea / Coffee', 'Travel', 'Office', 'Shopping', 'Entertainment', 'Other'];
  const initialFormState = {
    expense_name: '', amount: '', category: 'Food', purpose: '',
    description: '', date: format(new Date(), 'yyyy-MM-dd'), time: format(new Date(), 'HH:mm')
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => { fetchAll(); }, [token]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [sRes, eRes] = await Promise.all([
        api.get(`/shared/${token}/summary/`),
        api.get(`/shared/${token}/expenses/`)
      ]);
      setSummary(sRes.data);
      setPermission(sRes.data.permission || 'VIEW');
      setExpenses(eRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'This shared link is inactive, revoked, or has expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setIsEditMode(true); setCurrentExpense(expense);
      setFormData({ expense_name: expense.expense_name, amount: expense.amount, category: expense.category, purpose: expense.purpose, description: expense.description || '', date: expense.date, time: expense.time });
    } else {
      setIsEditMode(false); setCurrentExpense(null); setFormData(initialFormState);
    }
    setFormError(''); setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setFormError('');
    try {
      if (isEditMode) {
        await api.put(`/shared/${token}/expenses/${currentExpense.id}/`, formData);
      } else {
        await api.post(`/shared/${token}/expenses/`, formData);
      }
      setIsModalOpen(false); fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.detail || err.response?.data?.amount?.[0] || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleDelete = async (expenseId, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/shared/${token}/expenses/${expenseId}/`); fetchAll(); }
    catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0C10]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0C10] p-6 text-center text-white">
        <div className="w-14 h-14 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center justify-center mb-3">
          <AlertTriangle className="w-7 h-7 text-rose-400" />
        </div>
        <h1 className="text-xl font-bold mb-1.5">Link Unavailable</h1>
        <p className="text-xs text-slate-400 max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 py-6 sm:py-10 px-4 antialiased">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532] flex items-center justify-between">
          <OnSysLogo size="md" subtitle="REPORT STATEMENT" />
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${permission === 'EDIT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
            {permission === 'EDIT' ? <><Edit3 className="w-3 h-3" /> Editor</> : <><Eye className="w-3 h-3" /> View Only</>}
          </span>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#12151C] border border-[#1E2532]">
            <p className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 mb-0.5">Received</p>
            <h3 className="text-xs sm:text-lg font-extrabold text-emerald-400">₹{parseFloat(summary?.total_received || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#12151C] border border-[#1E2532]">
            <p className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 mb-0.5">Spent</p>
            <h3 className="text-xs sm:text-lg font-extrabold text-rose-400">₹{parseFloat(summary?.total_spent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#1A202C] via-[#141824] to-[#0D1017] border border-amber-500/30 shadow-md">
            <p className="text-[9px] sm:text-[10px] font-bold uppercase text-amber-400 mb-0.5">Balance</p>
            <h3 className="text-xs sm:text-lg font-black text-white">₹{parseFloat(summary?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        {/* Expenses List */}
        <div className="rounded-2xl bg-[#12151C] border border-[#1E2532] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#1E2532] bg-[#0E1117]">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Itemized Statement</h2>
              <p className="text-[10px] text-slate-400">{expenses.length} transaction{expenses.length !== 1 ? 's' : ''}</p>
            </div>
            {permission === 'EDIT' && (
              <button onClick={() => handleOpenModal()} className="flex items-center gap-1 px-3 py-1.5 gold-gradient-bg text-slate-950 text-xs font-black rounded-xl hover:opacity-90 transition-opacity">
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> <span>Add</span>
              </button>
            )}
          </div>

          {expenses.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">No expenses recorded on this report yet.</div>
          ) : (
            <div className="divide-y divide-[#1A202C]">
              {expenses.map((expense) => (
                <div key={expense.id} className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-[#151922] transition-colors">
                  <div className="flex items-start gap-2.5 overflow-hidden pr-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowUpFromLine className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-white text-xs sm:text-sm truncate">{expense.expense_name}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 flex-wrap">
                        <span className="px-1.5 py-0.2 bg-[#1E2532] text-amber-400 rounded text-[9px] font-semibold">{expense.category}</span>
                        <span>&middot;</span>
                        <span>{expense.purpose}</span>
                        <span>&middot;</span>
                        <span>{format(new Date(expense.date), 'dd MMM yyyy')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="font-black text-xs sm:text-sm text-white">
                      ₹{parseFloat(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {permission === 'EDIT' && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleOpenModal(expense)} className="p-1 text-slate-400 hover:text-amber-400 bg-[#171C26] rounded-lg"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={() => handleDelete(expense.id, expense.expense_name)} className="p-1 text-slate-400 hover:text-rose-400 bg-[#171C26] rounded-lg"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 rounded-2xl bg-[#0E1117] border border-[#1E2532] text-center space-y-1">
          <p className="text-xs font-extrabold tracking-wider text-white">ONSYS INFOTECH</p>
          <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">
            ENTERPRISE SOFTWARE &bull; AI SOLUTIONS &bull; CLOUD APPLICATIONS
          </p>
        </div>
      </div>

      {/* Edit/Add Modal for editors */}
      {isModalOpen && permission === 'EDIT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-5 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12151C] border border-[#232B3A] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">

            <div className="px-6 py-4 border-b border-[#1E2532] flex justify-between items-center flex-shrink-0">
              <h2 className="text-base font-bold text-white">{isEditMode ? 'Edit Expense' : 'Add Expense'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-5 sm:p-6 overflow-y-auto">
              {formError && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /><p>{formError}</p>
                </div>
              )}
              <form id="shared-expense-form" onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Name</label>
                  <input type="text" name="expense_name" required value={formData.expense_name} onChange={(e) => setFormData(p => ({ ...p, expense_name: e.target.value }))} className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm" placeholder="e.g. Travel" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                      <input type="number" step="0.01" min="0.01" name="amount" required value={formData.amount} onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))} className="w-full pl-8 pr-2.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm font-bold" placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select name="category" required value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm">
                      {categories.map(c => <option key={c} value={c} className="bg-[#12151C]">{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                    <input type="time" required value={formData.time} onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))} className="w-full px-3 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Purpose</label>
                  <input type="text" required value={formData.purpose} onChange={(e) => setFormData(p => ({ ...p, purpose: e.target.value }))} className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm" placeholder="Why was this spent?" />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-[#1E2532] bg-[#0E1117] flex justify-end space-x-2.5 flex-shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-slate-400 text-xs font-semibold hover:bg-[#1A202C] rounded-xl">Cancel</button>
              <button type="submit" form="shared-expense-form" disabled={saving} className="px-5 py-2.5 gold-gradient-bg text-slate-950 text-xs font-black rounded-xl hover:opacity-90 flex items-center min-w-[110px] justify-center shadow-md">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditMode ? 'Save Changes' : 'Record Expense')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedView;
