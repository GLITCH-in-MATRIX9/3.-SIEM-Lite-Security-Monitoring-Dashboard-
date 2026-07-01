from collections import defaultdict
from database.queries import get_logs_by_event
from database.alerts import create_alert


def detect_port_scan():

    logs = get_logs_by_event("PORT_SCAN")

    scanned_ports = defaultdict(set)

    for log in logs:

        ip = log["sourceIp"]

        raw_message = log["rawMessage"]

        try:
            port = int(raw_message.split()[-1])
        except:
            continue

        scanned_ports[ip].add(port)

    for ip, ports in scanned_ports.items():

        if len(ports) >= 3:

            print("\n🚨 ALERT: Possible Port Scan Attack")
            print(f"IP Address: {ip}")
            print(f"Ports Scanned: {len(ports)}")
            create_alert(
            "Port Scan",
            f"Detected {len(ports)} scanned ports from {ip}",
            "HIGH"
        )