
import React, { useState, useRef, useEffect } from 'react';
import { VMInfo } from '../types';

interface Props {
  vms: VMInfo[];
  onDeploy: () => void;
}

const VMManager: React.FC<Props> = ({ vms, onDeploy }) => {
  const [expandedVmId, setExpandedVmId] = useState<number | null>(null);
  const [consoleVmId, setConsoleVmId] = useState<number | null>(null);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: number) => {
    setExpandedVmId(expandedVmId === id ? null : id);
  };

  const openConsole = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setConsoleVmId(id);
    setTerminalInput('');
  };

  const activeVm = vms.find(v => v.vm_id === consoleVmId);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleVmId]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation: Commands are "executed" but only show as typed for now
    if (terminalInput.trim()) {
      setTerminalInput('');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-indigo-500">📦</span>
            Active Nanos Instances
          </h2>
          <p className="text-sm text-slate-400">Manage and monitor isolated unikernel environments.</p>
        </div>
        <button 
          onClick={onDeploy}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <span className="text-lg">+</span>
          <span>Deploy New VM</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-800">
              <th className="px-4 py-4 text-center w-12"></th>
              <th className="px-4 py-4">ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Owner (PID)</th>
              <th className="px-6 py-4">Port</th>
              <th className="px-6 py-4">Uptime</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {vms.map((vm) => {
              const cpuPercent = vm.allocated_cpu > 0 ? (vm.used_cpu / vm.allocated_cpu) * 100 : 0;
              const memPercent = vm.allocated_memory > 0 ? (vm.used_memory / vm.allocated_memory) * 100 : 0;
              
              return (
                <React.Fragment key={vm.vm_id}>
                  <tr 
                    onClick={() => toggleExpand(vm.vm_id)}
                    className={`cursor-pointer transition-colors group ${
                      expandedVmId === vm.vm_id ? 'bg-indigo-500/5' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block transition-transform duration-200 text-[10px] text-slate-500 ${expandedVmId === vm.vm_id ? 'rotate-90 text-indigo-400' : ''}`}>
                        ▶
                      </span>
                    </td>
                    <td className="px-4 py-4 mono font-bold text-slate-300">#{vm.vm_id.toString().padStart(3, '0')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          vm.status === 'running' ? 'bg-emerald-500' : 
                          vm.status === 'failed' ? 'bg-rose-500' : 
                          vm.status === 'provisioning' ? 'bg-indigo-400 animate-ping' : 'bg-slate-500'
                        }`}></span>
                        <span className={`text-[11px] font-bold uppercase tracking-tight ${
                          vm.status === 'running' ? 'text-emerald-400' : 
                          vm.status === 'failed' ? 'text-rose-400' : 
                          vm.status === 'provisioning' ? 'text-indigo-300 italic' : 'text-slate-400'
                        }`}>
                          {vm.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{vm.player_id}</td>
                    <td className="px-6 py-4 text-sm mono text-indigo-400">:{vm.port}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {vm.status === 'provisioning' ? 'Pending...' : `${Math.floor(vm.uptime / 60)}m ${vm.uptime % 60}s`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={(e) => openConsole(e, vm.vm_id)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all group-hover:opacity-100 opacity-0 md:opacity-100 border border-slate-700/50" 
                          title="Console"
                        >
                          🐚
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-slate-800 hover:bg-rose-900/40 rounded-lg text-slate-400 hover:text-rose-400 transition-all group-hover:opacity-100 opacity-0 md:opacity-100 border border-slate-700/50" 
                          title="Terminate"
                        >
                          🛑
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Section */}
                  {expandedVmId === vm.vm_id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 bg-slate-950/50 border-y border-indigo-500/20 shadow-inner">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          {/* Column 1: Resource Stats & Actions */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                                Real-time Resource Utilization
                              </h4>
                              <div className="space-y-5">
                                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                  <div className="flex justify-between text-[11px] mb-2">
                                    <span className="text-slate-400 font-medium">CPU Load</span>
                                    <span className="text-white font-bold mono">
                                      {vm.used_cpu.toFixed(2)} / {vm.allocated_cpu} Cores ({cpuPercent.toFixed(1)}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-700 ease-out ${cpuPercent > 80 ? 'bg-rose-500' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]'}`}
                                      style={{ width: `${cpuPercent}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                  <div className="flex justify-between text-[11px] mb-2">
                                    <span className="text-slate-400 font-medium">Memory Footprint</span>
                                    <span className="text-white font-bold mono">
                                      {vm.used_memory} / {vm.allocated_memory} MB ({memPercent.toFixed(1)}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-700 ease-out ${memPercent > 80 ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`}
                                      style={{ width: `${memPercent}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3">
                              <button className="text-[10px] font-bold bg-slate-900 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 py-3 rounded-xl transition-all uppercase tracking-wider active:scale-95">
                                Reboot
                              </button>
                              <button className="text-[10px] font-bold bg-slate-900 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl transition-all uppercase tracking-wider active:scale-95">
                                Snapshot
                              </button>
                              <button 
                                onClick={(e) => openConsole(e, vm.vm_id)}
                                className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 active:scale-95"
                              >
                                <span>🐚</span>
                                <span>Console</span>
                              </button>
                            </div>
                          </div>

                          {/* Column 2: Logs & System Information */}
                          <div className="flex flex-col h-full space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0 flex items-center gap-2">
                              <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                              System Runtime Logs
                            </h4>
                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex-1 min-h-[160px] max-h-[160px] overflow-y-auto mono text-[10px] custom-scrollbar">
                              {vm.recent_logs.map((log, lidx) => (
                                <div key={lidx} className="mb-1.5 flex gap-3 text-slate-400 group">
                                  <span className="text-slate-600 font-bold opacity-50 select-none">{new Date().toLocaleTimeString([], {hour12: false})}</span>
                                  <span className="text-indigo-300/80 font-semibold select-none">[SYS]</span>
                                  <span className="group-hover:text-slate-200 transition-colors">{log}</span>
                                </div>
                              ))}
                              <div className="text-indigo-400 animate-pulse mt-2 flex items-center gap-2">
                                <span className="w-1 h-3 bg-indigo-500"></span>
                                Streaming telemetry...
                              </div>
                            </div>
                            <div className="flex justify-between items-center px-1">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[9px] text-slate-500 mono uppercase tracking-tighter">WS Socket 0x{vm.port.toString(16).toUpperCase()} Active</span>
                              </div>
                              <button className="text-[10px] text-slate-500 hover:text-indigo-400 font-bold transition-colors flex items-center space-x-1 uppercase tracking-tight">
                                <span>📄</span>
                                <span>Full Config</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-[9px] mono text-slate-500 text-center uppercase tracking-[0.2em] font-bold">
        CraftBox Unikernel Management Interface // v3.1.5-prod // Hardware Virtualization Enabled
      </div>

      {/* Terminal Simulation Modal */}
      {consoleVmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 transition-all duration-300">
          <div className="bg-[#050505] border border-slate-800 rounded-2xl w-full max-w-3xl shadow-[0_0_50px_rgba(99,102,241,0.15)] overflow-hidden flex flex-col h-[550px] animate-in fade-in zoom-in duration-200">
            {/* Terminal Header */}
            <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                </div>
                <div className="h-4 w-px bg-slate-700 mx-2"></div>
                <span className="text-[10px] font-bold text-slate-400 mono uppercase tracking-[0.1em] flex items-center gap-2">
                  <span className="text-indigo-400 text-xs">🐚</span>
                  Unikernel Virtual Console // Nanos-VM-{consoleVmId.toString().padStart(3, '0')}
                </span>
              </div>
              <button 
                onClick={() => setConsoleVmId(null)}
                className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
                aria-label="Close Terminal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Terminal Body */}
            <div className="flex-1 p-8 mono text-xs text-emerald-500/90 overflow-y-auto bg-[#050505] custom-scrollbar scroll-smooth">
              <div className="mb-6 border-b border-emerald-900/30 pb-4">
                <pre className="text-emerald-400/80 leading-tight">
{`   _____           🅲🆁🅰🅵🆃🅱🅾🆇
  / ___/____  ____  ________  / /__
  \\__ \\/ __ \\/ __ \\/ ___/ _ \\/ / _ \\
 ___/ / /_/ / /_/ / /  /  __/ /  __/
/____/\\____/\\____/_/   \\___/_/\\___/`}
                </pre>
                <div className="mt-4 text-emerald-400/60 flex flex-col gap-1">
                  <p>Runtime: NANOS Unikernel v0.1.51-stable</p>
                  <p>Arch: x86_64 // Virt: KVM/QEMU</p>
                  <p>Kernel Build: 2025-05-12_23:14:02</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-indigo-400"># System identification: nanos-vm-{consoleVmId}</p>
                <p className="flex gap-2"># Establishing secure link to PID {activeVm?.player_id} port {activeVm?.port}...</p>
                <p className="text-emerald-300 font-bold flex gap-2">
                  <span className="text-emerald-500">[OK]</span> 
                  Encrypted Tunnel established (AES-256-GCM)
                </p>
                
                <div className="mt-6 pt-6 border-t border-emerald-900/20">
                  <p className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                    <span className="text-emerald-600 opacity-50">root@nanos-vm-{consoleVmId}:/ $</span> 
                    <span>sysctl -a vm.metrics</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 my-4 p-4 bg-emerald-950/10 border border-emerald-900/20 rounded-xl">
                    <div className="flex justify-between border-b border-emerald-900/10 pb-1">
                      <span className="text-emerald-400/60 uppercase text-[9px] font-bold">Uptime_Seconds</span>
                      <span className="text-emerald-400 font-bold">{activeVm?.uptime}</span>
                    </div>
                    <div className="flex justify-between border-b border-emerald-900/10 pb-1">
                      <span className="text-emerald-400/60 uppercase text-[9px] font-bold">Memory_RSS_MB</span>
                      <span className="text-emerald-400 font-bold">{activeVm?.used_memory} / {activeVm?.allocated_memory}</span>
                    </div>
                    <div className="flex justify-between border-b border-emerald-900/10 pb-1">
                      <span className="text-emerald-400/60 uppercase text-[9px] font-bold">CPU_Usage_Core</span>
                      <span className="text-emerald-400 font-bold">{activeVm?.used_cpu}</span>
                    </div>
                    <div className="flex justify-between border-b border-emerald-900/10 pb-1">
                      <span className="text-emerald-400/60 uppercase text-[9px] font-bold">Context_Switches</span>
                      <span className="text-emerald-400 font-bold">1,242</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-amber-950/10 border border-amber-900/20 rounded-xl flex items-start space-x-4 animate-pulse">
                  <span className="text-xl">🛠️</span>
                  <div>
                    <p className="text-amber-400 font-bold uppercase text-[10px] tracking-widest mb-1">Console access simulation active</p>
                    <p className="text-amber-300/60 text-[11px] leading-relaxed">
                      Actual command processing is restricted in read-only dashboard mode. 
                      Standard input is currently simulated to prevent accidental production interference.
                    </p>
                  </div>
                </div>
                
                <div ref={terminalEndRef} />
              </div>
            </div>

            {/* Terminal Input Footer */}
            <form onSubmit={handleTerminalSubmit} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center space-x-4">
              <div className="flex-1 flex items-center space-x-3 mono text-xs px-4 py-2.5 bg-black rounded-xl border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
                <span className="text-emerald-500 font-bold whitespace-nowrap">nanos-vm-{consoleVmId}:/ $</span>
                <input 
                  type="text" 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Console access simulation... type 'help' for available mock commands"
                  className="flex-1 bg-transparent border-none outline-none text-emerald-400 placeholder-emerald-900/50"
                  autoFocus
                />
                <span className="w-2 h-4 bg-emerald-500 animate-pulse"></span>
              </div>
              <button 
                type="button"
                onClick={() => setConsoleVmId(null)}
                className="bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 px-5 py-2.5 rounded-xl text-[10px] font-bold transition-all border border-slate-700/50 uppercase tracking-widest active:scale-95"
              >
                Disconnect
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default VMManager;
