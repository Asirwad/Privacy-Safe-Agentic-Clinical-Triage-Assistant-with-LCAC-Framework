# Privacy-Safe Agentic Clinical Triage Assistant

**Backend MVP with LCAC (Least-Context Access Control) Framework**

A demonstration of extending Zero Trust principles into the cognitive layer, securing what AI systems can know, remember, and reason about in clinical settings.

## Overview

This backend implements a privacy-safe clinical triage assistant that uses the **LCAC (Least-Context Access Control)** framework to enforce cognitive security boundaries. The system ensures that AI agents only access and reason about information authorized for their specific zone (e.g., triage, radiology, billing).

### Key Features

- **Zone-based Access Control**: Memories are tagged and filtered by zone (triage, radiology, billing, etc.)
- **LCAC Enforcement**: Pre-inference and post-inference hooks enforce policy compliance
- **Audit Logging**: Complete provenance tracking for all inference events
- **Trust Scoring**: Dynamic trust scores based on policy violations and successful inferences
- **Session Revocation**: Automatic session termination on policy violations
- **Memory Redaction**: GDPR-compliant memory redaction with audit trail

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Backend                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   HTTP API   │  │  Orchestrator│  │  LangChain   │  │
│  │   Endpoints  │→ │  (LCAC Hooks)│→ │    Agent     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         ↓                ↓                    ↓          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   LCAC       │  │    Trust     │  │    Audit     │  │
│  │   Engine     │  │   Engine     │  │    Logger    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         ↓                ↓                    ↓          │
└─────────┼────────────────┼────────────────────┼─────────┘
          ↓                ↓                    ↓
    ┌──────────────────────────────────────────────────┐
    │           SQLite Database (MVP)                  │
    │  - memories  - sessions  - audits  - trust_scores│
    └──────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Python 3.11+
- LLM API key (optional, for LLM functionality):
  - **OpenAI API key** OR
  - **Google Gemini API key**
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository** (or set up the project):
```bash
cd "Privacy-Safe Agentic Clinical Triage Assistant"
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

4. **Set up environment variables**:
```bash
# Copy .env.example to .env and update values
# For MVP, you can use the defaults

# Choose one LLM provider:
# Option 1: OpenAI
export LLM_PROVIDER=openai
export OPENAI_API_KEY=your-openai-api-key-here

# Option 2: Google Gemini
export LLM_PROVIDER=gemini
export GEMINI_API_KEY=your-gemini-api-key-here

# API authentication
export API_KEY=dev-demo-key-change-in-production
```

5. **Initialize the database**:
```bash
python scripts/init_db.py
```

6. **Start the server**:
```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`

### Docker Deployment

1. **Build and run with Docker Compose**:
```bash
docker-compose up --build
```

2. **Or build and run with Docker**:
```bash
docker build -t clinical-triage-backend .
docker run -p 8000:8000 \
  -e LLM_PROVIDER=gemini \
  -e GEMINI_API_KEY=your-key \
  clinical-triage-backend
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Authentication

All endpoints require an API key in the header:
```
X-API-Key: dev-demo-key-change-in-production
```

### Endpoints

#### `POST /memories`
Create a new memory entry.

**Request:**
```json
{
  "zone": "triage",
  "tags": ["symptoms", "vitals"],
  "content": "Patient reports chest pain for 2 days."
}
```

**Response:**
```json
{
  "id": "uuid",
  "zone": "triage",
  "tags": ["symptoms", "vitals"],
  "content": "Patient reports chest pain for 2 days.",
  "content_hash": "sha256-hash",
  "created_at": "2024-01-01T00:00:00",
  "redacted": false
}
```

#### `GET /memories?zone=triage`
List memories, filtered by zone (LCAC enforced).

#### `POST /sessions`
Create a new session.

**Request:**
```json
{
  "zone": "triage",
  "user_id": "patient_001",
  "metadata": {}
}
```

#### `POST /ask`
Process a query through the orchestrator with LCAC enforcement.

