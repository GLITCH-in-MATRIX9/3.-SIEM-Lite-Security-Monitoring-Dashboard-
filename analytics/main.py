import schedule
import time

from detections.brute_force import detect_brute_force
from detections.port_scan import detect_port_scan
from detections.privilege_escalation import detect_privilege_escalation
from detections.suspicious_login import detect_suspicious_login
from detections.lateral_movement import detect_lateral_movement
from detections.suspicious_process import detect_suspicious_process
from ml.isolation_forest import run_ml_detection


def run_all_detections():

    print("\n==============================")
    print("Running Detection Engine")
    print("==============================")

    detections = [
        ("Brute Force", detect_brute_force),
        ("Port Scan", detect_port_scan),
        ("Privilege Escalation", detect_privilege_escalation),
        ("Suspicious Login", detect_suspicious_login),
        ("Lateral Movement", detect_lateral_movement),
        ("Suspicious Process", detect_suspicious_process),
        ("ML Detection", run_ml_detection)
    ]

    for name, detection in detections:

        try:
            print(f"\nRunning {name}...")

            detection()

            print(f"✅ {name} Complete")

        except Exception as e:

            print(f"❌ {name} Failed")
            print(e)

    print("\n==============================")
    print("Detection Cycle Complete")
    print("==============================")


# schedule.every(60).seconds.do(run_all_detections)

print("🚀 SIEM Analytics Engine Started")

run_all_detections()

# while True:
#     schedule.run_pending()
#     time.sleep(1)