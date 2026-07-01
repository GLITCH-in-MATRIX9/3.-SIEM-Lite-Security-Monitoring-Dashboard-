from sqlalchemy import text
from database.db import engine


def seed_users():
    with engine.begin() as conn:

        conn.execute(text("""
        INSERT INTO users
        (
            id,
            email,
            username,
            password_hash,
            role,
            organization_id,
            updated_at
        )
        VALUES
        (
            'user-admin',
            'admin@siem.com',
            'admin',
            'dummy_password',
            'ADMIN',
            'ORG001',
            NOW()
        )
        ON CONFLICT (email) DO NOTHING;
        """))

        conn.execute(text("""
        INSERT INTO users
        (
            id,
            email,
            username,
            password_hash,
            role,
            organization_id,
            updated_at
        )
        VALUES
        (
            'user-analyst',
            'analyst@siem.com',
            'analyst',
            'dummy_password',
            'ANALYST',
            'ORG001',
            NOW()
        )
        ON CONFLICT (email) DO NOTHING;
        """))

    print("✅ Users seeded successfully")


def seed_devices():
    with engine.begin() as conn:

        conn.execute(text("""
        INSERT INTO "Device"
        (
            id,
            name,
            hostname,
            "ipAddress",
            "deviceType",
            status,
            "organizationId",
            "createdById",
            "createdAt",
            "updatedAt"
        )
        VALUES
        (
            'device-1',
            'Web Server',
            'server-01',
            '192.168.1.10',
            'SERVER',
            'ONLINE',
            'ORG001',
            'user-admin',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
        """))

        conn.execute(text("""
        INSERT INTO "Device"
        (
            id,
            name,
            hostname,
            "ipAddress",
            "deviceType",
            status,
            "organizationId",
            "createdById",
            "createdAt",
            "updatedAt"
        )
        VALUES
        (
            'device-2',
            'Firewall',
            'fw-01',
            '10.0.0.1',
            'FIREWALL',
            'ONLINE',
            'ORG001',
            'user-admin',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
        """))

        conn.execute(text("""
        INSERT INTO "Device"
        (
            id,
            name,
            hostname,
            "ipAddress",
            "deviceType",
            status,
            "organizationId",
            "createdById",
            "createdAt",
            "updatedAt"
        )
        VALUES
        (
            'device-3',
            'Workstation',
            'pc-01',
            '192.168.1.20',
            'WORKSTATION',
            'ONLINE',
            'ORG001',
            'user-analyst',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
        """))

    print("✅ Devices seeded successfully")



def seed_detection_rules():
    with engine.begin() as conn:

        rules = [
            (
                "rule-bruteforce",
                "Brute Force",
                "Detects repeated failed logins",
                "LOGIN_FAILURE",
                5,
                300,
                "CRITICAL"
            ),
            (
                "rule-portscan",
                "Port Scan",
                "Detects multiple destination ports",
                "PORT_SCAN",
                20,
                600,
                "HIGH"
            ),
            (
                "rule-privilege",
                "Privilege Escalation",
                "Detects sudo/admin escalation",
                "PRIVILEGE_ESCALATION",
                1,
                300,
                "CRITICAL"
            ),
            (
                "rule-login",
                "Suspicious Login",
                "Detects unusual login activity",
                "SUSPICIOUS_LOGIN",
                1,
                300,
                "HIGH"
            ),
            (
                "rule-lateral",
                "Lateral Movement",
                "Detects authentication across devices",
                "LATERAL_MOVEMENT",
                3,
                600,
                "HIGH"
            ),
            (
                "rule-process",
                "Suspicious Process",
                "Detects malicious processes",
                "SUSPICIOUS_PROCESS",
                1,
                300,
                "CRITICAL"
            ),
            (
                "rule-ml",
                "ML Anomaly",
                "Detects anomalous behavior using Isolation Forest",
                "ML_ANOMALY",
                1,
                0,
                "HIGH"
            )
        ]

        for rule in rules:

            conn.execute(text("""
                INSERT INTO "DetectionRule"
                (
                    id,
                    name,
                    description,
                    "eventType",
                    threshold,
                    "timeWindow",
                    severity,
                    enabled,
                    "createdAt",
                    "updatedAt"
                )
                VALUES
                (
                    :id,
                    :name,
                    :description,
                    :eventType,
                    :threshold,
                    :timeWindow,
                    :severity,
                    true,
                    NOW(),
                    NOW()
                )
                ON CONFLICT (id) DO NOTHING;
            """), {
                "id": rule[0],
                "name": rule[1],
                "description": rule[2],
                "eventType": rule[3],
                "threshold": rule[4],
                "timeWindow": rule[5],
                "severity": rule[6]
            })

    print("✅ Detection Rules seeded successfully")

