from datetime import datetime, timedelta
import logging
import os
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator

# ---- Config ----
RAW_PATH = "/tmp/airflow_raw.csv"
CLEAN_PATH = "/tmp/airflow_clean.csv"
WAREHOUSE_PATH = "/tmp/warehouse.csv"

default_args = {
    "owner": "airflow",
    "retries": 1,
    "retry_delay": timedelta(minutes=1),
}

# === Task Function: Transform ===
def _transform(**context):
    import csv
    logger = logging.getLogger("airflow.task")
    logger.info("Starting transform step…")

    if not os.path.exists(RAW_PATH):
        raise FileNotFoundError(f"{RAW_PATH} not found. Did extract run?")

    kept_rows = []
    with open(RAW_PATH, "r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if float(row["amount"]) > 100:  # keep only rows > 100
                kept_rows.append(row)

    with open(CLEAN_PATH, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "name", "amount"])
        writer.writeheader()
        writer.writerows(kept_rows)

    logger.info("Transform complete. Kept %s rows", len(kept_rows))
    return CLEAN_PATH  # pass clean file path via XCom

# === Task Function: Report ===
def _report(**context):
    import csv
    ti = context["ti"]
    clean_path = ti.xcom_pull(task_ids="transform")
    logger = logging.getLogger("airflow.task")
    logger.info("Reporting… Clean file used: %s", clean_path)

    with open(WAREHOUSE_PATH, "r", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    logger.info("Warehouse has %d rows.", len(rows))
    if rows:
        logger.info("Last row: %s", rows[-1])

# === DAG Definition ===
with DAG(
    dag_id="assignment_simple_etl",
    description="ETL: Bash extract -> Python transform -> Bash load -> Python report",
    start_date=datetime(2023, 1, 1),
    schedule=None,    # manual trigger
    catchup=False,
    default_args=default_args,
    tags=["assignment", "etl", "demo"],
) as dag:

    # === Task 1: Extract (BashOperator) ===
    extract = BashOperator(
        task_id="extract",
        bash_command=(
            'echo "id,name,amount" > {raw} && '
            'echo "1,Alice,120" >> {raw} && '
            'echo "2,Bob,75" >> {raw} && '
            'echo "3,Carol,200" >> {raw} && '
            'echo "4,Dan,95" >> {raw} && '
            'echo "Extracted sample data into {raw}"'
        ).format(raw=RAW_PATH),
    )

    # === Task 2: Transform (PythonOperator) ===
    transform = PythonOperator(
        task_id="transform",
        python_callable=_transform,
    )

    # === Task 3: Load (BashOperator) ===
    load = BashOperator(
        task_id="load",
        bash_command=(
            'CLEAN="{{ ti.xcom_pull(task_ids=\'transform\') }}"; '
            f'if [ ! -f "{WAREHOUSE_PATH}" ]; then '
            f'  head -n 1 "$CLEAN" > "{WAREHOUSE_PATH}"; '
            f'fi; '
            f'tail -n +2 "$CLEAN" >> "{WAREHOUSE_PATH}"; '
            f'echo "Appended rows into {WAREHOUSE_PATH}";'
        ),
    )

    # === Task 4: Report (PythonOperator) ===
    report = PythonOperator(
        task_id="report",
        python_callable=_report,
    )

    # === Task Chaining (sequential execution) ===
    extract >> transform >> load >> report
