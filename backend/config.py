import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(dotenv_path=Path('.') / '.env')

SECRET_KEY = os.getenv("SECRET_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
