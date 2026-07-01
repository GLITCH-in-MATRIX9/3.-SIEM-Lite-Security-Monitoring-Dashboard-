import numpy as np
from sklearn.ensemble import IsolationForest

from database.queries import get_log_features
from database.alerts import create_alert


severity_map = {
    "INFO": 1,
    "LOW": 2,
    "MEDIUM": 3,
    "HIGH": 4,
    "CRITICAL": 5
}

source_map = {
    "WINDOWS": 1,
    "LINUX": 2,
    "FIREWALL": 3,
    "APPLICATION": 4,
    "CLOUD": 5
}


def run_ml_detection():

    logs = get_log_features()

    if not logs:
        print("No logs available.")
        return

    features = []

    for log in logs:

        severity = severity_map.get(log["severity"], 1)
        source = source_map.get(log["source"], 0)
        hour = log["eventTimestamp"].hour

        features.append([
            severity,
            source,
            hour
        ])

    X = np.array(features)

    model = IsolationForest(
        contamination=0.1,
        random_state=42
    )

    predictions = model.fit_predict(X)

    anomalies = X[predictions == -1]

    print("\n===== ML Detection =====")

    if len(anomalies):

        print(f"🚨 {len(anomalies)} anomalous event(s) detected")

        create_alert(
            "ML Anomaly",
            f"{len(anomalies)} anomalous event(s) detected by Isolation Forest",
            "HIGH"
        )

    else:

        print("No anomalies detected.")