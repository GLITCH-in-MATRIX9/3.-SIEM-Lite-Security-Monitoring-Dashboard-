from sqlalchemy import text
from database.db import engine


def get_all_logs():
    """
    Fetch all logs from PostgreSQL.
    """

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT *
            FROM "Log"
            ORDER BY "eventTimestamp" DESC;
        """))

        return result.mappings().all()


def get_logs_by_event(event_name):
    """
    Fetch logs by normalized event.
    """

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT *
                FROM "Log"
                WHERE "normalizedEvent" = :event
                ORDER BY "eventTimestamp" DESC;
            """),
            {
                "event": event_name
            }
        )

        return result.mappings().all()


def get_failed_logins():
    """
    Fetch failed login events.
    """

    return get_logs_by_event("LOGIN_FAILURE")
def get_log_features():
    """
    Fetch features required for ML from PostgreSQL.
    """

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT
                    severity,
                    source,
                    "eventTimestamp"
                FROM "Log";
            """)
        )

        return result.mappings().all()