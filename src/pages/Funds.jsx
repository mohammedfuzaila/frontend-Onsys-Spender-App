import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { OnSysIcon } from '../components/OnSysLogo';
import {
  Plus, Calendar, Landmark, FileText, IndianRupee, Loader2,
  AlertCircle, Trash2, ArrowDownToLine, Edit2
} from 'lucide-react';
import { format } from 'date-fns';
import BottomSheet from '../components/BottomSheet';

const Funds = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFund, setCurrentFund] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fundToDelete, setFundToDelete] = useState(null);

  const initialFormState = {
    amount: '',
    source: 'OnSys Infotech',
    note: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const response = await api.get('/funds/');
      setFunds(response.data);
    } catch (err) {
      console.error('Failed to fetch funds', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (fund = null) => {
    if (fund) {
      setIsEditMode(true);
      setCurrentFund(fund);
      setFormData({
        amount: fund.amount,
        source: fund.source,
        note: fund.note || '',
        date: fund.date,
      });
    } else {
      setIsEditMode(false);
      setCurrentFund(null);
      setFormData(initialFormState);
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        await api.put(`/funds/${currentFund.id}/`, formData);
      } else {
        await api.post('/funds/', formData);
      }
      handleCloseModal();
      fetchFunds();
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.amount?.[0] || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (fund) => {
    setFundToDelete(fund);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!fundToDelete) return;
    setSaving(true);
    try {
      await api.delete(`/funds/${fundToDelete.id}/`);
      setIsDeleteModalOpen(false);
      setFundToDelete(null);
      fetchFunds();
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setSaving(false);
    }
  };

  const totalReceived = funds.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-5 fade-in w-full max-w-full overflow-hidden">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Inflow Ledger</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Funds Received</h1>
          <p className="text-xs text-slate-400 mt-0.5">Money allocated by company for daily operations</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-1.5 bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-md text-xs w-full sm:w-auto active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Funds</span>
        </button>
      </div>

      {/* Hero Summary Card */}
      <div className="bg-gradient-to-br from-[#1A202C] via-[#141824] to-[#0D1017] p-5 sm:p-7 rounded-3xl border border-[#232B3A] shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="flex items-center space-x-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1 relative z-10">
          <OnSysIcon className="w-4 h-4" />
          <span>Total Company Inflow</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white relative z-10 tracking-tight">
          ₹{totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </h2>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 relative z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{funds.length} total deposit allocation{funds.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Funds Feed List */}
      <div className="rounded-2xl bg-[#12151C] border border-[#1E2532] overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-amber-500" /></div>
        ) : funds.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-[#1A202C] rounded-2xl flex items-center justify-center mx-auto mb-2.5 text-slate-500">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">No funds added yet</h3>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Add money received from OnSys Infotech to track expenses.</p>
            <button onClick={() => handleOpenModal()} className="text-xs font-bold text-amber-400 hover:underline">
              + Record First Fund Allocation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1A202C]">
            {funds.map((fund) => (
              <div key={fund.id} className="p-4 flex items-center justify-between hover:bg-[#151922] transition-colors group">
                <div className="flex items-center space-x-3.5 overflow-hidden pr-3">
                  <div className="w-9 h-9 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-xs sm:text-sm truncate">{fund.source}</p>
                    {fund.note && <p className="text-[11px] text-slate-400 truncate mt-0.5">{fund.note}</p>}
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {format(new Date(fund.date), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-400">
                    +₹{parseFloat(fund.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenModal(fund)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 bg-[#171C26] rounded-lg"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => confirmDelete(fund)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 bg-[#171C26] rounded-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Fund Bottom Sheet */}
      <BottomSheet
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? 'Edit Fund Entry' : 'Add Funds Received'}
        maxWidth="max-w-md"
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
              form="fund-form"
              disabled={saving}
              className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 flex items-center min-w-[120px] justify-center shadow-sm active:scale-95 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditMode ? 'Save Changes' : 'Record Funds')}
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
        <form id="fund-form" onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                required
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full pl-9 pr-3.5 py-3 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-base font-bold"
                placeholder="5000.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Source / Company</label>
            <input
              type="text"
              name="source"
              required
              value={formData.source}
              onChange={handleInputChange}
              className="w-full px-3.5 py-3 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm"
              placeholder="OnSys Infotech"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3.5 py-3 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Note (Optional)</label>
            <textarea
              name="note"
              rows="2"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white resize-none text-sm"
              placeholder="e.g. Monthly daily expenses allowance"
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
            <h3 className="text-sm font-bold text-white mb-1">Delete Fund Entry?</h3>
            <p className="text-slate-400 text-xs mb-4">
              Remove <span className="font-bold text-white">₹{fundToDelete?.amount}</span> from <span className="font-bold text-white">{fundToDelete?.source}</span>?
            </p>
            <div className="flex space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 bg-[#1A202C] text-slate-300 text-xs font-semibold rounded-xl hover:bg-[#252E40]">Cancel</button>
              <button onClick={handleDelete} disabled={saving} className="flex-1 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 flex justify-center items-center shadow-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funds;
