# 🌊 Serverless ETL Pipeline: GCS to BigQuery using Dataflow

![GCP Dataflow](https://img.shields.io/badge/Google_Cloud-Dataflow-blue?logo=google-cloud&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success)

## 📖 Overview
This repository hosts the code and configuration for a serverless ETL (Extract, Transform, Load) pipeline built on **Google Cloud Dataflow (Apache Beam)**.

The pipeline ingests raw CSV employee data from Google Cloud Storage, transforms it using a JavaScript User-Defined Function (UDF), and loads the clean data into **BigQuery** for analysis.

## 🚀 Architecture
1.  **Source:** `employee.csv` stored in a GCS Bucket.
2.  **Processing:** Dataflow job (using the Google-provided `GCS_Text_to_BigQuery` template).
    * **Cleaning:** Filters out header rows and empty lines.
    * **Transformation:** Maps CSV columns to JSON objects via `udf.js`.
    * **Typing:** Casts strings to `INTEGER` and `DATE` formats.
3.  **Sink:** BigQuery Table (`df_demo.employees`).

---

## 📂 Repository Structure
| File | Description |
| :--- | :--- |
| `data/employee.csv` | Sample raw data containing employee details (ID, Name, Dept, Salary, etc.). |
| `schemas/bq.json` | JSON schema defining the target BigQuery table structure. |
| `scripts/udf.js` | JavaScript logic used by Dataflow workers to parse and transform the raw text. |

---

## 🛠️ Setup & Execution

### 1. Prerequisites
* A Google Cloud Platform Project.
* **APIs Enabled:** Dataflow API, Compute Engine API, BigQuery API, Cloud Storage.
* **Service Account Permissions:**
    * `roles/dataflow.worker`
    * `roles/bigquery.dataEditor`
    * `roles/storage.objectAdmin`

### 2. Deployment Steps

**Step 1: Set Variables**
```bash
export PROJECT_ID="your-project-id"
export BUCKET_NAME="your-bucket-name"
export REGION="us-central1"

**Step 2: Upload Files to GCS**

Bash
gsutil cp schemas/bq.json gs://$BUCKET_NAME/schemas/
gsutil cp scripts/udf.js gs://$BUCKET_NAME/scripts/
gsutil cp data/employee.csv gs://$BUCKET_NAME/data/

**Step 3: Create BigQuery Dataset**

Bash
bq --location=US mk -d $PROJECT_ID:df_demo
Step 4: Run the Dataflow Job

Bash
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
