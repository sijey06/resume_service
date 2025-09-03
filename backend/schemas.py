from pydantic import BaseModel, EmailStr
from typing import Optional, List


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class TokenData(BaseModel):
    access_token: str
    token_type: str


class ResumeBase(BaseModel):
    title: str
    content: str


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(ResumeBase):
    pass


class ResumeHistory(BaseModel):
    content: str


class ResumeInDB(ResumeBase):
    id: int
    owner_id: int
    history: Optional[List['ResumeHistory']] = []

    @classmethod
    def from_orm(cls, obj):
        history_dicts = [{'content': h.content} for h in obj.history]
        return cls(
            id=obj.id,
            owner_id=obj.owner_id,
            title=obj.title,
            content=obj.content,
            history=history_dicts
        )

    class Config:
        from_attributes = True
