from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)


class Resume(Base):
    __tablename__ = 'resumes'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship('User', back_populates='resumes')
    history = relationship('ResumeHistory', back_populates='resume',
                           cascade="all,delete", passive_deletes=True)


class ResumeHistory(Base):
    __tablename__ = 'resume_history'
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    resume_id = Column(Integer, ForeignKey('resumes.id'))
    resume = relationship('Resume', back_populates='history')


User.resumes = relationship('Resume', order_by=Resume.id,
                            back_populates='owner')
