"""Initialize database with sample data."""

import sys
import os
# Add the parent directory to the path so we can import from app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import init_db, get_session
from app.models import Memory, Session as SessionModel, TrustScore
from app.lcac import LCACPolicy
import hashlib
from datetime import datetime


def create_sample_data():
    """Create sample data for testing."""
    session = next(get_session())
    
    # Create sample memories
    memories = [
        {
            "zone": "triage",
            "tags": ["symptoms", "vitals"],
            "content": "Patient reports chest pain for 2 days. Blood pressure: 140/90. Heart rate: 88 bpm."
        },
        {
            "zone": "triage",
            "tags": ["symptoms"],
            "content": "Patient reports persistent cough for 1 week."
        },
        {
            "zone": "radiology",
            "tags": ["imaging_results", "radiology_report"],
            "content": "Chest X-ray shows no acute disease. Lungs are clear."
        },
        {
            "zone": "billing",
            "tags": ["billing_code", "procedure"],
            "content": "Procedure code: 99213. Insurance: Blue Cross Blue Shield."
        },
    ]
    
    print("Creating sample memories...")
    for mem_data in memories:
        content_hash = hashlib.sha256(mem_data["content"].encode()).hexdigest()
        memory = Memory(
            zone=mem_data["zone"],
            content=mem_data["content"],
            content_hash=content_hash
        )
        memory.set_tags(mem_data["tags"])
        session.add(memory)
        print(f"  - Created memory in zone '{mem_data['zone']}' with tags {mem_data['tags']}")
    
    session.commit()
    print("✓ Sample memories created\n")


def main():
    """Initialize database."""
    print("Initializing database...")
    init_db()
    print("✓ Database initialized\n")
    
    create_sample_data()
    
    print("✓ Database setup complete!")


if __name__ == "__main__":
    main()