from datetime import datetime, timedelta

def seed_logs():
    with engine.begin() as conn:

        current_time = datetime.now()

        logs = []

        # -------------------------------
        # Brute Force (6 failed logins)
        # -------------------------------
        for i in range(6):
            logs.append({
                "id": f"log-bf-{i}",
                "deviceId": "device-1",
                "severity": "HIGH",
                "source": "WINDOWS",
                "rawMessage": "Failed login for admin",
                "normalizedEvent": "LOGIN_FAILURE",
                "sourceIp": "192.168.1.10",
                "destinationIp": None,
                "eventTimestamp": current_time - timedelta(minutes=i)
            })

        # -------------------------------
        # Port Scan
        # -------------------------------
        ports = [22, 23, 25, 53, 80, 110, 135, 139, 143, 389]

        for i, port in enumerate(ports):
            logs.append({
                "id": f"log-ps-{i}",
                "deviceId": "device-2",
                "severity": "MEDIUM",
                "source": "FIREWALL",
                "rawMessage": f"Connection attempt to port {port}",
                "normalizedEvent": "PORT_SCAN",
                "sourceIp": "10.0.0.5",
                "destinationIp": f"192.168.1.{port % 255}",
                "eventTimestamp": current_time - timedelta(minutes=10+i)
            })

        # -------------------------------
        # Privilege Escalation
        # -------------------------------
        logs.append({
            "id": "log-priv-1",
            "deviceId": "device-1",
            "severity": "CRITICAL",
            "source": "LINUX",
            "rawMessage": "sudo access granted to admin",
            "normalizedEvent": "PRIVILEGE_ESCALATION",
            "sourceIp": "192.168.1.10",
            "destinationIp": None,
            "eventTimestamp": current_time
        })

        # -------------------------------
        # Suspicious Login
        # -------------------------------
        logs.append({
            "id": "log-login-1",
            "deviceId": "device-3",
            "severity": "HIGH",
            "source": "APPLICATION",
            "rawMessage": "User john logged in from Russia",
            "normalizedEvent": "SUSPICIOUS_LOGIN",
            "sourceIp": "45.10.20.30",
            "destinationIp": None,
            "eventTimestamp": current_time
        })

        # -------------------------------
        # Lateral Movement
        # -------------------------------
        logs.append({
            "id": "log-lateral-1",
            "deviceId": "device-3",
            "severity": "HIGH",
            "source": "WINDOWS",
            "rawMessage": "john authenticated to multiple systems",
            "normalizedEvent": "LATERAL_MOVEMENT",
            "sourceIp": "192.168.1.20",
            "destinationIp": "192.168.1.30",
            "eventTimestamp": current_time
        })

        # -------------------------------
        # Suspicious Process
        # -------------------------------
        logs.append({
            "id": "log-proc-1",
            "deviceId": "device-1",
            "severity": "CRITICAL",
            "source": "WINDOWS",
            "rawMessage": "mimikatz.exe executed",
            "normalizedEvent": "SUSPICIOUS_PROCESS",
            "sourceIp": "192.168.1.10",
            "destinationIp": None,
            "eventTimestamp": current_time
        })

        # -------------------------------
        # Normal Logs
        # -------------------------------
        for i in range(5):
            logs.append({
                "id": f"log-normal-{i}",
                "deviceId": "device-3",
                "severity": "INFO",
                "source": "APPLICATION",
                "rawMessage": "Normal user activity",
                "normalizedEvent": "NORMAL_ACTIVITY",
                "sourceIp": "192.168.1.50",
                "destinationIp": None,
                "eventTimestamp": current_time - timedelta(hours=i)
            })

        for log in logs:
            conn.execute(
                text("""
                INSERT INTO "Log"
                (
                    id,
                    "deviceId",
                    severity,
                    source,
                    "rawMessage",
                    "normalizedEvent",
                    "sourceIp",
                    "destinationIp",
                    "eventTimestamp",
                    "createdAt"
                )
                VALUES
                (
                    :id,
                    :deviceId,
                    :severity,
                    :source,
                    :rawMessage,
                    :normalizedEvent,
                    :sourceIp,
                    :destinationIp,
                    :eventTimestamp,
                    NOW()
                )
                ON CONFLICT (id) DO NOTHING;
                """),
                log
            )

    print(f"✅ {len(logs)} Logs seeded successfully")
if __name__ == "__main__":
    seed_users()
    seed_devices()
    seed_detection_rules()
    seed_logs()