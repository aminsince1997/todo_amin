from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from databaseHelpers.database import Base
from sqlalchemy import DateTime
class TodoItem(Base):
    __tablename__ = "todo_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    completed = Column(Boolean, default=False)
    
    
    owner_id = Column(Integer, ForeignKey("todo_users.id"))
    priority = Column(Integer, nullable=False)  
    due_date = Column(DateTime, nullable=True)
    creation_date = Column(DateTime, nullable=True)
    
    owner = relationship("User", back_populates="todos")


class User(Base):
    __tablename__ = "todo_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    password = Column(String, index=True)

    
    todos = relationship("TodoItem", back_populates="owner")
