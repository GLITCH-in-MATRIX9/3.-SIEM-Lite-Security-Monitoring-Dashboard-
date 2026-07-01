from sqlalchemy import text
from database.db import engine


def create_alert(title, description, severity):

    with engine.begin() as conn:

        # Get Detection Rule
        rule = conn.execute(
            text("""
                SELECT id
                FROM "DetectionRule"
                WHERE name = :name
                LIMIT 1
            """),
            {"name": title}
        ).fetchone()

        # Get latest log
        log = conn.execute(
            text("""
                SELECT id
                FROM "Log"
                ORDER BY "eventTimestamp" DESC
                LIMIT 1
            """)
        ).fetchone()

        if not rule or not log:
            return

        # -------- ALERT DEDUPLICATION --------
        existing = conn.execute(
            text("""
                SELECT id
                FROM "Alert"
                WHERE title = :title
                  AND status = 'OPEN'
                LIMIT 1
            """),
            {
                "title": title
            }
        ).fetchone()

        if existing:
            print("⚠️ Alert already exists. Skipping duplicate.")
            return

        # -------- INSERT ALERT --------
        conn.execute(
            text("""
                INSERT INTO "Alert"
                (
                    id,
                    title,
                    description,
                    severity,
                    status,
                    "ruleId",
                    "logId",
                    "createdAt",
                    "updatedAt"
                )
                VALUES
                (
                    CONCAT('alert-', FLOOR(RANDOM()*1000000)),
                    :title,
                    :description,
                    :severity,
                    'OPEN',
                    :ruleId,
                    :logId,
                    NOW(),
                    NOW()
                )
            """),
            {
                "title": title,
                "description": description,
                "severity": severity,
                "ruleId": rule[0],
                "logId": log[0]
            }
        )

        print("✅ Alert inserted into PostgreSQL")