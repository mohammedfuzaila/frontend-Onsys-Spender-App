import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OnSysLogo, OnSysIcon } from '../components/OnSysLogo';
import { 
  LayoutDashboard, 
  Receipt, 
  Landmark, 
  PieChart, 
  Share2, 
  Settings, 
  LogOut,
  Menu,
  X,
  Plus,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Funds', path: '/funds', icon: Landmark },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Shares', path: '/shares', icon: Share2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const bottomNavItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Funds', path: '/funds', icon: Landmark },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    return current ? current.name : 'OnSys Spender';
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0A0C10] text-slate-100 flex flex-col md:flex-row antialiased select-none">
      {/* Mobile Top App Bar */}
      <header className="md:hidden bg-[#0F1218]/90 backdrop-blur-xl border-b border-[#1E2532] sticky top-0 z-30 px-4 py-3 flex justify-between items-center w-full max-w-full">
        <div className="flex items-center space-x-2.5">
          <OnSysLogo size="sm" subtitle="SPENDER" />
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/settings')}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-400"
          >
            OS
          </button>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white bg-[#171C26] border border-[#262D3B]"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out App Drawer */}
      {isDrawerOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-md transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="absolute top-0 left-0 w-4/5 max-w-[300px] h-full bg-[#0E1117] border-r border-[#1E2532] flex flex-col z-50 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2532]">
              <OnSysLogo size="sm" subtitle="INFOTECH" />
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#151922] border border-[#232B3A] flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center font-bold text-slate-950 text-sm shadow-md">
                OS
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white tracking-tight">ONITSPENDS</p>
                <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">OnSys Private Account</p>
              </div>
            </div>

            {/* Nav list */}
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className={clsx(
                      "flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-xs font-semibold",
                      isActive 
                        ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30" 
                        : "text-slate-400 hover:bg-[#151922] hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={clsx("w-4 h-4", isActive ? "text-amber-400" : "text-slate-400")} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </NavLink>
                );
              })}
            </nav>

            {/* Footer info & Logout */}
            <div className="pt-4 border-t border-[#1E2532] space-y-3">
              <div className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                ENTERPRISE SOFTWARE &bull; AI SOLUTIONS &bull; CLOUD APPLICATIONS
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2.5 px-3 py-2.5 w-full rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-64 fixed h-full flex-col bg-[#0D1016] text-white z-20 border-r border-[#1B212D]">
        <div className="p-6 border-b border-[#1B212D]">
          <OnSysLogo size="md" subtitle="SPENDER APP" />
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={clsx(
                  "flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-xs font-semibold tracking-wide",
                  isActive 
                    ? "bg-gradient-to-r from-amber-500/15 to-transparent text-amber-400 border border-amber-500/30 shadow-sm" 
                    : "text-slate-400 hover:bg-[#141822] hover:text-slate-200"
                )}
              >
                <Icon className={clsx("w-4 h-4", isActive ? "text-amber-400" : "text-slate-500")} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Account Card */}
        <div className="p-4 border-t border-[#1B212D] bg-[#0A0C10]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl gold-gradient-bg flex items-center justify-center text-xs font-extrabold text-slate-950 flex-shrink-0">
                OS
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">ONITSPENDS</p>
                <p className="text-[10px] text-amber-400 font-semibold truncate">OnSys Infotech</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 w-full rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex bg-[#0D1016]/80 backdrop-blur-md border-b border-[#1B212D] h-16 items-center px-8 justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{getPageTitle()}</h2>
            <p className="text-xs text-amber-500/90 font-medium">OnSys Infotech &bull; Daily Expense Management</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Synced</span>
            </div>
            <button 
              onClick={() => navigate('/settings')}
              className="w-9 h-9 gold-gradient-bg rounded-xl flex items-center justify-center text-slate-950 font-black text-xs shadow-md hover:opacity-90 transition-opacity"
            >
              OS
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-28 md:pb-8 max-w-7xl w-full max-w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Native App Floating Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0E1117]/95 backdrop-blur-2xl border-t border-[#1E2532] px-2 py-1.5 shadow-[0_-4px_30px_rgba(0,0,0,0.6)] safe-bottom">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 min-w-[54px]",
                  isActive 
                    ? "text-amber-400 font-bold scale-105" 
                    : "text-slate-400 hover:text-slate-300 font-medium"
                )}
              >
                <div className={clsx(
                  "p-1 rounded-xl mb-0.5 transition-colors",
                  isActive ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : ""
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] tracking-tight">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
