# Lab Automation Dashboard

Production-grade monitoring dashboard for liquid handling automation, device connectivity, and multi-well plate management - demonstrating real-time lab automation architecture.

🔗 **[Live Demo](https://lab-automation-dashboard.vercel.app/)**

## Portfolio Project

This project is a **portfolio demonstration** designed to showcase senior developer capabilities across four critical skill areas:

1. **Architecture Sense** - System design, code organization, scalability
2. **Design Sense** - UI/UX, visual hierarchy, user experience  
3. **Language/Technical Sense** - TypeScript mastery, React patterns, best practices
4. **Information Presentation Sense** - Data visualization, real-time updates, clarity

**Why Lab Automation?** This domain choice reflects real-world experience building similar systems in production environments, demonstrating both technical and domain expertise.

### Documentation

- **[Project Objective](PROJECT_OBJECTIVE.md)** - Portfolio strategy and skill demonstration areas
- **[Architecture Showcase](ARCHITECTURE_SHOWCASE.md)** - Deep dive into architecture decisions
- **[Design System](DESIGN_SYSTEM.md)** - Design decisions and UI/UX patterns
- **[Technical Excellence](TECHNICAL_EXCELLENCE.md)** - TypeScript, React patterns, performance
- **[Information Architecture](INFORMATION_ARCHITECTURE.md)** - Data visualization and presentation

## Overview

A comprehensive lab automation dashboard that simulates real-time liquid handling operations, protocol execution, and device monitoring. Built with React 19, TypeScript, and Tailwind CSS v4, showcasing advanced state management patterns and real-time visualization capabilities.

## Features

### 🎯 Protocol Management
- **Protocol Templates** - Pre-defined liquid handling protocols (96-well and 384-well formats)
- **Protocol Execution** - Run protocols with real-time step-by-step progress tracking
- **Run Control** - Start, pause, resume, stop, and restart protocol runs
- **Step Visualization** - See which step is currently executing with visual indicators
- **Multi-Step Workflows** - Support for complex multi-step liquid handling sequences

### 💧 Liquid Handling
- **Real-Time Operations** - Live tracking of pipette operations (source → destination transfers)
- **Volume Management** - Precise µL tracking for each operation
- **Operation Status** - Completed, in-progress, queued, and failed state tracking
- **Animated Transfers** - Visual animation showing liquid movement between wells
- **Well Plate Visualization** - Interactive 96-well and 384-well plate displays

### 🔌 Device & Module Management
- **Single Liquid Handler Robot** - Central liquid handling device
- **Connected Modules** - Pipette modules, plate reader, gripper modules
- **Module Status** - Real-time connection status and operation tracking
- **Operation Counters** - Track total operations per module
- **Health Monitoring** - Last seen timestamps and connectivity status

### 🧪 Well Plate Management
- **96-Well Plates** - Standard format for liquid handling operations
- **384-Well Plates** - High-throughput format support
- **Visual Status** - Color-coded wells (empty, filled, processing, error)
- **Volume Tracking** - Real-time volume display for each well
- **Interactive Selection** - Click wells to view details and statistics
- **Plate Statistics** - Total wells, filled/empty counts, total volume

### 📊 Dashboard & Monitoring
- **Real-Time Dashboard** - Overview of all system components
- **Sensor Monitoring** - Temperature, pressure, humidity sensors with threshold alerts
- **Event Logging** - Complete audit trail of all system events
- **Operations Log** - Detailed history of all pipette operations
- **Admin View** - Administrative interface for system management

### ⚡ Real-Time Updates
- **Live Sensor Data** - Simulated sensor updates every 2 seconds
- **Protocol Simulation** - Real-time protocol execution with step progression
- **Status Synchronization** - Instant updates across all views
- **Visual Feedback** - Animated indicators for active operations

## Technical Architecture

### State Management
- **React Context API** - Global state management for sensors, devices, protocols, and operations
- **Custom Hooks** - Encapsulated logic (`useProtocolSimulation`, `useSensorSimulation`)
- **Memoization** - Performance optimization with `React.memo`, `useMemo`, `useCallback`
- **Error Boundaries** - Graceful error handling and recovery

### Component Structure
```
src/
├── components/
│   ├── views/          # Main view components
│   │   ├── DashboardView.tsx
│   │   ├── DevicesView.tsx
│   │   ├── ProtocolsView.tsx
│   │   ├── RunsView.tsx
│   │   ├── OperationsView.tsx
│   │   ├── EventsView.tsx
│   │   ├── WellPlatesView.tsx
│   │   └── AdminView.tsx
│   ├── memoized/       # Performance-optimized components
│   └── WellPlateVisualization.tsx
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── services/           # Business logic layer
├── data/               # Simulation data
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Data Flow
1. **Simulation Layer** - Custom hooks simulate real-time hardware communication
2. **Service Layer** - Business logic for protocol execution and device management
3. **Context Layer** - Global state management via React Context
4. **View Layer** - UI components consume context and display data

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite (Rolldown)
- **Deployment**: Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

### Views
- **Dashboard** - System overview with statistics and status
- **Devices** - Liquid handler robot and connected modules
- **Protocols** - Browse and start protocol templates
- **Runs** - Monitor active and completed protocol runs with well plate visualization
- **Operations** - Detailed log of all pipette operations
- **Events** - System event log with filtering
- **Well Plates** - Manage and visualize 96-well and 384-well plates
- **Admin** - Administrative controls and system information

### Protocol System
- **Templates** - Pre-defined protocols with multiple steps
- **Runs** - Executed instances of protocols
- **Steps** - Individual operations (source, destination, volume)
- **Status Tracking** - Queued, running, paused, completed, cancelled, failed

### Well Plate System
- **96-Well Format** - 8 rows × 12 columns (standard format)
- **384-Well Format** - 16 rows × 24 columns (high-throughput)
- **Well Status** - Empty, filled, processing, error
- **Volume Tracking** - Per-well volume in µL
- **Visual Indicators** - Color-coded status with animations

## Key Features Demonstrated

✅ **Real-Time Systems** - Sub-2-second data synchronization  
✅ **Complex State Management** - Multiple interdependent data streams  
✅ **Protocol Execution** - Multi-step workflow orchestration  
✅ **Visual Feedback** - Animated well plate operations  
✅ **Device Architecture** - Single device with multiple modules  
✅ **Error Handling** - Error boundaries and graceful degradation  
✅ **Performance Optimization** - Memoization and efficient re-renders  
✅ **Type Safety** - Full TypeScript coverage  

## Architecture Decisions

**Why interval-based simulation?**  
In production, this would use WebSockets or Server-Sent Events. For this demo, intervals simulate real-time hardware communication patterns.

**Why single liquid handler device?**  
Realistic lab automation setup - one central liquid handler robot with multiple connected modules (pipettes, plate reader, gripper).

**Why 96-well and 384-well plates?**  
Standard formats for liquid handling operations. The system supports both with appropriate visualization.

**Why protocol templates?**  
Allows users to define reusable workflows that can be executed multiple times, matching real lab automation systems.

**Why step-by-step visualization?**  
Critical for understanding protocol progress and troubleshooting. Each step shows source/destination and volume.

**Why module-based architecture?**  
Reflects real liquid handler systems where different modules handle different operations (pipetting, reading, gripping).

## Future Enhancements

Potential additions for production use:
- WebSocket backend for true real-time streaming
- Historical data charts and trend analysis
- User authentication and role-based access
- Database persistence for audit logs
- Mobile responsive optimizations
- Additional well plate formats (1536-well)
- Computer vision integration
- Workflow scheduling and queuing
- API integration with LIMS systems
- Multi-device support
- Protocol versioning and templates library

---

Built with React 19, TypeScript, and Tailwind CSS v4. Demonstrates production-grade real-time system architecture, liquid handling visualization, and device connectivity monitoring patterns.
