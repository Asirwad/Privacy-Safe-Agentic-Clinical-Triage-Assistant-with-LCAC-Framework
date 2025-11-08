# Quick Start Guide

## Prerequisites

- Python 3.11+
- LLM API key (optional, for LLM functionality):
  - **OpenAI API key** OR
  - **Google Gemini API key**

## Installation (5 minutes)

### Option 1: Using the startup script

**Windows:**
```bash
run.bat
```

**Linux/Mac:**
```bash
chmod +x run.sh
./run.sh
```

### Option 2: Manual setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up LLM provider (choose one):**

**Option 1: OpenAI**
```bash
export LLM_PROVIDER=openai
export OPENAI_API_KEY=your-openai-api-key-here
```

**Option 2: Google Gemini**
```bash
export LLM_PROVIDER=gemini
export GEMINI_API_KEY=your-gemini-api-key-here
# OR use GOOGLE_API_KEY (standard LangChain env var)
export GOOGLE_API_KEY=your-gemini-api-key-here
```

4. **Initialize database:**
```bash
python scripts/init_db.py
```

5. **Start server:**
```bash
uvicorn backend.main:app --reload
```

## Quick Test

### 1. Create a memory
```bash
curl -X POST "http://localhost:8000/memories" \
  -H "X-API-Key: dev-demo-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "triage",
    "tags": ["symptoms"],
    "content": "Patient reports chest pain."
  }'
```

### 2. Create a session
```bash
curl -X POST "http://localhost:8000/sessions" \
  -H "X-API-Key: dev-demo-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "triage",
    "user_id": "patient_001"
  }'
```

**Save the `session_id` from the response.**

### 3. Ask a question
```bash
curl -X POST "http://localhost:8000/ask" \
  -H "X-API-Key: dev-demo-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "YOUR_SESSION_ID",
    "message": "What should I do about my chest pain?"
  }'
```

### 4. Check audit log
```bash
curl -X GET "http://localhost:8000/audit?session_id=YOUR_SESSION_ID" \
  -H "X-API-Key: dev-demo-key-change-in-production"
```

### 5. Check trust score
```bash
curl -X GET "http://localhost:8000/trust?user_id=patient_001" \
  -H "X-API-Key: dev-demo-key-change-in-production"
```

## Run Demo Scenarios

Run all 4 demo scenarios:
```bash
python scripts/demo_scenarios.py
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Docker Quick Start

```bash
docker-compose up --build
```

## Troubleshooting

### Server won't start
- Check if port 8000 is available
- Verify Python version: `python --version` (should be 3.11+)
- Check if all dependencies are installed: `pip list`

### LLM API errors
- Set `LLM_PROVIDER` environment variable (`openai` or `gemini`)
- Set the corresponding API key:
  - `OPENAI_API_KEY` for OpenAI
  - `GEMINI_API_KEY` or `GOOGLE_API_KEY` for Gemini
- Or update `.env` file with your API key
- The system will work without LLM (with limited functionality)
- Check the server logs for LLM initialization warnings

### Database errors
- Delete `clinical_triage.db` and run `python scripts/init_db.py` again
- Check file permissions in the project directory

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Explore the API documentation at http://localhost:8000/docs
3. Run the demo scenarios to see LCAC in action
4. Review the LCAC framework: https://github.com/qstackfield/atomlabs-lcac-framework

## Support

For issues or questions, please open an issue on GitHub.

