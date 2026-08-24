import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { OnSysIcon } from '../components/OnSysLogo';
import {
  Plus, Share2, Link2, Eye, Edit3, Trash2, Copy, Ban,
  Clock, CheckCircle, Loader2, AlertCircle, Calendar
} from 'lucide-react';
import { format, addDays } from 'date-fns';

const Shares = () => {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);

  const initialFormState = {
    name: 'OnSys Expense Statement',
    permission: 'VIEW',
    expires_at: format(addDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm"),
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => { fetchShares(); }, []);

  const fetchShares = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shares/');
      setShares(res.data);
    } catch (err) {
      console.error('Failed to fetch shares', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/shares/', {
        ...formData,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
      });
      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchShares();
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create share link');
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (shareId) => {
    try {
      await api.post(`/shares/${shareId}/revoke/`);
      fetchShares();
    } catch (err) {
      console.error('Revoke failed', err);
    }
  };

  const handleDelete = async (shareId) => {
    if (!window.confirm('Permanently delete this share link?')) return;
    try {
      await api.delete(`/shares/${shareId}/`);
      fetchShares();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleCopyLink = (token) => {
    const url = `${window.location.origin}/shared/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(token);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 fade-in w-full max-w-full overflow-hidden">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Share Control</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Report Sharing</h1>
          <p className="text-xs text-slate-400 mt-0.5">Secure live report links for management / accounting</p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); setError(''); }}
          className="flex items-center justify-center space-x-1.5 gold-gradient-bg text-slate-950 font-black px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-xs w-full sm:w-auto active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Generate Share Link</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[#12151C] border border-[#1E2532] overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-amber-500" /></div>
        ) : shares.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-[#1A202C] rounded-2xl flex items-center justify-center mx-auto mb-2.5 text-slate-500">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">No active share links</h3>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Create encrypted share links with View-Only or Editor access.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-xs font-bold text-amber-400 hover:underline">
              + Generate First Share Link
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1A202C]">
            {shares.map((share) => {
              const isActive = share.is_active && !share.revoked_at;
              const isExpired = share.expires_at && new Date(share.expires_at) < new Date();
              const status = !isActive || isExpired ? 'Inactive' : 'Active';
              return (
                <div key={share.id} className="p-4 sm:p-5 hover:bg-[#151922] transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3.5 overflow-hidden">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive && !isExpired ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-[#1A202C] text-slate-500'}`}>
                        {isActive && !isExpired
                          ? <CheckCircle className="w-4 h-4" />
                          : <Ban className="w-4 h-4" />
                        }
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-xs sm:text-sm">{share.name}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${share.permission === 'EDIT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                            {share.permission === 'EDIT' ? <Edit3 className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                            {share.permission === 'EDIT' ? 'Can Edit' : 'View Only'}
                          </span>
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold ${status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                            {status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            Created {format(new Date(share.created_at), 'dd MMM yyyy')}
                          </span>
                          {share.expires_at && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              Expires {format(new Date(share.expires_at), 'dd MMM, HH:mm')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 overflow-hidden">
                          <Link2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
                          <code className="text-[10px] text-slate-400 bg-[#181D27] px-2 py-0.5 rounded font-mono truncate max-w-xs sm:max-w-md">
                            /shared/{share.token_hash}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-2 md:pt-0">
                      <button
                        onClick={() => handleCopyLink(share.token_hash)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1C2330] border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl hover:bg-[#252E40] transition-colors"
                      >
                        {copied === share.token_hash ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied === share.token_hash ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                      {isActive && !isExpired && (
                        <button
                          onClick={() => handleRevoke(share.id)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-xl hover:bg-amber-500/20 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Revoke</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(share.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-xl hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Share Modal / Bottom Sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-[#232B3A] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden bottom-sheet">
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mt-3 sm:hidden"></div>

            <div className="px-6 py-4 border-b border-[#1E2532] flex justify-between items-center">
              <h2 className="text-base font-bold text-white">Create Secure Share Link</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-5 sm:p-6">
              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2.5 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /><p>{error}</p>
                </div>
              )}
              <form id="share-form" onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Share Name</label>
                  <input type="text" name="name" required value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm"
                    placeholder="e.g. August Daily Expense Audit"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Access Permission</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <label className={`flex flex-col p-3 rounded-xl cursor-pointer transition-all ${formData.permission === 'VIEW' ? 'border-2 border-amber-500 bg-amber-500/10' : 'border border-[#262D3B] bg-[#171C26]'}`}>
                      <input type="radio" name="permission" value="VIEW" className="sr-only" checked={formData.permission === 'VIEW'} onChange={(e) => setFormData(p => ({ ...p, permission: e.target.value }))} />
                      <Eye className={`w-4 h-4 mb-1 ${formData.permission === 'VIEW' ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className={`font-bold text-xs ${formData.permission === 'VIEW' ? 'text-amber-400' : 'text-white'}`}>View Only</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Read-only live reports</span>
                    </label>
                    <label className={`flex flex-col p-3 rounded-xl cursor-pointer transition-all ${formData.permission === 'EDIT' ? 'border-2 border-amber-500 bg-amber-500/10' : 'border border-[#262D3B] bg-[#171C26]'}`}>
                      <input type="radio" name="permission" value="EDIT" className="sr-only" checked={formData.permission === 'EDIT'} onChange={(e) => setFormData(p => ({ ...p, permission: e.target.value }))} />
                      <Edit3 className={`w-4 h-4 mb-1 ${formData.permission === 'EDIT' ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className={`font-bold text-xs ${formData.permission === 'EDIT' ? 'text-amber-400' : 'text-white'}`}>Can Edit</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Recipient can log expenses</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expires At (Optional)</label>
                  <input type="datetime-local" name="expires_at" value={formData.expires_at}
                    onChange={(e) => setFormData(p => ({ ...p, expires_at: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs"
                  />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-[#1E2532] bg-[#0E1117] flex justify-end space-x-2.5">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-slate-400 text-xs font-semibold hover:bg-[#1A202C] rounded-xl">Cancel</button>
              <button type="submit" form="share-form" disabled={saving}
                className="px-5 py-2.5 gold-gradient-bg text-slate-950 text-xs font-black rounded-xl hover:opacity-90 flex items-center min-w-[120px] justify-center shadow-md">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shares;
