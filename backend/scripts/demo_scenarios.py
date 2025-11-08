"""Demo scripts for the 4 main scenarios."""

import requests
import json
import time
from typing import Dict, Optional

# API Configuration
BASE_URL = "http://localhost:8000"
API_KEY = "dev-demo-key-change-in-production"

headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}


def print_response(title: str, response: requests.Response):
    """Print formatted response."""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
    print(f"{'='*60}\n")


def scenario_1_happy_path():
    """Scenario 1: Happy path - create triage memory and ask questions."""
    print("\n" + "="*60)
    print("SCENARIO 1: HAPPY PATH")
    print("="*60)
    
    # Step 1: Create a triage memory
    print("\n1. Creating triage memory...")
    memory_data = {
        "zone": "triage",
        "tags": ["symptoms", "vitals"],
        "content": "Patient reports chest pain for 2 days. Blood pressure: 140/90. Heart rate: 88 bpm."
    }
    response = requests.post(f"{BASE_URL}/memories", headers=headers, json=memory_data)
    print_response("Create Memory", response)
    memory_id = response.json()["id"]
    
    # Step 2: Create a session
    print("\n2. Creating triage session...")
    session_data = {
        "zone": "triage",
        "user_id": "patient_001",
        "metadata": {"department": "emergency"}
    }
    response = requests.post(f"{BASE_URL}/sessions", headers=headers, json=session_data)
    print_response("Create Session", response)
    session_id = response.json()["session_id"]
    
    # Step 3: Ask a question
    print("\n3. Asking triage question...")
    ask_data = {
        "session_id": session_id,
        "message": "What should I do about my chest pain?"
    }
    response = requests.post(f"{BASE_URL}/ask", headers=headers, json=ask_data)
    print_response("Ask Question", response)
    audit_id = response.json()["audit_id"]
    
    # Step 4: Check audit log
    print("\n4. Checking audit log...")
    response = requests.get(f"{BASE_URL}/audit?session_id={session_id}", headers=headers)
    print_response("Audit Log", response)
    
    # Step 5: Check trust score
    print("\n5. Checking trust score...")
    response = requests.get(f"{BASE_URL}/trust?user_id=patient_001", headers=headers)
    print_response("Trust Score", response)
    
    return session_id, memory_id


def scenario_2_cross_zone_protection():
    """Scenario 2: Cross-zone protection - radiology memory should not be accessible in triage."""
    print("\n" + "="*60)
    print("SCENARIO 2: CROSS-ZONE PROTECTION")
    print("="*60)
    
    # Step 1: Create a radiology memory
    print("\n1. Creating radiology memory...")
    memory_data = {
        "zone": "radiology",
        "tags": ["imaging_results", "radiology_report"],
        "content": "Chest X-ray shows no acute disease. Lungs are clear."
    }
    response = requests.post(f"{BASE_URL}/memories", headers=headers, json=memory_data)
    print_response("Create Radiology Memory", response)
    radiology_memory_id = response.json()["id"]
    
    # Step 2: Create a triage memory
    print("\n2. Creating triage memory...")
    memory_data = {
        "zone": "triage",
        "tags": ["symptoms"],
        "content": "Patient reports persistent cough for 1 week."
    }
    response = requests.post(f"{BASE_URL}/memories", headers=headers, json=memory_data)
    print_response("Create Triage Memory", response)
    
    # Step 3: Create a triage session
    print("\n3. Creating triage session...")
    session_data = {
        "zone": "triage",
        "user_id": "patient_002",
        "metadata": {}
    }
    response = requests.post(f"{BASE_URL}/sessions", headers=headers, json=session_data)
    print_response("Create Session", response)
    session_id = response.json()["session_id"]
    
    # Step 4: Check which memories are accessible in triage zone
    print("\n4. Checking accessible memories in triage zone...")
    response = requests.get(f"{BASE_URL}/memories?zone=triage", headers=headers)
    print_response("Memories in Triage Zone", response)
    memories = response.json()
    memory_ids = [m["id"] for m in memories]
    
    # Verify radiology memory is NOT in the list
    if radiology_memory_id in memory_ids:
        print(f"⚠️  WARNING: Radiology memory {radiology_memory_id} is accessible in triage zone!")
    else:
        print(f"✓ Radiology memory {radiology_memory_id} is correctly filtered out.")
    
    # Step 5: Ask a question - should not reference radiology
    print("\n5. Asking question in triage session...")
    ask_data = {
        "session_id": session_id,
        "message": "What do you know about my condition?"
    }
    response = requests.post(f"{BASE_URL}/ask", headers=headers, json=ask_data)
    print_response("Ask Question", response)
    
    # Step 6: Check audit to verify radiology memory was not used
    print("\n6. Checking audit log to verify memory usage...")
    response = requests.get(f"{BASE_URL}/audit?session_id={session_id}", headers=headers)
    print_response("Audit Log", response)
    audit = response.json()[0]
    used_memory_ids = audit["used_memory_ids"]
    
    if radiology_memory_id in used_memory_ids:
        print(f"⚠️  VIOLATION: Radiology memory was used in triage session!")
    else:
        print(f"✓ Radiology memory was correctly excluded from inference.")
    
    return session_id, radiology_memory_id


