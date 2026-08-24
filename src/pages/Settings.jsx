import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { OnSysIcon, OnSysLogo } from '../components/OnSysLogo';
import { 
  User, 
  Lock, 
  Moon, 
  Sun, 
  Laptop, 
  LogOut, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  Download,
  Building,
  Info
} from 'lucide-react';

const Settings = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState({ username: 'ONITSPENDS', email: 'ONITSPENDS@example.com' });
  
  // Change password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/accounts/profile/');
      setProfile(res.data);
    } catch (err) {
      console.log('Profile fetch err', err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.post('/accounts/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });
      setPasswordMsg({ type: 'success', text: res.data.detail || 'Password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to update password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleExportData = async () => {
    try {
      const [fundsRes, expRes] = await Promise.all([
        api.get('/funds/'),
        api.get('/expenses/')
      ]);
      const data = {
        exported_at: new Date().toISOString(),
        company: 'OnSys Infotech',
        funds: fundsRes.data,
        expenses: expRes.data
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `OnSys_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Could not export backup data.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 fade-in max-w-3xl">
      {/* Header Card with Company Info */}
      <div className="p-5 rounded-2xl bg-[#12151C] border border-[#1E2532] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Account Center</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage identity, security, and exports</p>
        </div>
        <OnSysIcon className="w-10 h-10 flex-shrink-0" />
      </div>

      {/* Profile Section */}
      <div className="p-5 rounded-2xl bg-[#12151C] border border-[#1E2532] space-y-3">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1E2532]">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Account Identity</h2>
            <p className="text-[10px] text-slate-400">Authenticated user details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-[#171C26] border border-[#262D3B] rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Username</span>
            <p className="text-xs sm:text-sm font-bold text-white">{profile.username || 'ONITSPENDS'}</p>
          </div>
          <div className="p-3 bg-[#171C26] border border-[#262D3B] rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Organization</span>
            <p className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> OnSys Infotech
            </p>
          </div>
        </div>
      </div>

      {/* Security Section: Change Password */}
      <div className="p-5 rounded-2xl bg-[#12151C] border border-[#1E2532] space-y-3">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1E2532]">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Security &amp; Password</h2>
            <p className="text-[10px] text-slate-400">Update your access password</p>
          </div>
        </div>

        {passwordMsg.text && (
          <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${passwordMsg.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
            {passwordMsg.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
            <input 
              type="password" 
              required 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm"
              placeholder="Enter current password"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input 
                type="password" 
                required 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm"
                placeholder="Repeat new password"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={savingPassword}
            className="px-4 py-2.5 gold-gradient-bg text-slate-950 text-xs font-black rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          >
            {savingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
            <span>Save New Password</span>
          </button>
        </form>
      </div>

      {/* Data Backup & Export */}
      <div className="p-5 rounded-2xl bg-[#12151C] border border-[#1E2532] space-y-3">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#1E2532]">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Data Backup</h2>
            <p className="text-[10px] text-slate-400">Export complete financial database to JSON</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
          <div>
            <p className="text-xs sm:text-sm font-bold text-white">Full Financial Ledger Export</p>
            <p className="text-[10px] text-slate-400">Includes all funds received and expense transaction logs.</p>
          </div>
          <button 
            type="button" 
            onClick={handleExportData}
            className="px-3.5 py-2 bg-[#171C26] hover:bg-[#252E40] border border-[#262D3B] text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Backup</span>
          </button>
        </div>
      </div>

      {/* Organization Footer Info */}
      <div className="p-4 rounded-2xl bg-[#0E1117] border border-[#1E2532] text-center space-y-1">
        <p className="text-xs font-extrabold tracking-wider text-white">ONSYS INFOTECH</p>
        <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">
          ENTERPRISE SOFTWARE &bull; AI SOLUTIONS &bull; CLOUD APPLICATIONS
        </p>
      </div>

      {/* Logout Session */}
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-rose-400">Sign Out of Session</h3>
          <p className="text-[10px] text-slate-400">Securely sign out of OnSys Spender on this device</p>
        </div>
        <button 
          onClick={logout}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
