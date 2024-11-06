
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from authentication.security import create_access_token,hash_password,verify_password
from databaseHelpers.database import get_db
from  databaseHelpers import crud
from interfaces import schemas
from fastapi import status
from authentication.dependencies import get_current_user

router = APIRouter()

@router.post("/todos/login", response_model=schemas.Token)
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user.username)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/todos/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    
    hashed_password = hash_password(user.password)
    db_user = crud.create_user(db, user.username, hashed_password)
    
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
