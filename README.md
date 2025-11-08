# LCAC Clinical Triage Assistant

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/next.js-13%2B-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68%2B-blue.svg)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-0.1%2B-green.svg)](https://github.com/hwchase17/langchain)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5%2F4-green.svg)](https://openai.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-blue.svg)](https://ai.google/)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2.0%2B-blue.svg)](https://pydantic.dev/)

**Privacy-Preserving AI for Clinical Triage - Powered by Least-Context Access Control (LCAC)**

---

## Overview

The LCAC Clinical Triage Assistant implements the Least-Context Access Control (LCAC) framework to extend Zero Trust principles into the cognitive layer of AI systems. It ensures AI agents only access and reason about information authorized for their specific zone (e.g., triage, radiology, billing).

This system addresses the emerging challenge of contextual contamination in AI systems, where agents may carry or infer knowledge across domains in unintended ways. LCAC enforces reasoning isolation, ensuring every inference occurs within a bounded context of trust.

## Key Features

### Cognitive Security
- Zone-based memory access control
- Pre/post-inference LCAC policy enforcement
- Reasoning isolation to prevent inference drift
- Cognitive integrity with traceable, verifiable inferences

### Privacy & Compliance
- Full audit logging with provenance tracking
- Dynamic trust scoring based on policy compliance
- Session revocation on policy violations
- GDPR-compliant memory redaction

### Clinical Decision Support
- Multi-zone AI agents for specialized clinical domains
- Real-time monitoring of AI behavior and trust levels
- Comprehensive audit trail for regulatory compliance
- Support for multiple LLM providers (OpenAI, Google Gemini)

## Architecture

The system implements a three-layer control plane architecture:

1. **Data Plane**: Manages storage, retrieval, and access to factual data
2. **Model Plane**: Manages algorithmic inference, policy, and functional execution
3. **Cognitive Plane (LCAC)**: Governs reasoning, contextual recall, and information blending between agents

Each reasoning event is treated as a bounded transaction, with LCAC verifying cognitive integrity before and after inference to ensure no cross-context contamination occurs.

## Acknowledgements

This implementation utilizes the Least-Context Access Control (LCAC) framework developed by Quinton Stackfield at Atom Labs.

## Documentation

For detailed technical documentation, setup instructions, and API references, please refer to our specialized documentation:

- [Frontend Documentation](frontend/README.md) - Next.js 13+ Dashboard
- [Backend Documentation](backend/README.md) - FastAPI Framework

---

*© 2023 LCAC Clinical Triage Assistant. LCAC Framework is Copyright © 2023 Atom Labs.*