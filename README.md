# Privacy-Safe Agentic Clinical Triage Assistant

A privacy-safe clinical triage assistant implementing the **LCAC (Least-Context Access Control)** framework to extend Zero Trust principles into the cognitive layer of AI systems.

## Project Structure

```
.
├── backend/                 # FastAPI backend with LCAC framework
│   ├── app/                 # Main application code
│   │   ├── main.py          # FastAPI application entrypoint
│   │   ├── config.py        # Configuration settings
│   │   ├── database.py      # Database connection setup
│   │   ├── models.py        # SQLModel data models
│   │   ├── lcac.py          # LCAC engine and policy definitions
│   │   ├── trust.py         # Trust scoring logic
│   │   └── orchestrator.py  # LangChain agent orchestrator with hooks
│   ├── scripts/             # Utility scripts
│   │   ├── init_db.py       # Initialize SQLite database schema
│   │   └── demo_scenarios.py# Run demonstration scenarios
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Container build instructions
│   └── docker-compose.yml   # Multi-container orchestration
└── frontend/                # Next.js dashboard for visualization
    ├── app/                 # Next.js app router pages
    ├── components/          # React components
    ├── services/            # API service layer
    ├── styles/              # Tailwind CSS styles
    └── ...                  # Other Next.js files
```

## Quick Start

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database**:
   ```bash
   python scripts/init_db.py
   ```

5. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Copy environment example**:
   ```bash
   cp .env.local.example .env.local
   ```

4. **Start the frontend development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open the dashboard**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser

## Features

### LCAC Framework
- **Zone-based Access Control**: Memories are tagged and filtered by zone (triage, radiology, billing, etc.)
- **Policy Enforcement**: Pre-inference and post-inference hooks enforce policy compliance
- **Audit Logging**: Complete provenance tracking for all inference events
- **Trust Scoring**: Dynamic trust scores based on policy violations and successful inferences
- **Session Revocation**: Automatic session termination on policy violations
- **Memory Redaction**: GDPR-compliant memory redaction with audit trail

### Dashboard Visualization
- **Zone-Based Access Control**: Interactive visualization of LCAC zones and their allowed tags
- **Memory Management**: Real-time display of accessible and blocked memories
- **Session Monitoring**: Track active and revoked sessions
- **Audit Trail**: Comprehensive logging of all AI interactions
- **Trust Scoring**: Dynamic trust scores based on policy compliance
- **Clinical Triage Assistant**: Interactive demo of the privacy-safe AI assistant

## API Documentation

Once the backend server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Demo Scenarios

Run the demo scripts to see the system in action:

```bash
cd backend
python scripts/demo_scenarios.py
```

## Security Considerations

This is an MVP demonstration. For production use, consider:
- **Encryption**: Encrypt sensitive data at rest and in transit
- **Authentication**: Implement proper user authentication (OAuth2, JWT)
- **Authorization**: Fine-grained role-based access control
- **PII Handling**: Implement proper PII detection and masking
- **Audit Logging**: Secure, tamper-proof audit logs
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Input Validation**: Enhanced input validation and sanitization

## License

MIT License