from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from databaseHelpers import database
from  databaseHelpers import crud
from  interfaces import schemas
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import time

SECRET_KEY = "eqwewqewqewqewqwqx12122121"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
        if 'exp' in payload and payload['exp'] < int(time.time()):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        
        token_data = schemas.User(username=username)
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    
    return user
