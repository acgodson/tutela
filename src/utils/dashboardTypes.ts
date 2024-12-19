// types/dashboard.ts
export interface PigData {
  id: string;
  rfid: string;
  x: number;
  y: number;
  hasFever: boolean;
  temperature?: number;
  lastUpdate: string;
  region: string;
  farmerId: string;
  status?: "normal" | "fever";
  subRegion?: string;
}

export interface DashboardStats {
  totalMonitored: number;
  currentAlerts: number;
  healthIndex: number;
  dailyChange?: number;
}

export interface ViewProps {
  pigData: PigData[];
  isLoading?: boolean;
  error?: string;
}
