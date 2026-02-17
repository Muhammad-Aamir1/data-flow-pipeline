# GCP Dataflow ETL Pipeline Demo

This project demonstrates a serverless ETL pipeline on Google Cloud Platform using **Dataflow (Apache Beam)**. It reads a CSV file from Cloud Storage, transforms the data using a JavaScript UDF, and loads it into BigQuery.

## 🚀 Architecture
1. **Source**: CSV files in Google Cloud Storage.
2. **Transformation**: Dataflow Job (using Google-provided Template).
   - Filters header rows.
   - Maps CSV columns to JSON.
   - Types casting (String -> Integer/Date).
3. **Sink**: BigQuery Table.

## 🛠️ Prerequisites
* Google Cloud Platform Account
* `gcloud` CLI installed
* Python 3.8+

## 📂 Project Structure
* `scripts/udf.js`: JavaScript logic to parse CSV lines to JSON objects.
* `schemas/bq_schema.json`: The target BigQuery table schema.
* `data/`: Sample data for local testing.

## 🏃‍♂️ How to Run

### 1. Setup Environment
```bash
# Set your project ID
export PROJECT_ID=your-project-id
export BUCKET_NAME=your-bucket-name
