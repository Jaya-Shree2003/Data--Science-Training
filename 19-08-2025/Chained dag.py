from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime
import os

# File path
MESSAGE_PATH = "/tmp/airflow_message.txt"

# Task 1: Generate a message
def generate_message():
    message = "Hello, this message flows through tasks!"
    with open(MESSAGE_PATH, 'w') as f:
        f.write(message)

# Task 3: Read the message
def read_message():
    if os.path.exists(MESSAGE_PATH):
        with open(MESSAGE_PATH, 'r') as f:
            print("Message from file:", f.read())
    else:
        raise FileNotFoundError("Message file does not exist.")

# Define the DAG
with DAG(
    dag_id="chained_tasks_dag",
    start_date=datetime(2023, 1, 1),
    schedule_interval=None,   # Trigger manually
    catchup=False,
    tags=["example"]
) as dag:

    # Task 1: Generate message
    generate = PythonOperator(
        task_id="generate_message",
        python_callable=generate_message
    )

    # Task 2: Simulate confirmation with Bash
    simulate_save = BashOperator(
        task_id="simulate_file_confirmation",
        bash_command=f"echo 'Message saved at {MESSAGE_PATH}'"
    )

    # Task 3: Read the message
    read = PythonOperator(
        task_id="read_message",
        python_callable=read_message
    )

    # Set execution order
    generate >> simulate_save >> read