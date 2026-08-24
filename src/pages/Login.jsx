import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OnSysLogo, OnSysIcon } from '../components/OnSysLogo';
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(username, password);
    setIsLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-hidden flex flex-col justify-center items-center bg-[#090B0F] px-4 py-8 relative antialiased select-none">
      {/* Ambient OnSys Gold & Dark Glow */}
      <div className="absolute top-[-15%] left-[-15%] w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute top-[35%] right-[25%] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-6 sm:p-9 bg-[#11141C]/95 backdrop-blur-2xl border border-[#222938] rounded-3xl shadow-2xl z-10 fade-in">
        {/* OnSys Branded Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-[#181D28] rounded-2xl border border-[#2B3548] shadow-lg mb-3">
            <OnSysIcon className="w-12 h-12" />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-black text-2xl sm:text-3xl tracking-wider text-white uppercase font-sans">
              ONSYS
            </span>
            <span className="text-xs font-bold text-amber-400 tracking-[0.3em] uppercase mt-0.5">
              INFOTECH
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-2 font-medium">Spender &bull; Daily Expense Management</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs sm:text-sm animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#262D3B] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-[#171C26] text-white placeholder-slate-500 text-xs sm:text-sm font-medium"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#262D3B] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-[#171C26] text-white placeholder-slate-500 text-xs sm:text-sm font-medium"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 gold-gradient-bg text-slate-950 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/20 hover:opacity-95 flex items-center justify-center active:scale-[0.99]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-5 border-t border-[#1F2633] flex flex-col items-center text-center space-y-1">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>OnSys Infotech Private Enterprise System</span>
          </div>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest pt-1">
            ENTERPRISE SOFTWARE &bull; AI SOLUTIONS &bull; CLOUD APPLICATIONS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
