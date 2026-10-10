@echo off
echo Creating required directories...

mkdir app\schemas 2>nul
mkdir app\routers 2>nul
mkdir app\services 2>nul
mkdir data 2>nul
mkdir uploads 2>nul
mkdir vector_store 2>nul

echo Creating empty files...

type nul > app\schemas\chat.py
type nul > app\routers\chat.py
type nul > app\services\ai_service.py
type nul > app\services\embeddings.py
type nul > app\services\vector_store.py
type nul > app\services\document_loader.py
type nul > app\services\retrieval.py
type nul > app\services\ingestion.py
type nul > data\academic_calendar.txt
type nul > data\fee_structure.txt
type nul > data\faqs.txt
type nul > scripts\ingest_data.py

echo Setup completed successfully!
pause