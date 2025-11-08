#!/bin/bash

# Startup script for the Clinical Triage Assistant Backend

echo "Starting Privacy-Safe Agentic Clinical Triage Assistant Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
python scripts/init_db.py

# Start server
echo "Starting server..."
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

