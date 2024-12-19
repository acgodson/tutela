# Tutela - Farm Health Monitoring System

## Table of Contents

- [Overview](#overview)
- [Demo](#demo)
- [Architecture](#architecture)
  - [Testnet Topics](#testnet-topics)
  - [Topic Structure](#topic-structure)
  - [Message Schema](#message-schema)
- [Tools & Integrations](#tools--integrations)
- [API Reference](#api-reference)
- [Team](#team)

## Overview

Real-time health monitoring system for pig farms with hierarchical data tracking and historical lookup capabilities

## Demo

- [Watch Demo Video](https://vimeo.com/1040586569)
- ![Tutela Monitor](public/tutela_monitor.jpg)

## Architecture

### Testnet Topics

| Topic Type   | Topic ID    | HashScan Link                                                                                |
| ------------ | ----------- | -------------------------------------------------------------------------------------------- |
| Region Topic | 0.0.5287948 | [View on HashScan](https://hashscan.io/testnet/topic/0.0.5287948?p=1&k=1734619806.516859887) |
| Farm Topic   | 0.0.5292739 | [View on HashScan](https://hashscan.io/testnet/topic/0.0.5292739?p=1&k=1734619806.516859887) |

### Topic Structure

The system uses a hierarchical three-level topic structure:

#### Level 1: Region Topic

| Field       | Type     | Description                   |
| ----------- | -------- | ----------------------------- |
| farmTopicId | string   | Hedera Topic ID for the farm  |
| ethAddress  | string   | Farm owner's Ethereum address |
| farmerName  | string   | Name of the farmer            |
| timestamp   | ISO date | Registration timestamp        |

#### Level 2: Farm Topic

| Field      | Type     | Description                 |
| ---------- | -------- | --------------------------- |
| pigTopicId | string   | Hedera Topic ID for the pig |
| rfid       | string   | Pig's RFID identifier       |
| timestamp  | ISO date | Registration timestamp      |

#### Level 3: Pig Topic

| Field       | Type     | Description           |
| ----------- | -------- | --------------------- |
| hasFever    | boolean  | Fever status flag     |
| temperature | number   | Temperature reading   |
| timestamp   | ISO date | Measurement timestamp |

## Tools & Integrations

- Hedera Consensus Service
- Cloud Functions for API endpoints
- Topic IDs as foreign keys
- JSON formatted messages
- CORS-enabled web access
- OpenAI LLM and Langchain Integration

## API Reference

### Topic Creation Endpoints

| Endpoint        | Method | Purpose                                |
| --------------- | ------ | -------------------------------------- |
| `/createRegion` | POST   | Creates new region topic               |
| `/registerFarm` | POST   | Creates farm topic and links to region |
| `/registerPig`  | POST   | Creates pig topic and links to farm    |

### Data Query Endpoints

| Endpoint                | Method | Purpose                            |
| ----------------------- | ------ | ---------------------------------- |
| `/getFarmId`            | GET    | Retrieves farm details from region |
| `/getTopicMessages`     | GET    | Gets all messages for any topic    |
| `/submitPigFeverStatus` | GET    | Records pig health status          |

Example IoT device call:

```typescript
GET /submitPigFeverStatus?rfid=123&hasFever=true
```

## References & Shortcuts

- [Cloud Functions & HCS](https://gist.github.com/acgodson/671b5dbcc15b14434516d78a6dd87e19)
- [TRPC Client](src/trpc/routers/index.ts)
- [OpenAI Chat LLM](src/utils/openAI.ts)

## Team

- [Acgodson](https://github.com/acgodson)
- [Morakinyo](https://github.com/morakinyo)
- [Evaristus](https://github.com/evaristus)

---

© December 18th, 2024
