from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from config import DATABASE_URL
from models import Resume

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_resume_by_id_and_owner(resume_id: int, user_id: int, db: Session):
    return db.query(Resume).filter(Resume.id == resume_id,
                                   Resume.owner_id == user_id).first()
