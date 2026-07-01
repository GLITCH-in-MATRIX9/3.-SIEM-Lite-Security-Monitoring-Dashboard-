from database.queries import get_logs_by_event
from database.alerts import create_alert


def detect_privilege_escalation():

    logs = get_logs_by_event("PRIVILEGE_ESCALATION")

    for log in logs:

        print("\n🚨 ALERT: Privilege Escalation Detected")

        if log["sourceIp"]:
            print(f"Source IP: {log['sourceIp']}")

        print(f"Message: {log['rawMessage']}")
        create_alert(
        "Privilege Escalation",
        log["rawMessage"],
        "CRITICAL"
    )