import os
import pandas as pd
from azure.storage.blob import BlobServiceClient

# Environment variables (set in Azure DevOps pipeline)
ACCOUNT_NAME = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")
ACCOUNT_KEY = os.getenv("AZURE_STORAGE_ACCOUNT_KEY")
CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")

# File paths
DATA_DIR = "data"
DATA_PATH = os.path.join(DATA_DIR, "sales_data.csv")
RAW_OUTPUT = "raw_sales_data.csv"
PROCESSED_OUTPUT = "processed_sales_data.csv"


def create_sample_csv():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    data = {
        "order_id": [1, 2, 3, 3, 4, 5, 6, 7, 8, 9],
        "region": ["East", "West", None, "West", "South", None, "North", "East", "West", None],
        "revenue": [120000, 60000, 45000, 45000, None, 80000, 0, 150000, 70000, None],
        "cost": [80000, 30000, 20000, 20000, 10000, None, 0, 90000, 40000, 5000],
    }

    df = pd.DataFrame(data)
    df.to_csv(DATA_PATH, index=False)
    print(f"Sample sales_data.csv created at {DATA_PATH}")


def process_sales_data():
    # Load data
    df = pd.read_csv(DATA_PATH)

    # Remove duplicates
    df = df.drop_duplicates(subset=["order_id"])

    # Handle missing values
    df["region"] = df["region"].fillna("Unknown")
    df["revenue"] = df["revenue"].fillna(0)
    df["cost"] = df["cost"].fillna(0)

    # Add profit_margin
    df["profit_margin"] = (df["revenue"] - df["cost"]) / df["revenue"].replace(0, 1)

    # Segment customers
    def segment_customer(revenue):
        if revenue > 100000:
            return "Platinum"
        elif revenue > 50000:
            return "Gold"
        else:
            return "Standard"

    df["customer_segment"] = df["revenue"].apply(segment_customer)

    # Save raw and processed
    pd.read_csv(DATA_PATH).to_csv(RAW_OUTPUT, index=False)  # raw unchanged
    df.to_csv(PROCESSED_OUTPUT, index=False)                # processed


def upload_to_blob(file_path, blob_name):
    try:
        connect_str = (
            f"DefaultEndpointsProtocol=https;"
            f"AccountName={ACCOUNT_NAME};"
            f"AccountKey={ACCOUNT_KEY};"
            f"EndpointSuffix=core.windows.net"
        )
        blob_service_client = BlobServiceClient.from_connection_string(connect_str)
        blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=blob_name)

        with open(file_path, "rb") as data:
            blob_client.upload_blob(data, overwrite=True)

        print(f"Uploaded {file_path} to Blob as {blob_name}")
    except Exception as e:
        print(f"Upload failed for {file_path}: {e}")


if __name__ == "__main__":
    create_sample_csv()  # <-- generates sales_data.csv
    process_sales_data()
    upload_to_blob(RAW_OUTPUT, RAW_OUTPUT)
    upload_to_blob(PROCESSED_OUTPUT, PROCESSED_OUTPUT)
