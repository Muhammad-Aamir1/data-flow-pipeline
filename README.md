# Serverless ETL Pipeline: GCS to BigQuery Using Dataflow

This repository contains a serverless ETL (Extract-Transform-Load) pipeline built on **Google Cloud Platform** using the **Dataflow** service and the official **GCS → BigQuery** template.

The pipeline ingests raw employee data stored in a Google Cloud Storage bucket, transforms and parses it using a JavaScript UDF (user-defined function), and then loads the cleaned data into a BigQuery table for analytics and reporting.

---

## Table of Contents

- Overview
- Architecture
- Repository Structure
- Setup & Execution
  - Prerequisites
  - Deployment Steps
- BigQuery Analytic Queries
- License

---

## Overview

This pipeline uses the **Dataflow GCS → BigQuery** template to:

1. Read a CSV file (`employee.csv`) from Google Cloud Storage.
2. Apply transformation logic using a JavaScript UDF (`udf.js`) that:
   - Removes header and empty rows
   - Converts each line into typed JSON objects
3. Load the result into BigQuery (`df_demo.employees`) using a JSON schema file.

This setup lets you run a fully serverless ETL job without managing servers.

---

## Architecture

Google Cloud Storage (GCS)
│
▼
Dataflow Job (Template)
Uses JavaScript UDF
│
▼
BigQuery Table


---

## Repository Structure

| File / Folder       | Description |
|----------------------|-------------|
| `data/employee.csv`  | Sample raw CSV employee data |
| `schemas/bq.json`    | Target BigQuery table schema |
| `scripts/udf.js`     | JavaScript transformation logic |
| `README.md`          | This documentation |

---

## Setup & Execution

### Prerequisites

Before running the pipeline:

1. **Google Cloud Project**
2. **APIs enabled**
   - Dataflow API
   - BigQuery API
   - Cloud Storage API
3. **Service account with roles**
   - `roles/dataflow.worker`
   - `roles/bigquery.dataEditor`
   - `roles/storage.objectAdmin`

---

### Deployment Steps

#### Step 1: Set Environment Variables

Replace placeholders with your actual values.

```bash
export PROJECT_ID="your-project-id"
export BUCKET_NAME="your-bucket-name"
export REGION="us-central1"
Step 2: Upload Assets to Cloud Storage
gsutil cp schemas/bq.json gs://$BUCKET_NAME/schemas/
gsutil cp scripts/udf.js gs://$BUCKET_NAME/scripts/
gsutil cp data/employee.csv gs://$BUCKET_NAME/data/
Step 3: Create BigQuery Dataset
bq --location=US mk -d $PROJECT_ID:df_demo
Step 4: Run Dataflow Job
gcloud dataflow jobs run "import-employees-$(date +%Y%m%d-%H%M%S)" \
    --gcs-location gs://dataflow-templates/latest/GCS_Text_to_BigQuery \
    --region $REGION \
    --parameters \
javascriptTextTransformFunctionName="process",\
JSONPath="gs://$BUCKET_NAME/schemas/bq.json",\
javascriptTextTransformGcsPath="gs://$BUCKET_NAME/scripts/udf.js",\
inputFile="gs://$BUCKET_NAME/data/employee.csv",\
outputTable="$PROJECT_ID:df_demo.employees",\
bigQueryLoadingTemporaryDirectory="gs://$BUCKET_NAME/temp/"
This command starts a Dataflow job that reads from GCS, applies transformations via the JavaScript function defined in udf.js, and loads the output into the BigQuery table.

BigQuery Analytics Examples
Once the data is loaded, you can run SQL analytics in BigQuery. Here are a few examples:

Average salary per department

SELECT department, AVG(salary) AS avg_salary
FROM `your-project-id.df_demo.employees`
GROUP BY department
ORDER BY avg_salary DESC;
Employees who joined after 2022

SELECT *
FROM `your-project-id.df_demo.employees`
WHERE hire_date > "2022-01-01";
License
This project does not currently include a license file. You can add one based on your intended usage.
