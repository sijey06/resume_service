from datetime import timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import (create_access_token, decode_token, get_password_hash,
                  oauth2_scheme, verify_password)
from constants import ACCESS_TOKEN_EXPIRE_MINUTES
from database import get_db, get_resume_by_id_and_owner
from models import Resume, User
from schemas import (ResumeCreate, ResumeInDB, ResumeUpdate, TokenData,
                     UserCreate)

router = APIRouter()


@router.post('/api/register', summary='Регистрация',
             description='Регистрация нового пользователя.', tags=['Users'])
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя."""
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400,
                            detail='Email уже зарегистрирован')

    new_user = User(email=user.email,
                    password=get_password_hash(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {'message': 'Пользователь создан.'}


@router.post('/api/login', summary='Аутентификация',
             description='Получение JWT-токена.',
             response_model=TokenData, tags=['Auth'])
async def login(form_data: UserCreate, db: Session = Depends(get_db)):
    """Аутентификация пользователя и выдача JWT-токена."""
    user = db.query(User).filter(User.email == form_data.email).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400,
                            detail='Не верный Email или Password.')

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={'sub': str(user.id)},
                                       expires_delta=access_token_expires)
    return {'access_token': access_token, 'token_type': 'bearer'}


@router.post('/api/resume/', summary='Создание резюме',
             description='Создание нового резюме.',
             response_model=ResumeInDB, tags=['Resumes'])
async def create_resume(resume: ResumeCreate,
                        current_user=Depends(oauth2_scheme),
                        db: Session = Depends(get_db)):
    """Создание нового резюме."""
    decoded_token = decode_token(current_user)
    user_id = decoded_token['sub']

    db_resume = Resume(**resume.model_dump(), owner_id=user_id)
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume


@router.get('/api/resume/', summary='Список резюме',
            description='Получение списка резюме пользователя.',
            response_model=List[ResumeInDB], tags=['Resumes'])
async def read_user_resumes(current_user=Depends(oauth2_scheme),
                            db: Session = Depends(get_db)):
    """Возвращает список резюме текущего пользователя."""
    decoded_token = decode_token(current_user)
    user_id = decoded_token['sub']

    resumes = db.query(Resume).filter(Resume.owner_id == user_id).all()
    return resumes


@router.get('/api/resume/{resume_id}/', summary='Просмотр резюме',
            description='Получение одного резюме.',
            response_model=ResumeInDB, tags=['Resumes'])
async def read_resume(resume_id: int, current_user=Depends(oauth2_scheme),
                      db: Session = Depends(get_db)):
    """Просмотр конкретного резюме."""
    decoded_token = decode_token(current_user)
    user_id = decoded_token['sub']

    resume = get_resume_by_id_and_owner(resume_id, user_id, db)
    if not resume:
        raise HTTPException(status_code=404, detail='Резюме не найдено.')
    return resume


@router.put('/api/resume/{resume_id}/', summary='Редактирование резюме',
            description='Редактирование существующего резюме.',
            response_model=ResumeInDB, tags=['Resumes'])
async def update_resume(resume_id: int, updated_resume: ResumeUpdate,
                        current_user=Depends(oauth2_scheme),
                        db: Session = Depends(get_db)):
    """Редактирование существующего резюме."""
    decoded_token = decode_token(current_user)
    user_id = decoded_token['sub']

    resume = get_resume_by_id_and_owner(resume_id, user_id, db)
    if not resume:
        raise HTTPException(status_code=404, detail='Резюме не найдено.')

    for field, value in updated_resume.model_dump(exclude_none=True).items():
        setattr(resume, field, value)

    db.commit()
    db.refresh(resume)
    return resume


@router.delete('/api/resume/{resume_id}/', summary='Удаление резюме',
               description='Удаление существующего резюме.', tags=['Resumes'])
async def delete_resume(resume_id: int, current_user=Depends(oauth2_scheme),
                        db: Session = Depends(get_db)):
    """Удаление существующего резюме."""
    decoded_token = decode_token(current_user)
    user_id = decoded_token['sub']

    resume = get_resume_by_id_and_owner(resume_id, user_id, db)
    if not resume:
        raise HTTPException(status_code=404, detail='Резюме не найдено.')

    db.delete(resume)
    db.commit()
    return {'detail': 'Резюме удалено.'}


@router.post('/api/resume/{resume_id}/improve', summary='Улучшение резюме',
             description='Возвращение улучшенной версии резюме.',
             tags=['Resumes'])
async def improve_resume(resume_id: int, current_user=Depends(oauth2_scheme),
                         db: Session = Depends(get_db)):
    """Улучшаем текст резюме путём добавления суффикса '[Improved]'"""
    decoded_token = decode_token(current_user)
    user_id = decoded_token['sub']
    resume = get_resume_by_id_and_owner(resume_id, user_id, db)
    if not resume:
        raise HTTPException(status_code=404, detail='Резюме не найдено.')
    improved_text = f'{resume.content.strip()} [Improved]'

    return {'improved_resume': improved_text}