def scenario_3_policy_violation():
    """Scenario 3: Policy violation and revocation."""
    print("\n" + "="*60)
    print("SCENARIO 3: POLICY VIOLATION & REVOCATION")
    print("="*60)
    
    # Step 1: Create a session
    print("\n1. Creating session...")
    session_data = {
        "zone": "triage",
        "user_id": "patient_003",
        "metadata": {}
    }
    response = requests.post(f"{BASE_URL}/sessions", headers=headers, json=session_data)
    print_response("Create Session", response)
    session_id = response.json()["session_id"]
    
    # Step 2: Check initial trust score
    print("\n2. Checking initial trust score...")
    response = requests.get(f"{BASE_URL}/trust?user_id=patient_003", headers=headers)
    print_response("Initial Trust Score", response)
    initial_score = response.json()["score"]
    
    # Step 3: Try to ask a question that might trigger violation
    # (In a real scenario, this would be detected by post-inference validation)
    print("\n3. Asking question...")
    ask_data = {
        "session_id": session_id,
        "message": "Tell me about radiology results and billing information."
    }
    response = requests.post(f"{BASE_URL}/ask", headers=headers, json=ask_data)
    print_response("Ask Question (Potential Violation)", response)
    
    # Step 4: Check if session was revoked
    print("\n4. Checking session status...")
    # We can't directly check session status via API, but we can try another ask
    ask_data2 = {
        "session_id": session_id,
        "message": "Follow-up question"
    }
    response = requests.post(f"{BASE_URL}/ask", headers=headers, json=ask_data2)
    print_response("Follow-up Question (Should Fail if Revoked)", response)
    
    # Step 5: Check trust score after violation
    print("\n5. Checking trust score after violation...")
    response = requests.get(f"{BASE_URL}/trust?user_id=patient_003", headers=headers)
    print_response("Trust Score After Violation", response)
    new_score = response.json()["score"]
    
    if new_score < initial_score:
        print(f"✓ Trust score decreased from {initial_score} to {new_score}")
    else:
        print(f"⚠️  Trust score did not decrease (still {new_score})")
    
    # Step 6: Check audit for violation
    print("\n6. Checking audit log for violations...")
    response = requests.get(f"{BASE_URL}/audit?session_id={session_id}", headers=headers)
    print_response("Audit Log with Violations", response)
    
    return session_id


