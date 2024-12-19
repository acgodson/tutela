
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

export const wait5Seconds = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("5 seconds have passed");
    }, 5000);
  });
};

