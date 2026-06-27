

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
}

export interface LogStats {
  total: number;
}

export interface AlertStats {
  total: number;
  open: number;
  acknowledged: number;
  resolved: number;
  critical: number;
}

export interface RuleStats {
  enabled: number;
  disabled: number;
}

export interface SeverityDistribution {
  severity: string;
  count: number;
}

export interface TopAttackedDevice {
  deviceId: string;
  hostname: string;
  attacks: number;
}

export interface AttackTrend {
  date: string;
  attacks: number;
}

export interface DashboardOverview {
  devices: DeviceStats;
  logs: LogStats;
  alerts: AlertStats;
  rules: RuleStats;
  severityDistribution: SeverityDistribution[];
  topDevices: TopAttackedDevice[];
  recentAlerts: any[]; // We'll replace with Alert DTO later
  attackTrend: AttackTrend[];
}