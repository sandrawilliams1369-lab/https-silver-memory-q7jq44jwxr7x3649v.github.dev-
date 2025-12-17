
import React from 'react';
import { AgentDecision } from '../types';

interface Props {
  history: AgentDecision[];
}

const AgentBill: React.FC<Props> = ({ history }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
      {/* Profile Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-xl shadow-indigo-500/10">
            🤖
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Agent Bill</h2>
          <p className="text-xs text-indigo-400 mono uppercase tracking-widest font-bold mb-4">Embodied AI v2.4</p>
          <div className="flex items-center justify-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1 px-3 rounded-full text-[10px] font-bold w-fit mx-auto mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>THINKING VIA GPT-4</span>
          </div>
          
          <div className="space-y-3 text-left">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Current Goal</span>
              <p className="text-sm text-slate-200">Establish automated wood farm at (X:140, Z:-45)</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">XP Level</span>
                <span className="text-lg font-bold text-indigo-400">42</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Survival</span>
                <span className="text-lg font-bold text-emerald-400">100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600/10 border border-indigo-600/20 p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">Model Config</h4>
          <ul className="space-y-2 text-[11px] mono text-indigo-200/70">
            <li className="flex justify-between"><span>Temperature</span> <span>0.7</span></li>
            <li className="flex justify-between"><span>Top P</span> <span>0.95</span></li>
            <li className="flex justify-between"><span>Max Tokens</span> <span>1024</span></li>
          </ul>
        </div>
      </div>

      {/* Decision Log */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Cognitive Chain of Thought</h3>
          <span className="text-[10px] mono text-slate-500">REAL-TIME TELEMETRY</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl hover:border-indigo-500/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-indigo-500 text-white px-2 py-0.5 rounded text-[10px] font-bold mono uppercase">
                  {item.action}
                </span>
                <span className="text-[10px] mono text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-sm text-slate-400 italic mb-2">"{item.reasoning}"</p>
              {Object.keys(item.params).length > 0 && (
                <div className="bg-slate-900 p-2 rounded text-[10px] mono text-emerald-400">
                  PARAMS: {JSON.stringify(item.params)}
                </div>
              )}
            </div>
          ))}
          {/* Mock live thinking indicator */}
          <div className="flex items-center space-x-3 text-slate-500 italic p-4">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce delay-75"></div>
              <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce delay-150"></div>
            </div>
            <span className="text-xs">Agent is processing next world frame...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentBill;
