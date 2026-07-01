# SIEM Lite Analytics Engine Documentation

## Overview

The Analytics Engine is responsible for continuously analyzing security logs stored in Neon PostgreSQL, detecting suspicious activities, generating alerts, and performing anomaly detection using Machine Learning.

---

# Technology Stack

- Python 3.x
- PostgreSQL (Neon)
- SQLAlchemy
- Scikit-Learn
- NumPy

---

# Database Integration

The analytics engine connects to the Neon PostgreSQL database using SQLAlchemy.

Database tables used:

- User
- Device
- Log
- DetectionRule
- Alert

---

# Detection Rules

## 1. Brute Force Detection

Purpose:
Detect repeated failed login attempts from the same IP address.

Logic:

- Fetch LOGIN_FAILURE events
- Count failed logins by source IP
- If failed attempts >= 5
- Generate CRITICAL alert

Severity:
CRITICAL

---

## 2. Port Scan Detection

Purpose:
Detect scanning of multiple destination ports from a single IP.

Logic:

- Fetch PORT_SCAN events
- Count unique destination ports
- If ports scanned exceed threshold
- Generate HIGH alert

Severity:
HIGH

---

## 3. Privilege Escalation Detection

Purpose:
Detect administrative privilege escalation attempts.

Logic:

- Fetch PRIVILEGE_ESCALATION events
- Generate alert whenever event exists

Severity:
CRITICAL

---

## 4. Suspicious Login Detection

Purpose:
Detect suspicious login events.

Logic:

- Detect login from unusual location or suspicious source
- Generate HIGH alert

Severity:
HIGH

---

## 5. Lateral Movement Detection

Purpose:
Detect authentication across multiple systems.

Logic:

- Monitor authentication events
- Detect movement between devices
- Generate HIGH alert

Severity:
HIGH

---

## 6. Suspicious Process Detection

Purpose:
Detect execution of malicious processes.

Example:

- mimikatz.exe

Severity:
CRITICAL

---

## 7. Machine Learning Detection

Algorithm:

Isolation Forest

Purpose:

Detect anomalous log behaviour using machine learning.

Features Used

- Event Severity
- Event Source
- Event Hour

Output

- Detect anomalous events
- Generate ML Anomaly alert

Severity:
HIGH

---

# Alert Management

Whenever a detection rule is triggered:

1. Detection rule executes
2. Alert is created
3. Alert is stored in PostgreSQL

Alert fields:

- Title
- Description
- Severity
- Rule ID
- Log ID
- Timestamp

---

# Alert Deduplication

To prevent duplicate alerts:

- Existing OPEN alerts are checked
- Duplicate alerts are ignored
- Only new incidents generate alerts

---

# Detection Engine

The analytics engine executes the following modules:

- Brute Force Detection
- Port Scan Detection
- Privilege Escalation Detection
- Suspicious Login Detection
- Lateral Movement Detection
- Suspicious Process Detection
- Isolation Forest ML Detection

---

# Testing

The following modules were tested successfully:

- Database Connectivity
- Log Retrieval
- Detection Rules
- Alert Creation
- Alert Deduplication
- Machine Learning Detection

---

# Future Improvements

- Real-time log streaming
- Email notifications
- Dashboard visualization
- Advanced ML models
- Threat intelligence integration

---

# Project Outcome

Successfully developed a Python-based SIEM Analytics Engine integrated with Neon PostgreSQL capable of:

- Processing security logs
- Detecting cyber attacks
- Generating alerts
- Preventing duplicate alerts
- Performing anomaly detection using Isolation Forest