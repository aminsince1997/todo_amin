from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from databaseHelpers import database,crud
from interfaces import schemas
from databaseHelpers.database import get_db
from authentication.dependencies import get_current_user
from typing import Optional

router = APIRouter(
    prefix="/todos",
    tags=["todos"]
)

@router.get("/", response_model=List[schemas.Todo])
def read_todos(skip: int = 0, limit: int = 100,
                completed: Optional[bool] = None,
                db: Session = Depends(get_db), 
                current_user: schemas.User = Depends(get_current_user)):
    
    todos = crud.get_todos(db, user_id=current_user.id, skip=skip, limit=limit, completed=completed)
    return todos

@router.post("/", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate,
                 db: Session = Depends(get_db), 
                 current_user: schemas.User = Depends(get_current_user)):
    
    return crud.create_todo(db, todo, user_id=current_user.id)  

@router.put("/{todo_id}", response_model=schemas.Todo)
def update_todo(
    todo_id: int,
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    updated_todo = crud.update_todo(db, todo_id, todo, current_user.id)
    if not updated_todo:
        raise HTTPException(
            status_code=404,
            detail="Todo not found or not owned by user"
        )
    return updated_todo

@router.delete("/{todo_id}")
def delete_todo(todo_id: int,
                db: Session = Depends(get_db), 
                current_user: schemas.User = Depends(get_current_user)):
    
    success = crud.delete_todo(db, todo_id, current_user.id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found or not owned by user")
    
    return {"message": "Todo deleted successfully"}




