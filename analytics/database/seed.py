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
if __name__ == "__main__":
    seed_users()
    seed_devices()
    seed_detection_rules()