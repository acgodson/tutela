import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(
  address: string,
  startLength = 6,
  endLength = 4
): string {
  if (!address) {
    return "";
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Invalid Address";
  }
  if (address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export const getFirstName = (name: string) => {
  let firstName = "";

  for (const char of name) {
    if (char === " ") return firstName;
    firstName += char;
  }

  return firstName;
};

export const wait5Seconds = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("5 seconds have passed");
    }, 5000);
  });
};



// types.ts
export interface PigData {
  id: string;
  rfid: string;
  region: string;
  subRegion: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  health: {
    temperature: number;
    lastReading: string;
    status: 'healthy' | 'fever' | 'warning';
  };
  metadata: {
    registeredDate: string;
    age?: number;
    weight?: number;
    farmerId: string;
  };
}

export interface RegionData {
  id: string;
  name: string;
  coordinates: {
    centerLat: number;
    centerLng: number;
    zoomLevel: number;
  };
  subRegions: string[];
}