
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import VMManager from './components/VMManager';
import AgentBill from './components/AgentBill';
import GeminiAdvisor from './components/GeminiAdvisor';
import { Metrics, VMInfo, AgentDecision } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'vms' | 'agent' | 'advisor'>('metrics');
  const [metrics, setMetrics] = useState<Metrics>({
    server_uptime: 3600,
    total_players: 150,
    active_players: 42,
    total_blocks_changed: 12450,
    agent_actions: 890,
    active_vms: 5,
    cpu_usage: 45.2,
    memory_usage: 62.8,
    network_bytes_sent: 1024 * 1024 * 50,
    network_bytes_recv: 1024 * 1024 * 120,
  });

  const [vms, setVms] = useState<VMInfo[]>([
    { 
      vm_id: 1, player_id: 101, port: 4081, status: 'running', uptime: 3200, 
      allocated_cpu: 0.5, allocated_memory: 512, used_cpu: 0.12, used_memory: 120,
      recent_logs: ["[OPS] Booting unikernel...", "[CRAFT] Listening on :4081", "[CRAFT] Player 101 connected"] 
    },
    { 
      vm_id: 2, player_id: 102, port: 4082, status: 'running', uptime: 2800, 
      allocated_cpu: 0.5, allocated_memory: 512, used_cpu: 0.05, used_memory: 85,
      recent_logs: ["[OPS] Unikernel ready", "[CRAFT] Listening on :4082"] 
    },
    { 
      vm_id: 3, player_id: 105, port: 4083, status: 'running', uptime: 1500, 
      allocated_cpu: 1.0, allocated_memory: 1024, used_cpu: 0.45, used_memory: 310,
      recent_logs: ["[OPS] High perf mode engaged", "[CRAFT] Listening on :4083"] 
    },
    { 
      vm_id: 4, player_id: 109, port: 4084, status: 'failed', uptime: 0, 
      allocated_cpu: 0.5, allocated_memory: 512, used_cpu: 0, used_memory: 0,
      recent_logs: ["[OPS] Panic: Out of memory", "[OPS] VM Terminated"] 
    },
    { 
      vm_id: 5, player_id: 110, port: 4085, status: 'running', uptime: 400, 
      allocated_cpu: 0.5, allocated_memory: 512, used_cpu: 0.08, used_memory: 110,
      recent_logs: ["[OPS] Booting unikernel..."] 
    },
  ]);

  const [agentHistory, setAgentHistory] = useState<AgentDecision[]>([
    {
      timestamp: new Date().toISOString(),
      action: 'gather_wood',
      params: {},
      reasoning: 'Need resources for basic shelter construction.'
    },
    {
      timestamp: new Date(Date.now() - 5000).toISOString(),
      action: 'explore',
      params: { direction: 'north' },
      reasoning: 'Searching for a flat area to build.'
    }
  ]);

  const deployNewVM = useCallback(() => {
    const usedPorts = new Set(vms.map(v => v.port));
    let nextAvailablePort = 4081;
    while (usedPorts.has(nextAvailablePort)) {
      nextAvailablePort++;
    }

    const nextId = Math.max(...vms.map(v => v.vm_id), 0) + 1;
    
    const newVM: VMInfo = {
      vm_id: nextId,
      player_id: Math.floor(Math.random() * 900) + 100,
      port: nextAvailablePort,
      status: 'provisioning',
      uptime: 0,
      allocated_cpu: 0.5,
      allocated_memory: 512,
      used_cpu: 0,
      used_memory: 0,
      recent_logs: ["[OPS] Initiating build...", "[OPS] Fetching Nanos image..."]
    };

    setVms(prev => [...prev, newVM]);

    setTimeout(() => {
      setVms(prev => prev.map(vm => 
        vm.vm_id === nextId ? { 
          ...vm, 
          status: 'running', 
          used_cpu: 0.05, 
          used_memory: 64,
          recent_logs: [...vm.recent_logs, "[OPS] VM started successfully"] 
        } : vm
      ));
    }, 2500);
  }, [vms]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate global metrics
      setMetrics(prev => ({
        ...prev,
        cpu_usage: Math.min(100, Math.max(0, prev.cpu_usage + (Math.random() - 0.5) * 5)),
        memory_usage: Math.min(100, Math.max(0, prev.memory_usage + (Math.random() - 0.5) * 2)),
        server_uptime: prev.server_uptime + 1,
        active_players: Math.max(0, prev.active_players + (Math.random() > 0.8 ? 1 : Math.random() < 0.2 ? -1 : 0)),
        active_vms: vms.filter(v => v.status === 'running').length
      }));

      // Fluctuate per-VM metrics
      setVms(prevVms => prevVms.map(vm => {
        if (vm.status !== 'running') return vm;
        
        // Random usage within allocation limits
        const newUsedCpu = Math.max(0, Math.min(vm.allocated_cpu, vm.used_cpu + (Math.random() - 0.5) * 0.05));
        const newUsedMem = Math.max(20, Math.min(vm.allocated_memory, vm.used_memory + (Math.random() - 0.5) * 10));
        
        return {
          ...vm,
          uptime: vm.uptime + 1,
          used_cpu: Number(newUsedCpu.toFixed(2)),
          used_memory: Math.round(newUsedMem)
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [vms]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-bold">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CraftBox Production</h1>
              <p className="text-xs text-slate-400 mono">v3.1-NANOS-PROD // {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Status</span>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-semibold text-emerald-400">OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl w-fit mb-8 border border-slate-800 self-center">
          {[
            { id: 'metrics', label: 'Telemetry', icon: '📊' },
            { id: 'vms', label: 'Nanos VMs', icon: '📦' },
            { id: 'agent', label: 'Agent Bill', icon: '🤖' },
            { id: 'advisor', label: 'Gemini Advisor', icon: '✨' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1">
          {activeTab === 'metrics' && <Dashboard metrics={metrics} />}
          {activeTab === 'vms' && <VMManager vms={vms} onDeploy={deployNewVM} />}
          {activeTab === 'agent' && <AgentBill history={agentHistory} />}
          {activeTab === 'advisor' && <GeminiAdvisor metrics={metrics} vms={vms} />}
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm p-3">
        <div className="container mx-auto flex flex-wrap justify-between items-center text-[11px] mono text-slate-500">
          <div className="flex space-x-4">
            <span>Uptime: {Math.floor(metrics.server_uptime / 3600)}h {Math.floor((metrics.server_uptime % 3600) / 60)}m {metrics.server_uptime % 60}s</span>
            <span className="text-indigo-400">Region: us-east-1</span>
          </div>
          <div className="flex space-x-4">
            <span>API_KEY: CONNECTED</span>
            <span>WS_PORT: 8080</span>
            <span className="text-emerald-400">CLOUD_DEPLOY: STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
