import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { OnSysIcon } from '../components/OnSysLogo';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Wallet, 
  Activity,
  Plus,
  Download,
  Receipt,
  Calendar,
  IndianRupee,
  Loader2,
  AlertCircle,
  Tag,
  ChevronRight,
  TrendingUp,
  Share2,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    total_received: 0,
    total_spent: 0,
    balance: 0,
    transaction_count: 0
  });
  const [analytics, setAnalytics] = useState({
    categories: [],
    spending_over_time: []
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentFunds, setRecentFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Action Modals
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Forms
  const [fundForm, setFundForm] = useState({
    amount: '',
    source: 'OnSys Infotech',
    note: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const [expenseForm, setExpenseForm] = useState({
    expense_name: '',
    amount: '',
    category: 'Food',
    purpose: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm')
  });

  const categories = ['Food', 'Lunch', 'Snacks', 'Tea / Coffee', 'Travel', 'Office', 'Shopping', 'Entertainment', 'Other'];
  // OnSys Infotech color palette for charts (Gold, Amber, Silver, Emerald, Bronze)
  const COLORS = ['#F59E0B', '#D97706', '#E2E8F0', '#10B981', '#F43F5E', '#8B5CF6', '#38BDF8', '#F97316', '#64748B'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, analyticsRes, expensesRes, fundsRes] = await Promise.all([
        api.get('/dashboard/summary/'),
        api.get('/dashboard/analytics/'),
        api.get('/expenses/'),
        api.get('/funds/')
      ]);
      setSummary(summaryRes.data);
      setAnalytics(analyticsRes.data);
      setRecentExpenses(expensesRes.data.slice(0, 6));
      setRecentFunds(fundsRes.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFund = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError('');
    try {
      await api.post('/funds/', fundForm);
      setIsFundModalOpen(false);
      setFundForm({ amount: '', source: 'OnSys Infotech', note: '', date: format(new Date(), 'yyyy-MM-dd') });
      await fetchDashboardData();
    } catch (err) {
      setModalError(err.response?.data?.detail || err.response?.data?.amount?.[0] || 'Failed to add funds.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError('');
    try {
      await api.post('/expenses/', expenseForm);
      setIsExpenseModalOpen(false);
      setExpenseForm({
        expense_name: '',
        amount: '',
        category: 'Food',
        purpose: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm')
      });
      await fetchDashboardData();
    } catch (err) {
      setModalError(err.response?.data?.detail || err.response?.data?.amount?.[0] || 'Failed to record expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Date,Name/Source,Category,Purpose,Amount (INR)\n";
    
    recentFunds.forEach(f => {
      csvContent += `Fund,${f.date},"${f.source}","--","${f.note || ''}",${f.amount}\n`;
    });
    recentExpenses.forEach(e => {
      csvContent += `Expense,${e.date},"${e.expense_name}","${e.category}","${e.purpose}",-${e.amount}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OnSys_Spender_Report_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-44 rounded-3xl bg-[#141822] border border-[#1E2532]"></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-28 rounded-2xl bg-[#141822] border border-[#1E2532]"></div>
          <div className="h-28 rounded-2xl bg-[#141822] border border-[#1E2532]"></div>
        </div>
        <div className="h-64 rounded-2xl bg-[#141822] border border-[#1E2532]"></div>
      </div>
    );
  }

  const combinedTransactions = [
    ...recentFunds.map(f => ({ ...f, type: 'fund' })),
    ...recentExpenses.map(e => ({ ...e, type: 'expense' }))
  ].sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at)).slice(0, 6);

  return (
    <div className="space-y-4 sm:space-y-5 fade-in relative w-full max-w-full overflow-hidden">
      {/* Native App Main Card: Available Balance */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#181D27] via-[#121620] to-[#0D1016] border border-amber-500/30 p-5 sm:p-7 shadow-2xl gold-glow">
        {/* Decorative ambient gold glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <OnSysIcon className="w-5 h-5" />
              <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">OnSys Wallet</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-[#202736] border border-[#2D384D] text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Active Account</span>
            </div>
          </div>

          <div className="my-5">
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Remaining Balance</p>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">₹</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {parseFloat(summary.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
            </div>
          </div>

          {/* Quick Action Buttons (Native App Pill Grid) */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#232B3A]">
            <button
              onClick={() => { setModalError(''); setIsFundModalOpen(true); }}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#1D2433] hover:bg-[#252E40] border border-[#2E394E] active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1">
                <ArrowDownToLine className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-200">Add Funds</span>
            </button>

            <button
              onClick={() => { setModalError(''); setIsExpenseModalOpen(true); }}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl gold-gradient-bg text-slate-950 font-bold active:scale-95 transition-all shadow-md shadow-amber-500/20"
            >
              <div className="w-8 h-8 rounded-full bg-slate-950/20 text-slate-950 flex items-center justify-center mb-1">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider">Add Expense</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#1D2433] hover:bg-[#252E40] border border-[#2E394E] active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
                <Download className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-200">Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Stats Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Received */}
        <div 
          onClick={() => navigate('/funds')}
          className="p-4 rounded-2xl bg-[#12151C] border border-[#1E2532] hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Received</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ArrowDownToLine className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-white">
            ₹{parseFloat(summary.total_received || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
            <span>Company Funds</span>
            <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Spent */}
        <div 
          onClick={() => navigate('/expenses')}
          className="p-4 rounded-2xl bg-[#12151C] border border-[#1E2532] hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spent</span>
            <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <ArrowUpFromLine className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-white">
            ₹{parseFloat(summary.total_spent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-rose-400 font-semibold mt-1 flex items-center gap-0.5">
            <span>Daily Outflow</span>
            <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Transactions Count */}
        <div 
          onClick={() => navigate('/expenses')}
          className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#12151C] border border-[#1E2532] hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transactions</span>
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-white">{summary.transaction_count || 0}</p>
          <p className="text-[10px] text-amber-400 font-semibold mt-1 flex items-center gap-0.5">
            <span>All Logs</span>
            <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spending Timeline */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Spending Timeline</h3>
              <p className="text-[10px] text-slate-400">Daily spending trend</p>
            </div>
            <button onClick={() => navigate('/analytics')} className="text-[11px] font-bold text-amber-400 hover:underline">
              Analytics &rarr;
            </button>
          </div>
          <div className="h-[200px] sm:h-[240px] w-full">
            {analytics.spending_over_time?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.spending_over_time} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2532" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#181D27', border: '1px solid #2B3548', borderRadius: '12px', color: '#F1F5F9' }}
                    formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Spent']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#F59E0B" 
                    strokeWidth={2.5} 
                    dot={{ r: 3.5, fill: '#F59E0B', strokeWidth: 1.5, stroke: '#12151C' }} 
                    activeDot={{ r: 5.5, strokeWidth: 0, fill: '#FBBF24' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                <Receipt className="w-7 h-7 text-slate-600 mb-1.5" />
                <span>No expense data yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Top Categories</h3>
              <p className="text-[10px] text-slate-400">Distribution of daily expenses</p>
            </div>
            <button onClick={() => navigate('/analytics')} className="text-[11px] font-bold text-amber-400 hover:underline">
              View All &rarr;
            </button>
          </div>
          <div className="h-[200px] sm:h-[240px] w-full">
            {analytics.categories?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categories}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="total"
                    nameKey="category"
                    stroke="none"
                  >
                    {analytics.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#181D27', border: '1px solid #2B3548', borderRadius: '12px', color: '#F1F5F9' }}
                    formatter={(value) => `₹${parseFloat(value).toLocaleString('en-IN')}`}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={30} 
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-300 text-[11px] font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                <Tag className="w-7 h-7 text-slate-600 mb-1.5" />
                <span>No category data yet</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity List (App Style) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532]">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Recent Activity</h3>
            <p className="text-[10px] text-slate-400">Latest funds and daily expenditures</p>
          </div>
          <button onClick={() => navigate('/expenses')} className="text-xs font-bold text-amber-400 hover:underline">
            View All &rarr;
          </button>
        </div>

        {combinedTransactions.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">No activity recorded yet</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Click "+ Add Funds" to add money received from OnSys Infotech.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1A202C]">
            {combinedTransactions.map((tx, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between hover:bg-[#161B24] rounded-xl px-2 -mx-2 transition-colors">
                <div className="flex items-center space-x-3 overflow-hidden pr-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === 'fund' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                    {tx.type === 'fund' ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-xs truncate">
                      {tx.type === 'fund' ? tx.source : tx.expense_name}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                      <span>{format(new Date(tx.date), 'dd MMM')}</span>
                      {tx.category && <span className="px-1.5 py-0.2 bg-[#1E2532] text-amber-400/90 rounded text-[9px] font-semibold">{tx.category}</span>}
                      {tx.purpose && <span className="truncate">&middot; {tx.purpose}</span>}
                    </p>
                  </div>
                </div>
                <span className={`font-black text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${tx.type === 'fund' ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {tx.type === 'fund' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) for Mobile App - Gold OnSys style */}
      <button 
        onClick={() => { setModalError(''); setIsExpenseModalOpen(true); }}
        className="md:hidden fixed bottom-20 right-5 z-20 w-13 h-13 gold-gradient-bg text-slate-950 rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Quick Add Expense"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Add Funds Modal / Bottom Sheet */}
      {isFundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-[#232B3A] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden bottom-sheet">
            {/* Drag handle for mobile */}
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mt-3 sm:hidden"></div>

            <div className="px-6 py-4 border-b border-[#1E2532] flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white">Add Funds Received</h2>
                <p className="text-[11px] text-amber-400 font-medium">Record money provided by company</p>
              </div>
              <button onClick={() => setIsFundModalOpen(false)} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-5 sm:p-6">
              {modalError && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2.5 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{modalError}</p>
                </div>
              )}
              <form id="dash-fund-form" onSubmit={handleAddFund} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0.01" 
                      required 
                      value={fundForm.amount} 
                      onChange={(e) => setFundForm(p => ({ ...p, amount: e.target.value }))}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-base font-bold"
                      placeholder="5000.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Source / Company</label>
                  <input 
                    type="text" 
                    required 
                    value={fundForm.source} 
                    onChange={(e) => setFundForm(p => ({ ...p, source: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm"
                    placeholder="OnSys Infotech"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={fundForm.date} 
                    onChange={(e) => setFundForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Note (Optional)</label>
                  <textarea 
                    rows="2" 
                    value={fundForm.note} 
                    onChange={(e) => setFundForm(p => ({ ...p, note: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white resize-none text-xs"
                    placeholder="e.g. Monthly daily expenses allowance"
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-[#1E2532] bg-[#0E1117] flex justify-end space-x-2.5">
              <button type="button" onClick={() => setIsFundModalOpen(false)} className="px-4 py-2.5 text-slate-400 text-xs font-semibold hover:bg-[#1A202C] rounded-xl">Cancel</button>
              <button type="submit" form="dash-fund-form" disabled={saving} className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 flex items-center min-w-[110px] justify-center shadow-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Record Funds'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal / Bottom Sheet */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-[#232B3A] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden bottom-sheet flex flex-col max-h-[90vh]">
            {/* Drag handle for mobile */}
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mt-3 sm:hidden"></div>

            <div className="px-6 py-4 border-b border-[#1E2532] flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-white">Add New Expense</h2>
                <p className="text-[11px] text-amber-400 font-medium">Record snacks, lunch, travel, etc.</p>
              </div>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-5 sm:p-6 overflow-y-auto">
              {modalError && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2.5 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{modalError}</p>
                </div>
              )}
              <form id="dash-expense-form" onSubmit={handleAddExpense} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Name</label>
                  <input 
                    type="text" 
                    required 
                    value={expenseForm.expense_name} 
                    onChange={(e) => setExpenseForm(p => ({ ...p, expense_name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm"
                    placeholder="e.g. Team Lunch"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0.01" 
                        required 
                        value={expenseForm.amount} 
                        onChange={(e) => setExpenseForm(p => ({ ...p, amount: e.target.value }))}
                        className="w-full pl-8 pr-2.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm font-bold"
                        placeholder="150.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select 
                      value={expenseForm.category} 
                      onChange={(e) => setExpenseForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm"
                    >
                      {categories.map(c => <option key={c} value={c} className="bg-[#12151C]">{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={expenseForm.date} 
                      onChange={(e) => setExpenseForm(p => ({ ...p, date: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                    <input 
                      type="time" 
                      required 
                      value={expenseForm.time} 
                      onChange={(e) => setExpenseForm(p => ({ ...p, time: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Purpose</label>
                  <input 
                    type="text" 
                    required 
                    value={expenseForm.purpose} 
                    onChange={(e) => setExpenseForm(p => ({ ...p, purpose: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-[#171C26] border border-[#262D3B] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs sm:text-sm"
                    placeholder="e.g. Daily office refreshments"
                  />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-[#1E2532] bg-[#0E1117] flex justify-end space-x-2.5 flex-shrink-0">
              <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-4 py-2.5 text-slate-400 text-xs font-semibold hover:bg-[#1A202C] rounded-xl">Cancel</button>
              <button type="submit" form="dash-expense-form" disabled={saving} className="px-5 py-2.5 gold-gradient-bg text-slate-950 text-xs font-black rounded-xl hover:opacity-90 flex items-center min-w-[120px] justify-center shadow-md">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Record Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
