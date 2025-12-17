
export interface Metrics {
  server_uptime: number;
  total_players: number;
  active_players: number;
  total_blocks_changed: number;
  agent_actions: number;
  active_vms: number;
  cpu_usage: number;
  memory_usage: number;
  network_bytes_sent: number;
  network_bytes_recv: number;
}

export interface VMInfo {
  vm_id: number;
  player_id: number;
  port: number;
  status: 'running' | 'stopped' | 'failed' | 'provisioning';
  uptime: number;
  // Allocation
  allocated_cpu: number; // in cores/shares
  allocated_memory: number; // in MB
  // Real-time usage
  used_cpu: number; // current cores usage
  used_memory: number; // current MB usage
  recent_logs: string[];
}

export interface AgentDecision {
  timestamp: string;
  action: string;
  params: Record<string, any>;
  reasoning: string;
}

export interface ChunkData {
  p: number;
  q: number;
  blocks: any[];
}
