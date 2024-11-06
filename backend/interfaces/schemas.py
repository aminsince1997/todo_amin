from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: int
    due_date: Optional[datetime] = None 
    creation_date: Optional[datetime] = None  
    completed: bool = False  
class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: int
    completed: bool
    owner_id: int  

    class Config:
        orm_mode = True



class UserCreate(BaseModel):
    username: str
    password: str

class User(BaseModel):
    username: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str