def scenario_4_redaction():
    """Scenario 4: Memory redaction."""
    print("\n" + "="*60)
    print("SCENARIO 4: MEMORY REDACTION")
    print("="*60)
    
    # Step 1: Create a memory
    print("\n1. Creating memory...")
    memory_data = {
        "zone": "triage",
        "tags": ["symptoms", "recent_visit"],
        "content": "Patient visited clinic last week with complaint of headaches. Prescribed medication."
    }
    response = requests.post(f"{BASE_URL}/memories", headers=headers, json=memory_data)
    print_response("Create Memory", response)
    memory_id = response.json()["id"]
    
    # Step 2: Create a session
    print("\n2. Creating session...")
    session_data = {
        "zone": "triage",
        "user_id": "patient_004",
        "metadata": {}
    }
    response = requests.post(f"{BASE_URL}/sessions", headers=headers, json=session_data)
    print_response("Create Session", response)
    session_id = response.json()["session_id"]
    
    # Step 3: Ask a question using the memory
    print("\n3. Asking question before redaction...")
    ask_data = {
        "session_id": session_id,
        "message": "What do you know about my recent visit?"
    }
    response = requests.post(f"{BASE_URL}/ask", headers=headers, json=ask_data)
    print_response("Ask Question (Before Redaction)", response)
    
    # Step 4: Check that memory is accessible
    print("\n4. Checking memory before redaction...")
    response = requests.get(f"{BASE_URL}/memories?zone=triage", headers=headers)
    memories = response.json()
    memory = next((m for m in memories if m["id"] == memory_id), None)
    if memory:
        print(f"Memory content: {memory['content']}")
        print(f"Redacted: {memory['redacted']}")
    
    # Step 5: Redact the memory
    print("\n5. Redacting memory...")
    redact_data = {
        "entry_id": memory_id,
        "reason": "Patient requested data deletion per GDPR"
    }
    response = requests.post(f"{BASE_URL}/redact_memory", headers=headers, json=redact_data)
    print_response("Redact Memory", response)
    
    # Step 6: Check that memory is now redacted
    print("\n6. Checking memory after redaction...")
    response = requests.get(f"{BASE_URL}/memories?zone=triage", headers=headers)
    memories = response.json()
    memory = next((m for m in memories if m["id"] == memory_id), None)
    if memory:
        print(f"Memory content: {memory['content']}")
        print(f"Redacted: {memory['redacted']}")
        if memory['redacted']:
            print("✓ Memory is now redacted")
        else:
            print("⚠️  Memory was not redacted")
    
    # Step 7: Ask the same question again - should not use redacted memory
    print("\n7. Asking question after redaction...")
    ask_data2 = {
        "session_id": session_id,
        "message": "What do you know about my recent visit?"
    }
    response = requests.post(f"{BASE_URL}/ask", headers=headers, json=ask_data2)
    print_response("Ask Question (After Redaction)", response)
    
    # Step 8: Check audit to verify memory was not used
    print("\n8. Checking audit log...")
    response = requests.get(f"{BASE_URL}/audit?session_id={session_id}", headers=headers)
    print_response("Audit Log", response)
    
    return session_id, memory_id


def main():
    """Run all demo scenarios."""
    print("\n" + "="*80)
    print("PRIVACY-SAFE AGENTIC CLINICAL TRIAGE ASSISTANT - DEMO SCENARIOS")
    print("="*80)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/", headers=headers)
        if response.status_code != 200:
            print(f"⚠️  Server returned status {response.status_code}")
            return
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to server at {BASE_URL}")
        print("Please start the server first: uvicorn backend.main:app --reload")
        return
    
    print("✓ Server is running\n")
    
    # Run scenarios
    try:
        scenario_1_happy_path()
        time.sleep(1)
        
        scenario_2_cross_zone_protection()
        time.sleep(1)
        
        scenario_3_policy_violation()
        time.sleep(1)
        
        scenario_4_redaction()
        
        print("\n" + "="*80)
        print("ALL DEMO SCENARIOS COMPLETED")
        print("="*80)
        
    except Exception as e:
        print(f"\n❌ Error running scenarios: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

