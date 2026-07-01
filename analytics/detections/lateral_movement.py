from database.queries import get_logs_by_event
from database.alerts import create_alert


def detect_lateral_movement():

    logs = get_logs_by_event("LATERAL_MOVEMENT")

    systems = {}

    for log in logs:

        ip = log["destinationIp"]

        if ip not in systems:
            systems[ip] = 1
        else:
            systems[ip] += 1

    if len(systems) >= 1:

        print("\n🚨 ALERT: Possible Lateral Movement")
        print(f"Systems Accessed: {len(systems)}")

        for ip in systems:
            print(f"Destination: {ip}")
            create_alert(
            "Lateral Movement",
            "User authenticated across multiple systems",
            "HIGH"
        )