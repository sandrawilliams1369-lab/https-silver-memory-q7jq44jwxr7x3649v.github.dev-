
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Metrics } from '../types';

interface Props {
  metrics: Metrics;
}

const Dashboard: React.FC<Props> = ({ metrics }) => {
  const chartData = useMemo(() => {
    // Generate some historical-looking data for visualization
    return Array.from({ length: 20 }).map((_, i) => ({
      time: i,
      cpu: Math.max(10, metrics.cpu_usage + (Math.random() - 0.5) * 15),
      mem: Math.max(10, metrics.memory_usage + (Math.random() - 0.5) * 5),
    }));
  }, [metrics.cpu_usage, metrics.memory_usage]);

  const StatCard = ({ title, value, unit, icon, trend }: { title: string, value: string | number, unit?: string, icon: string, trend?: string }) => (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        {unit && <span className="text-slate-500 text-sm font-medium">{unit}</span>}
      </div>
      {trend && (
        <div className={`mt-2 text-[10px] font-bold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend} from last interval
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Players" value={metrics.active_players} icon="👥" trend="+2.4%" />
        <StatCard title="CPU Load" value={metrics.cpu_usage.toFixed(1)} unit="%" icon="⚡" trend="-0.5%" />
        <StatCard title="Memory" value={metrics.memory_usage.toFixed(1)} unit="%" icon="🧠" trend="+1.2%" />
        <StatCard title="Total VM Ops" value={metrics.agent_actions} icon="🚀" trend="+12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Real-time CPU/Mem Load</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#6366f1" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                <Area type="monotone" dataKey="mem" stroke="#ec4899" fillOpacity={1} fill="url(#colorMem)" name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Block Transformation Rate</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                   cursor={{ fill: '#1e293b' }}
                />
                <Bar dataKey="cpu" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cpu > 70 ? '#f43f5e' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