**Request:**
```json
{
  "session_id": "uuid",
  "message": "What should I do about my chest pain?"
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "response": "Based on your symptoms...",
  "audit_id": "uuid",
  "used_memory_ids": ["uuid1", "uuid2"],
  "success": true,
  "error": null,
  "session_revoked": false
}
```

#### `POST /revoke`
Revoke a session.

#### `POST /redact_memory`
Redact a memory entry.

#### `GET /audit?session_id=uuid`
Get audit records for a session.

#### `GET /trust?user_id=patient_001`
Get trust score for a user.

## Demo Scenarios

Run the demo scripts to see the system in action:

```bash
python scripts/demo_scenarios.py
```

### Scenario 1: Happy Path
- Create triage memory
- Create session
- Ask questions
- View audit log and trust score

### Scenario 2: Cross-Zone Protection
- Create radiology memory
- Create triage memory
- Verify radiology memory is not accessible in triage zone
- Confirm audit log shows correct memory usage

### Scenario 3: Policy Violation & Revocation
- Create session
- Trigger policy violation
- Verify session revocation
- Check trust score decrease

### Scenario 4: Memory Redaction
- Create memory
- Use memory in inference
- Redact memory
- Verify memory is no longer accessible
- Confirm audit trail

## LLM Provider Configuration

The system supports multiple LLM providers. Configure your preferred provider:

### OpenAI
```bash
export LLM_PROVIDER=openai
export OPENAI_API_KEY=your-openai-api-key
export OPENAI_MODEL=gpt-3.5-turbo  # Optional, default: gpt-3.5-turbo
export OPENAI_TEMPERATURE=0.7      # Optional, default: 0.7
export OPENAI_MAX_TOKENS=500       # Optional, default: 500
```

### Google Gemini
```bash
export LLM_PROVIDER=gemini
export GEMINI_API_KEY=your-gemini-api-key  # Or use GOOGLE_API_KEY
export GEMINI_MODEL=gemini-pro             # Optional, default: gemini-pro
export GEMINI_TEMPERATURE=0.7              # Optional, default: 0.7
export GEMINI_MAX_TOKENS=500               # Optional, default: 500
```

**Note**: 
- For Gemini, you can use either `GEMINI_API_KEY` or `GOOGLE_API_KEY` environment variable
- The system will auto-detect the provider based on available API keys if `LLM_PROVIDER` is not explicitly set

## LCAC Policy Configuration

LCAC policies are defined in `backend/lcac.py`. Zones and allowed tags:

```python
ZONE_POLICIES = {
    "triage": ["symptoms", "vitals", "recent_visit"],
    "teleconsult": ["symptoms", "vitals", "recent_visit", "prescription"],
    "billing": ["billing_code", "insurance", "procedure"],
    "research": ["anonymized_data", "aggregate_stats"],
    "radiology": ["imaging_results", "radiology_report"],
}
```

## Trust Scoring

Trust scores start at 1.0 and are adjusted based on:
- **Policy violations**: -0.2 per violation
- **Successful inferences**: +0.05 per success
- **Minimum score**: 0.0
- **Maximum score**: 1.0

## Database Schema

### `memories`
- `id` (UUID): Primary key
- `zone` (text): Zone identifier
- `tags` (JSON): Array of tags
- `content` (text): Memory content
- `content_hash` (text): SHA256 hash for provenance
- `created_at` (datetime): Creation timestamp
- `redacted` (bool): Redaction flag

### `sessions`
- `session_id` (UUID): Primary key
- `zone` (text): Zone identifier
- `user_id` (text): User identifier
- `started_at` (datetime): Session start time
- `revoked_at` (datetime): Session revocation time (nullable)
- `metadata` (JSON): Session metadata

### `audits`
- `id` (UUID): Primary key
- `session_id` (UUID): Foreign key to sessions
- `timestamp` (datetime): Audit timestamp
- `prompt` (text): User prompt
- `response` (text): Agent response
- `used_memory_ids` (JSON): Array of memory IDs used
- `provenance_hash` (text): Hash for integrity verification
- `policy_violation` (bool): Violation flag
- `violation_reason` (text): Violation reason (nullable)

