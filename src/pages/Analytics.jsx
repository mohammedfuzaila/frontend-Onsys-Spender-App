import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { OnSysIcon } from '../components/OnSysLogo';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { TrendingDown, TrendingUp, Loader2, PieChart as PieIcon, BarChart3, LineChart as LineIcon, Wallet, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

const COLORS = ['#F59E0B', '#D97706', '#E2E8F0', '#10B981', '#F43F5E', '#8B5CF6', '#38BDF8', '#F97316', '#64748B'];

const Analytics = () => {
  const [analytics, setAnalytics] = useState({ categories: [], spending_over_time: [] });
  const [summary, setSummary] = useState({ total_received: 0, total_spent: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aRes, sRes] = await Promise.all([
          api.get('/dashboard/analytics/'),
          api.get('/dashboard/summary/')
        ]);
        setAnalytics(aRes.data);
        setSummary(sRes.data);
      } catch (err) {
        console.error('Analytics fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const spentPercent = summary.total_received > 0
    ? Math.round((summary.total_spent / summary.total_received) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
      </div>
    );
  }

  const hasData = analytics.spending_over_time?.length > 0 || analytics.categories?.length > 0;

  return (
    <div className="space-y-4 sm:space-y-5 fade-in w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532]">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">
          <OnSysIcon className="w-3.5 h-3.5" />
          <span>Analytics Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Spending Analytics</h1>
        <p className="text-xs text-slate-400 mt-0.5">Visual insights &amp; budget utilization</p>
      </div>

      {!hasData ? (
        <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#1E2532]">
          <div className="w-12 h-12 bg-[#1A202C] rounded-2xl flex items-center justify-center mx-auto mb-2.5 text-slate-500">
            <TrendingDown className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">No analytics data yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Add funds received and log expenses to view automated spending graphs.</p>
        </div>
      ) : (
        <>
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#12151C] border border-[#1E2532]">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Received</span>
              <h4 className="text-xs sm:text-base font-extrabold text-emerald-400">₹{parseFloat(summary.total_received || 0).toLocaleString('en-IN')}</h4>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#12151C] border border-[#1E2532]">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Spent</span>
              <h4 className="text-xs sm:text-base font-extrabold text-rose-400">₹{parseFloat(summary.total_spent || 0).toLocaleString('en-IN')}</h4>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#12151C] border border-[#1E2532]">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Remaining</span>
              <h4 className="text-xs sm:text-base font-extrabold text-amber-400">₹{parseFloat(summary.balance || 0).toLocaleString('en-IN')}</h4>
            </div>
          </div>

          {/* Budget Utilization Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532]">
            <div className="flex justify-between items-start mb-2.5">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Fund Utilization Ratio</h3>
                <p className="text-[10px] text-slate-400">Percentage of received company funds spent</p>
              </div>
              <span className={`text-base sm:text-xl font-black ${spentPercent > 85 ? 'text-rose-400' : spentPercent > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {spentPercent}%
              </span>
            </div>
            <div className="w-full bg-[#1A202C] rounded-full h-3 overflow-hidden p-0.5 border border-[#262D3B]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${spentPercent > 85 ? 'bg-rose-500' : spentPercent > 60 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(spentPercent, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1.5">
              <span>₹0</span>
              <span>₹{parseFloat(summary.total_received).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Spending Over Time Chart */}
          {analytics.spending_over_time?.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532]">
              <div className="flex items-center space-x-2 mb-4">
                <LineIcon className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Spending Timeline</h3>
              </div>
              <div className="h-[220px] sm:h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.spending_over_time} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
                    <defs>
                      <linearGradient id="goldSpendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2532" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#181D27', border: '1px solid #2B3548', borderRadius: '12px', color: '#F1F5F9' }}
                      formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Spent']}
                    />
                    <Area type="monotone" dataKey="total" stroke="#F59E0B" strokeWidth={2.5} fill="url(#goldSpendGradient)" dot={{ r: 3.5, fill: '#F59E0B', strokeWidth: 1.5, stroke: '#12151C' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Category Charts Grid */}
          {analytics.categories?.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Donut Chart */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532]">
                <div className="flex items-center space-x-2 mb-4">
                  <PieIcon className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Category Distribution</h3>
                </div>
                <div className="h-[220px] sm:h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.categories}
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="total"
                        nameKey="category"
                        stroke="none"
                      >
                        {analytics.categories.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#181D27', border: '1px solid #2B3548', borderRadius: '12px', color: '#F1F5F9' }}
                        formatter={(value) => `₹${parseFloat(value).toLocaleString('en-IN')}`}
                      />
                      <Legend iconType="circle" formatter={(value) => <span className="text-slate-300 text-[11px] font-medium">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Horizontal Bar Chart */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C] border border-[#1E2532]">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Ranked Expenses</h3>
                </div>
                <div className="h-[220px] sm:h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.categories} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1E2532" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
                      <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} width={55} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#181D27', border: '1px solid #2B3548', borderRadius: '12px', color: '#F1F5F9' }}
                        formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Total']}
                      />
                      <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                        {analytics.categories.map((_, index) => (
                          <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;
