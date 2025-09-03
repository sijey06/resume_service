from pydantic import BaseModel, EmailStr


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


class ResumeInDB(ResumeBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
