
import React, { useState, useEffect } from 'react';
import { getGeminiInsights } from '../services/geminiService';
import { Metrics, VMInfo } from '../types';

interface Props {
  metrics: Metrics;
  vms: VMInfo[];
}

interface Insight {
  severity: 'low' | 'medium' | 'high';
  title: string;
  advice: string;
  action: string;
}

const GeminiAdvisor: React.FC<Props> = ({ metrics, vms }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await getGeminiInsights(metrics, vms);
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">✨</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Gemini Smart Insights</h2>
          </div>
          <p className="text-indigo-200/70 max-w-2xl mb-6">
            Analyzing production telemetry using Gemini 3 Flash. Our AI model identifies infrastructure bottlenecks, 
            predicts scaling needs, and suggests optimization strategies for your Nanos unikernels.
          </p>
          <button 
            onClick={fetchInsights}
            disabled={loading}
            className="bg-white text-indigo-900 hover:bg-indigo-50 px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-900/30 border-t-indigo-900 rounded-full animate-spin"></div>
                <span>Analyzing Cluster...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Refresh Optimization Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl h-48 animate-pulse">
              <div className="h-4 w-24 bg-slate-800 rounded mb-4"></div>
              <div className="h-6 w-full bg-slate-800 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
            </div>
          ))
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-transform">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    insight.severity === 'high' ? 'bg-rose-500/20 text-rose-400' :
                    insight.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {insight.severity} Priority
                  </span>
                  <span className="text-xl">
                    {insight.severity === 'high' ? '🚨' : insight.severity === 'medium' ? '⚠️' : '✅'}
                  </span>
                </div>
                <h4 className="text-white font-bold mb-2">{insight.title}</h4>
                <p className="text-sm text-slate-400 mb-6">{insight.advice}</p>
              </div>
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-4 rounded-lg transition-colors border border-slate-700">
                {insight.action}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Optimization Context</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">DATA POINTS</span>
            <span className="text-lg font-bold text-slate-300">14,204</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">LATENCY</span>
            <span className="text-lg font-bold text-emerald-400">12ms</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">TRAINING DATE</span>
            <span className="text-lg font-bold text-slate-300">DEC 2025</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">TOKEN USAGE</span>
            <span className="text-lg font-bold text-indigo-400">852</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAdvisor;
