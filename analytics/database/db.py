import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)


def test_connection():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            print("✅ Connected to Neon PostgreSQL!")
            print(result.fetchone()[0])
    except Exception as e:
        print("❌ Database connection failed!")
        print(e)