// mockData.ts

interface RegionData {
  id: string;
  topicId: string;
  name: string;
  coordinates: {
    centerLat: number;
    centerLng: number;
    zoomLevel: number;
  };
  subRegions: string[];
}

export const africanRegions: RegionData[] = [
  {
    id: "west-africa",
    topicId: "0.0.5287948",
    name: "West Africa",
    coordinates: {
      centerLat: 11.0367,
      centerLng: -4.2674,
      zoomLevel: 4,
    },
    subRegions: ["Nigeria", "Ghana", "Senegal", "Mali"],
  },
];
