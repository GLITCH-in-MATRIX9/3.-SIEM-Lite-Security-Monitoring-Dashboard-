from database.queries import get_logs_by_event
from database.alerts import create_alert


def detect_suspicious_login():

    logs = get_logs_by_event("SUSPICIOUS_LOGIN")

    for log in logs:

        print("\n🚨 ALERT: Suspicious Login")

        print(f"Source IP: {log['sourceIp']}")

        print(f"Message: {log['rawMessage']}")

        if log["eventTimestamp"]:
            print(f"Time: {log['eventTimestamp']}")
            create_alert(
            "Suspicious Login",
            log["rawMessage"],
            "HIGH"
        )