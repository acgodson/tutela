# Tutela

### Tutela Key features with HCS:

- REGIONS topic: Tracks all regions and farmer - registrations within regions
- FARMS topic: Records all farmer registrations and their details
- PIGS topic: Contains all pig-related messages (registration, health fever updates)

```bash
type MessageTypes =
| 'REGION_CREATED'
| 'FARMER_REGISTERED'
| 'PIG_REGISTERED'
| 'HEALTH_UPDATE'
```

### Key Endpoints:

```typescript
- POST /createRegion // Creates a new region topic
- POST /registerFarmer // Registers a new farmer in a region
- POST /registerPig // Registers a new pig under a farmer
- GET /submitPigFeverStatus // Updates pig health status (IoT friendly)
- GET /getTopicMessages // Retrieves messages for any topic
```

### Sample IoT device call:

```typescript
GET /submitPigFeverStatus?rfid=123&hasFever=true
```

