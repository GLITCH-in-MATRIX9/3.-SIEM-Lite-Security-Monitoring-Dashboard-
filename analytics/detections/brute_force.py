from collections import defaultdict
from database.queries import get_failed_logins
from database.alerts import create_alert


def detect_brute_force():

    logs = get_failed_logins()

    failed_attempts = defaultdict(int)

    for log in logs:

        ip = log["sourceIp"]

        failed_attempts[ip] += 1

    for ip, count in failed_attempts.items():

        if count >= 5:

            print("\n🚨 ALERT: Possible Brute Force Attack")
            print(f"IP Address: {ip}")
            print(f"Failed Attempts: {count}")
            from collections import defaultdict
from database.queries import get_failed_logins
from database.alerts import create_alert


def detect_brute_force():

    logs = get_failed_logins()

    failed_attempts = defaultdict(int)

    for log in logs:

        ip = log["sourceIp"]

        failed_attempts[ip] += 1

    for ip, count in failed_attempts.items():

        if count >= 5:

            print("\n🚨 ALERT: Possible Brute Force Attack")
            print(f"IP Address: {ip}")
            print(f"Failed Attempts: {count}")
            create_alert(
            "Brute Force",
            f"Detected {count} failed logins from {ip}",
            "CRITICAL"
        )