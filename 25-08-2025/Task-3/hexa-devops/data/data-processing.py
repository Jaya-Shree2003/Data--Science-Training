import os
import pandas as pd
from datetime import datetime

# File paths
DATA_DIR = "data"
RAW_INPUT = os.path.join(DATA_DIR, "raw_sales_data.csv")
RAW_OUTPUT = os.path.join(DATA_DIR, "raw_sales_data.csv")
CLEAN_OUTPUT = os.path.join(DATA_DIR, "clean_sales_data.csv")


def process_data():
    # Ensure data directory exists
    os.makedirs(DATA_DIR, exist_ok=True)

    # Read the raw dataset
    df = pd.read_csv(RAW_INPUT)

    # Drop rows with missing values
    df = df.dropna()

    # Convert date columns to YYYY-MM-DD if any
    for col in df.columns:
        if "date" in col.lower():
            try:
                df[col] = pd.to_datetime(df[col], errors="coerce").dt.strftime("%Y-%m-%d")
            except Exception:
                pass

    # Normalize column names to lowercase
    df.columns = [col.lower() for col in df.columns]

    # Save raw (unchanged) and cleaned versions
    pd.read_csv(RAW_INPUT).to_csv(RAW_OUTPUT, index=False)  # raw unchanged
    df.to_csv(CLEAN_OUTPUT, index=False)

    print(f"✅ Raw saved at: {RAW_OUTPUT}")
    print(f"✅ Cleaned saved at: {CLEAN_OUTPUT}")


if __name__ == "__main__":
    process_data()
