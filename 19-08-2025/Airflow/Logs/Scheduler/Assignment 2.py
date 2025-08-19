# File: dags/data_audit_dag.py

from datetime import datetime, timedelta
import json, random, logging
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator

# ---- Config ----
AUDIT_FILE = "/tmp/audit_result.json"

default_args = {
    "owner": "audit_team",
    "email": ["alerts@company.com"],
    "email_on_failure": True,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

# === Task 1: Data Pull ===
def _pull_data(**context):
    """Simulates pulling data from API/DB by generating dummy records"""
    sample_data = {
        "record_id": random.randint(1000, 2000),
        "value": random.randint(10, 200),   # simulate business metric
        "timestamp": datetime.now().isoformat(),
    }
    logging.info(f"Pulled data: {sample_data}")
    return sample_data

# === Task 2: Audit Validation ===
def _validate(**context):
    """Validates a simple business rule: value must be > 50"""
    ti = context["ti"]
    data = ti.xcom_pull(task_ids="pull_data")

    rule_passed = data["value"] > 50
    result = {"data": data, "passed": rule_passed}
    with open(AUDIT_FILE, "w") as f:
        json.dump(result, f, indent=2)

    if not rule_passed:
        raise ValueError(f"Audit failed: value={data['value']} (<= 50)")
    logging.info(f"Audit passed: {result}")
    return result

# === Task 3: Logging Results ===
log_audit = BashOperator(
    task_id="log_audit",
    bash_command=f'echo "Audit result stored at {AUDIT_FILE}" && cat {AUDIT_FILE}',
)

# === Task 4: Final Status Update ===
def _final_status(**context):
    """Logs final audit status"""
    with open(AUDIT_FILE, "r") as f:
        result = json.load(f)
    if result["passed"]:
        logging.info("✅ Final Status: Audit SUCCESS")
    else:
        logging.error("❌ Final Status: Audit FAILURE")

with DAG(
    dag_id="data_audit_dag",
    description="Simulated event-driven audit flow with validation and logging",
    schedule_interval="@hourly",    # runs every hour
    start_date=datetime(2023, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=["audit", "etl", "demo"],
) as dag:

    pull_data = PythonOperator(
        task_id="pull_data",
        python_callable=_pull_data,
    )

    validate_data = PythonOperator(
        task_id="validate_data",
        python_callable=_validate,
    )

    final_status = PythonOperator(
        task_id="final_status",
        python_callable=_final_status,
    )

    # Task dependencies
    pull_data >> validate_data >> log_audit >> final_status
