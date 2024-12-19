// types/dashboard.ts
// export interface PigData {
//   id: string;
//   rfid: string;
//   x: number;
//   y: number;
//   hasFever: boolean;
//   temperature?: number;
//   lastUpdate: string;
//   region: string;
//   farmerId: string;
//   status?: "normal" | "fever";
//   subRegion?: string;
// }

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

export interface PigMessage {
  content: {
    pigTopicId: string;
    rfid: string;
    timestamp: string;
  };
}

export interface HealthStatusMessage {
  content: {
    hasFever: boolean;
    temperature?: number;
    timestamp: string;
  };
}

export interface PigStatus {
  hasFever: boolean;
  temperature?: number;
  timestamp: string;
}

export interface PigData {
  pigTopicId: string;
  rfid: string;
  farmId?: string;
  timestamp: string;
  latestStatus: PigStatus | null;
}

export interface DashboardStats {
  totalMonitored: number;
  currentAlerts: number;
  healthIndex: number;
  dailyChange?: number;
}

export interface RegionalOverviewData {
  pigs: PigData[];
  stats: {
    totalPigs: number;
    healthyPigs: number;
    sickPigs: number;
    farmCount: number;
  };
}

export interface PigStatusProps {
  x: number;
  y: number;
  hasFever: boolean;
  lastUpdate: string;
  isNew?: boolean;
}
