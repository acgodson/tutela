import { PigData, RegionData } from ".";

// mockData.ts
export const africanRegions: RegionData[] = [
  {
    id: "north-africa",
    name: "North Africa",
    coordinates: {
      centerLat: 28.0339,
      centerLng: 1.6596,
      zoomLevel: 4,
    },
    subRegions: ["Morocco", "Algeria", "Tunisia", "Libya", "Egypt"],
  },
  {
    id: "west-africa",
    name: "West Africa",
    coordinates: {
      centerLat: 11.0367,
      centerLng: -4.2674,
      zoomLevel: 4,
    },
    subRegions: ["Nigeria", "Ghana", "Senegal", "Mali"],
  },
  // Add more regions...
];

export const generateMockPigData = (count: number): PigData[] => {
  // Helper function to generate random data
  return Array.from({ length: count }, (_, i) => ({
    id: `pig-${i}`,
    rfid: `RFID-${Math.random().toString(36).substr(2, 9)}`,
    region:
      africanRegions[Math.floor(Math.random() * africanRegions.length)].id,
    subRegion: "Morocco", // You'll need to make this more dynamic
    coordinates: {
      lat: Math.random() * 20 + 10, // Rough coordinates for Africa
      lng: Math.random() * 40 - 20,
    },
    health: {
      temperature: Math.random() * 2 + 38, // Normal pig temp is around 39°C
      lastReading: new Date(
        Date.now() - Math.random() * 86400000
      ).toISOString(),
      status: Math.random() > 0.8 ? "fever" : "healthy",
    },
    metadata: {
      registeredDate: new Date(
        Date.now() - Math.random() * 31536000000
      ).toISOString(),
      age: Math.floor(Math.random() * 5),
      weight: Math.random() * 100 + 50,
      farmerId: `farmer-${Math.floor(Math.random() * 5) + 1}`,
    },
  }));
};
