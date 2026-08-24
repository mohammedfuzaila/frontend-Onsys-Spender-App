import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OnSysLogoFull } from '../components/OnSysLogo';
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, User } from 'lucide-react';
import { wakeupBackend } from '../utils/wakeup';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('waking'); // 'waking' | 'ready' | 'slow'
  const { login } = useAuth();
  const navigate = useNavigate();

  // Kick off backend wakeup the moment the login screen appears.
  // Render free-tier cold starts take ~30-60 s; firing this early gives
  // maximum lead time before the user presses Sign In.
  useEffect(() => {
    let cancelled = false;
    setServerStatus('waking');

    wakeupBackend().then(() => {
      if (!cancelled) setServerStatus('ready');
    });

    // After 15 s show a friendlier "still warming up" hint
    const slowTimer = setTimeout(() => {
      if (!cancelled) setServerStatus((prev) => (prev === 'waking' ? 'slow' : prev));
    }, 15000);

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
    };
  }, []);

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

  const statusConfig = {
    waking: { dot: 'bg-amber-400 animate-pulse', text: 'Connecting to server…',        cls: 'text-amber-400/80' },
    slow:   { dot: 'bg-amber-500 animate-pulse', text: 'Server warming up, please wait…', cls: 'text-amber-500/90' },
    ready:  { dot: 'bg-emerald-400',              text: 'Server ready',                 cls: 'text-emerald-400'   },
  };
  const s = statusConfig[serverStatus] ?? statusConfig.waking;

  return (
    <div className="min-h-screen w-full max-w-full overflow-hidden flex flex-col justify-center items-center bg-[#090B0F] px-4 py-8 relative antialiased select-none">
      {/* Ambient gold glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[35%] right-[25%] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-6 sm:p-9 bg-[#11141C]/95 backdrop-blur-2xl border border-[#222938] rounded-3xl shadow-2xl z-10 fade-in">

        {/* Branded header */}
        <div className="flex flex-col items-center text-center mb-6">
          <OnSysLogoFull />
        </div>

        {/* Server status pill */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
          <span className={`text-[10px] font-semibold tracking-widest uppercase ${s.cls}`}>
            {s.text}
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs sm:text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
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
              className="w-full py-3.5 px-4 gold-gradient-bg text-slate-950 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/20 hover:opacity-95 flex items-center justify-center active:scale-[0.99] disabled:opacity-70"
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
