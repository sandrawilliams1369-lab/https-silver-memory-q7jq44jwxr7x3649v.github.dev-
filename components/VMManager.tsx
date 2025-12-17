
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
    // In a real app, this would send a command via WebSocket
    // For simulation, we just clear the input to show it was "sent"
    setTerminalInput('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Active Nanos Instances</h2>
          <p className="text-sm text-slate-400">Click a row to expand detailed telemetry and logs.</p>
        </div>
        <button 
          onClick={onDeploy}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center space-x-2"
        >
          <span>+</span>
          <span>Deploy New VM</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-800">
              <th className="px-4 py-4 text-center"></th>
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
                      <span className={`inline-block transition-transform duration-200 text-xs ${expandedVmId === vm.vm_id ? 'rotate-90' : ''}`}>
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
                        <span className={`text-xs font-bold uppercase ${
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
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-opacity group-hover:opacity-100 opacity-0 md:opacity-100" 
                          title="Console"
                        >
                          🐚
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 bg-slate-800 hover:bg-rose-900/40 rounded text-slate-400 hover:text-rose-400 transition-opacity group-hover:opacity-100 opacity-0 md:opacity-100" 
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
                      <td colSpan={7} className="px-6 py-6 bg-slate-950/50 border-y border-indigo-500/20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Column 1: Resource Stats */}
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Real-time Resource Usage</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                  <span className="text-slate-400">CPU Usage</span>
                                  <span className="text-white font-bold mono">
                                    {vm.used_cpu.toFixed(2)} / {vm.allocated_cpu} Cores ({cpuPercent.toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-500 ${cpuPercent > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                    style={{ width: `${cpuPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                  <span className="text-slate-400">Memory Usage</span>
                                  <span className="text-white font-bold mono">
                                    {vm.used_memory} / {vm.allocated_memory} MB ({memPercent.toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-500 ${memPercent > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${memPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="pt-4 grid grid-cols-3 gap-3">
                                <button className="text-[10px] font-bold bg-slate-900 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 py-2 rounded transition-colors uppercase">
                                  Reboot
                                </button>
                                <button className="text-[10px] font-bold bg-slate-900 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 py-2 rounded transition-colors uppercase">
                                  Snapshot
                                </button>
                                <button 
                                  onClick={(e) => openConsole(e, vm.vm_id)}
                                  className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded transition-colors uppercase shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
                                >
                                  <span>🐚</span>
                                  <span>Console</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Column 2: Logs */}
                          <div className="flex flex-col h-full">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Unikernel Boot Logs</h4>
                            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex-1 min-h-[120px] max-h-[120px] overflow-y-auto mono text-[10px]">
                              {vm.recent_logs.map((log, lidx) => (
                                <div key={lidx} className="mb-1 text-slate-400">
                                  <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                  {log}
                                </div>
                              ))}
                              <div className="text-indigo-400 animate-pulse mt-1">_</div>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-[9px] text-slate-500 italic">Logs are synced every 500ms</span>
                              <button className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center space-x-1">
                                <span>📄</span>
                                <span>VIEW FULL CONFIG</span>
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
      <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-[10px] mono text-slate-500 text-center">
        Ops Tool integration active // Unikernel Isolation: Enabled // Auto-scaling: ON
      </div>

      {/* Terminal Simulation Modal */}
      {consoleVmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-black border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                </div>
                <span className="ml-2 text-[10px] font-bold text-slate-400 mono uppercase tracking-widest flex items-center">
                  <span className="mr-2">🐚</span>
                  Unikernel Terminal Simulation // VM #{consoleVmId.toString().padStart(3, '0')}
                </span>
              </div>
              <button 
                onClick={() => setConsoleVmId(null)}
                className="text-slate-500 hover:text-white transition-colors p-1"
                aria-label="Close Terminal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-6 mono text-xs text-emerald-500 overflow-y-auto bg-[#050505] custom-scrollbar scroll-smooth">
              <div className="mb-4 text-emerald-400/80">
                CraftBox Unikernel Shell [Version 3.1.2025]<br />
                NANOS Unikernel Runtime v0.1.51<br />
                (c) 2025 CraftBox & Nanos Unikernel Foundation.
              </div>
              
              <div className="space-y-1">
                <p className="text-emerald-600"># System identification: nanos-vm-{consoleVmId}</p>
                <p># Connecting to kernel socket at localhost:{activeVm?.port}...</p>
                <p className="text-emerald-300 font-bold underline">Connection established via Secure WebSocket.</p>
                <p># Authenticating PID {activeVm?.player_id}...</p>
                <p className="text-emerald-400/70 italic">[INFO] Session verified. TTY allocated.</p>
                
                <div className="mt-4 pt-4 border-t border-emerald-900/30">
                  <p className="text-emerald-400 font-bold">root@nanos-vm-{consoleVmId}:/ $ ops stats</p>
                  <div className="grid grid-cols-2 gap-4 my-2 p-2 bg-emerald-950/20 border border-emerald-900/20 rounded">
                    <div>
                      <p className="text-emerald-400/60 uppercase text-[9px]">Uptime</p>
                      <p>{activeVm?.uptime}s</p>
                    </div>
                    <div>
                      <p className="text-emerald-400/60 uppercase text-[9px]">Memory Usage</p>
                      <p>{activeVm?.used_memory}MB / {activeVm?.allocated_memory}MB</p>
                    </div>
                    <div>
                      <p className="text-emerald-400/60 uppercase text-[9px]">Kernel Threads</p>
                      <p>1 (Isolated)</p>
                    </div>
                    <div>
                      <p className="text-emerald-400/60 uppercase text-[9px]">Active Net Sockets</p>
                      <p>TCP: {activeVm?.port} (ESTABLISHED)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-emerald-400 font-bold">root@nanos-vm-{consoleVmId}:/ $ tail -n 5 /var/log/kernel.log</p>
                  <p className="text-emerald-400/50 text-[10px]">
                    [0.000000] Booting from disk...<br />
                    [0.000005] VFS mounted.<br />
                    [0.000010] Listening for game events on {activeVm?.port}
                  </p>
                </div>

                <div className="mt-6 p-3 bg-rose-950/20 border border-rose-900/30 rounded flex items-start space-x-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="text-rose-400 font-bold uppercase text-[10px] tracking-widest">Console Access Simulation</p>
                    <p className="text-rose-300/70 text-[11px] leading-tight">
                      Real-time interactive shell is currently in demo mode. 
                      Standard input is piped to null for production safety.
                    </p>
                  </div>
                </div>
                
                <div ref={terminalEndRef} />
              </div>
            </div>

            <form onSubmit={handleTerminalSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-3">
              <div className="flex-1 flex items-center space-x-2 mono text-xs px-3 py-1.5 bg-black rounded border border-slate-700">
                <span className="text-emerald-500 font-bold">root@nanos-vm-{consoleVmId}:/ $</span>
                <input 
                  type="text" 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Enter command (e.g. ops help, stats, netstat)..."
                  className="flex-1 bg-transparent border-none outline-none text-emerald-400 placeholder-emerald-900"
                  autoFocus
                />
                <span className="w-1.5 h-4 bg-emerald-500 animate-pulse"></span>
              </div>
              <button 
                type="button"
                onClick={() => setConsoleVmId(null)}
                className="bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 px-3 py-2 rounded text-[10px] font-bold transition-all border border-slate-700"
              >
                DISCONNECT
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #050505;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default VMManager;