### `trust_scores`
- `user_id` (text): Primary key
- `score` (float): Trust score (0.0-1.0)
- `last_updated` (datetime): Last update timestamp
- `violation_count` (int): Number of violations
- `successful_inferences` (int): Number of successful inferences

## Testing

Run the demo scenarios:
```bash
python scripts/demo_scenarios.py
```

Run individual API tests with curl:
```bash
# Create a memory
curl -X POST "http://localhost:8000/memories" \
  -H "X-API-Key: dev-demo-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "triage",
    "tags": ["symptoms"],
    "content": "Patient reports chest pain."
  }'

# Create a session
curl -X POST "http://localhost:8000/sessions" \
  -H "X-API-Key: dev-demo-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "triage",
    "user_id": "patient_001"
  }'

# Ask a question
curl -X POST "http://localhost:8000/ask" \
  -H "X-API-Key: dev-demo-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "SESSION_UUID",
    "message": "What should I do about my chest pain?"
  }'
```

## Security Considerations

### MVP Limitations

This is an MVP demonstration. For production use, consider:

1. **Encryption**: Encrypt sensitive data at rest and in transit
2. **Authentication**: Implement proper user authentication (OAuth2, JWT)
3. **Authorization**: Fine-grained role-based access control
4. **PII Handling**: Implement proper PII detection and masking
5. **Audit Logging**: Secure, tamper-proof audit logs
6. **Rate Limiting**: Implement rate limiting to prevent abuse
7. **Input Validation**: Enhanced input validation and sanitization

### Privacy Compliance

- **GDPR**: Memory redaction supports right to erasure
- **HIPAA**: Structure supports HIPAA compliance (requires additional controls)
- **Audit Trail**: Complete audit trail for compliance reporting

## LCAC Framework Reference

This implementation is based on the [LCAC Framework](https://github.com/qstackfield/atomlabs-lcac-framework) by Atom Labs, extending Zero Trust principles into the cognitive layer.

### Core Principles

1. **Cognitive Least Privilege**: Limit what an AI agent can know based on contextual authorization
2. **Reasoning Isolation**: Prevent inference drift by isolating reasoning chains
3. **Cognitive Integrity**: Guarantee traceable, verifiable inferences
4. **Runtime Governance**: Embed ethical alignment and compliance into system logic
5. **Contextual Trust Anchors**: Dynamic, evidence-based reasoning limits

## Project Structure

```
.
├── backend/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database setup
│   ├── models.py            # SQLModel models
│   ├── lcac.py              # LCAC engine
│   ├── trust.py             # Trust scoring engine
│   └── orchestrator.py      # LangChain orchestrator
├── scripts/
│   ├── __init__.py
│   ├── init_db.py           # Database initialization
│   └── demo_scenarios.py    # Demo scenarios
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # This file
```

## Roadmap

### Future Enhancements

- [ ] Vector database integration (Milvus/Weaviate/PGVector) for semantic retrieval
- [ ] Enhanced PII detection and masking
- [ ] Multi-agent collaboration with LCAC governance
- [ ] Real-time trust score dashboard
- [ ] Advanced policy engine with rule-based and ML-based policies
- [ ] Integration with Electronic Health Records (EHR) systems
- [x] Support for multiple LLM providers (OpenAI, Gemini)
- [ ] Additional LLM providers (Anthropic, Cohere, etc.)

## License

MIT License

## Acknowledgments

- [LCAC Framework](https://github.com/qstackfield/atomlabs-lcac-framework) by Atom Labs
- LangChain for agent orchestration
- FastAPI for the web framework
- SQLModel for database modeling

## Contact

For questions or contributions, please open an issue on GitHub.

---

**Note**: This is an MVP demonstration. For production use, implement additional security controls, encryption, and compliance measures as required by your organization and regulatory requirements.

