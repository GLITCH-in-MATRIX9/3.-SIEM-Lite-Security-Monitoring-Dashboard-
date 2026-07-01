from database.queries import get_logs_by_event
from database.alerts import create_alert


def detect_suspicious_process():

    logs = get_logs_by_event("SUSPICIOUS_PROCESS")

    suspicious_processes = [
        "mimikatz.exe",
        "powershell.exe"
    ]

    for log in logs:

        message = log["rawMessage"].lower()

        for process in suspicious_processes:

            if process.lower() in message:

                print("\n🚨 ALERT: Suspicious Process Detected")
                print(f"Process: {process}")
                print(f"Source IP: {log['sourceIp']}")
                print(f"Message: {log['rawMessage']}")
                create_alert(
                "Suspicious Process",
                log["rawMessage"],
                "CRITICAL"
            )