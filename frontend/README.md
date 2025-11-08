# LCAC Clinical Triage Dashboard

An enterprise-grade dashboard for visualizing the Least-Context Access Control (LCAC) framework in action.

## Features

- **Zone-Based Access Control Visualization**: Interactive visualization of LCAC zones and their allowed tags
- **Memory Management**: Real-time display of accessible and blocked memories
- **Session Monitoring**: Track active and revoked sessions
- **Audit Trail**: Comprehensive logging of all AI interactions
- **Trust Scoring**: Dynamic trust scores based on policy compliance

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=dev-demo-key-change-in-production
```

## Architecture

The dashboard is built with:
- Next.js 13+ with App Router
- Tailwind CSS for styling
- TypeScript for type safety
- Radix UI components for accessibility

## LCAC Framework Visualization

The dashboard provides real-time visualization of the LCAC framework:
1. **Zone-Based Access Control**: Shows how memories are isolated by zone
2. **Policy Enforcement**: Demonstrates pre/post-inference hooks
3. **Audit & Trust**: Displays provenance tracking and trust scoring
4. **Privacy Protection**: Visualizes session revocation and memory redaction

## Learn More

To learn more about the LCAC framework, check out the [backend documentation](../backend/README.md).