from sqlalchemy.orm import Session
from orm import models
from interfaces import schemas
from orm.models import User as UserModel
from datetime import datetime
from fastapi import HTTPException, status

def get_todos(db: Session, user_id: int, skip: int = 0, limit: int = 10, completed=None):
    query = db.query(models.TodoItem).filter(models.TodoItem.owner_id == user_id)

    if completed is not None:
        query = query.filter(models.TodoItem.completed == completed)

    return query.offset(skip).limit(limit).all()

def create_todo(db: Session, todo: schemas.TodoCreate, user_id: int):
    db_todo = models.TodoItem(
        **todo.dict(),
        owner_id=user_id
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int, user_id: int):
    todo = db.query(models.TodoItem).filter(models.TodoItem.id == todo_id, models.TodoItem.owner_id == user_id).first()
    if todo:
        db.delete(todo)
        db.commit()
        return True
    return False

def get_todo(db: Session, todo_id: int, user_id: int):
    
    return db.query(models.TodoItem).filter(
        models.TodoItem.id == todo_id,
        models.TodoItem.owner_id == user_id
    ).first()

def update_todo(db: Session, todo_id: int, todo_data: schemas.TodoCreate, user_id: int):
    
    todo = get_todo(db, todo_id, user_id)
    
    if not todo:
        return None
        
   
    if hasattr(todo_data, 'dict'):
        update_data = todo_data.dict(exclude_unset=True)
    else:
        update_data = todo_data
        
    for key, value in update_data.items():
        if hasattr(todo, key):  
            setattr(todo, key, value)
    
    try:
        db.commit()
        db.refresh(todo)
        return todo
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating todo: {str(e)}"
        )

def get_user(db: Session, username: str):
    return db.query(UserModel).filter(UserModel.username == username).first()

def create_user(db: Session, username: str, password: str):
    
    if get_user(db, username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    
    db_user = UserModel(
        username=username,
        password=password  
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        )



