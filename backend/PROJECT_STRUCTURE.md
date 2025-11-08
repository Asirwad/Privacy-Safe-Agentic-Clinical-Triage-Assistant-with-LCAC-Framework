# Project Structure

## Overview

This document describes the structure of the Privacy-Safe Agentic Clinical Triage Assistant backend.

## Directory Structure

```
.
├── backend/                    # Backend application code
│   ├── __init__.py            # Package initialization
│   ├── main.py                # FastAPI application and endpoints
│   ├── config.py              # Configuration settings
│   ├── database.py            # Database setup and session management
│   ├── models.py              # SQLModel database models
│   ├── lcac.py                # LCAC engine (Cognitive Control Plane)
│   ├── trust.py               # Trust scoring engine
│   └── orchestrator.py        # LangChain agent orchestrator
│
├── scripts/                    # Utility scripts
│   ├── __init__.py            # Package initialization
│   ├── init_db.py             # Database initialization script
│   └── demo_scenarios.py      # Demo scenarios script
│
├── requirements.txt           # Python dependencies
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose configuration
├── .gitignore                 # Git ignore file
├── README.md                  # Main documentation
├── QUICKSTART.md              # Quick start guide
├── LICENSE                    # MIT License
├── run.sh                     # Startup script (Linux/Mac)
└── run.bat                    # Startup script (Windows)
```

## Core Components

### Backend Module (`backend/`)

#### `main.py`
- FastAPI application setup
- HTTP API endpoints
- Request/response models
- API key authentication
- Endpoints:
  - `POST /memories` - Create memory
  - `GET /memories` - List memories
  - `POST /sessions` - Create session
  - `POST /ask` - Process query
  - `POST /revoke` - Revoke session
  - `POST /redact_memory` - Redact memory
  - `GET /audit` - Get audit records
  - `GET /trust` - Get trust score

#### `config.py`
- Application configuration
- Environment variable handling
- Default settings

#### `database.py`
- SQLite database setup
- Session management
- Database initialization

#### `models.py`
- SQLModel database models:
  - `Memory` - Memory storage
  - `Session` - Session management
  - `Audit` - Audit logging
  - `TrustScore` - Trust scoring

#### `lcac.py`
- LCAC (Least-Context Access Control) engine
- Policy enforcement
- Memory filtering by zone
- Inference validation
- Session revocation
- Memory redaction
- Audit record creation

#### `trust.py`
- Trust scoring engine
- Violation tracking
- Success tracking
- Score calculation

#### `orchestrator.py`
- LangChain agent orchestration
- Pre-inference hooks (LCAC)
- Post-inference hooks (LCAC)
- Context building from memories
- LLM integration

### Scripts Module (`scripts/`)

#### `init_db.py`
- Database initialization
- Sample data creation
- Table creation

#### `demo_scenarios.py`
- Demo scenario implementations:
  1. Happy path
  2. Cross-zone protection
  3. Policy violation & revocation
  4. Memory redaction

## Data Flow

```
User Request
    ↓
FastAPI Endpoint
    ↓
Orchestrator
    ↓
Pre-inference Hook (LCAC)
    ↓
Memory Filtering (Zone-based)
    ↓
Context Building
    ↓
LLM Inference
    ↓
Post-inference Hook (LCAC)
    ↓
Policy Validation
    ↓
Audit Logging
    ↓
Trust Score Update
    ↓
Response
```

## Database Schema

### `memories`
- Stores patient memories with zone and tags
- Supports redaction
- Content hashing for provenance

### `sessions`
- Manages user sessions
- Tracks zone and user
- Supports revocation

### `audits`
- Logs all inference events
- Tracks memory usage
- Records policy violations
- Provenance hashing

### `trust_scores`
- Tracks user trust scores
- Violation counts
- Success counts

## LCAC Policy

Zones and allowed tags are defined in `backend/lcac.py`:

- `triage`: ["symptoms", "vitals", "recent_visit"]
- `teleconsult`: ["symptoms", "vitals", "recent_visit", "prescription"]
- `billing`: ["billing_code", "insurance", "procedure"]
- `research`: ["anonymized_data", "aggregate_stats"]
- `radiology`: ["imaging_results", "radiology_report"]

## Security

- API key authentication
- Zone-based access control
- Policy enforcement
- Audit logging
- Memory redaction
- Trust scoring

## Extensibility

The system is designed to be extensible:

1. **Additional Zones**: Add zones to `LCACPolicy.ZONE_POLICIES`
2. **Custom Policies**: Extend `LCACPolicy` class
3. **Vector DB**: Add vector database integration in orchestrator
4. **Multiple LLMs**: Support multiple LLM providers
5. **Advanced Trust**: Implement ML-based trust scoring

## Testing

- Demo scenarios: `scripts/demo_scenarios.py`
- API testing: Use Swagger UI at `/docs`
- Manual testing: Use curl commands in QUICKSTART.md

## Deployment

### Local Development
```bash
python scripts/init_db.py
uvicorn backend.main:app --reload
```

### Docker
```bash
docker-compose up --build
```

## Dependencies

See `requirements.txt` for full list. Key dependencies:

- FastAPI - Web framework
- SQLModel - Database ORM
- LangChain - Agent framework
- OpenAI - LLM provider
- Uvicorn - ASGI server

## Future Enhancements

- Vector database integration
- Enhanced PII detection
- Multi-agent collaboration
- Real-time dashboard
- Advanced policy engine
- EHR integration
- Multiple LLM providers

