from database.queries import get_all_logs

logs = get_all_logs()

print("Total Logs:", len(logs))

for log in logs:
    print(log)