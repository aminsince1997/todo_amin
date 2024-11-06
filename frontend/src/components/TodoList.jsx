import React, { useState, useEffect } from 'react';
import '../css/TodoList.css'; 

const TodoList = ({ todos, onDelete, onUpdate, onStatusUpdate }) => {
  const [sortedTodos, setSortedTodos] = useState([]);
  const [filterCompleted, setFilterCompleted] = useState(null);

   useEffect(() => {
        setSortedTodos(todos);
    }, [todos]);

    const handleToggleCompleted = async (todo) => {
      try {
        const updatedTodo = { ...todo, completed: !todo.completed };
        await onStatusUpdate(updatedTodo);
        setSortedTodos(prevTodos =>
          prevTodos.map(t => t.id === todo.id ? updatedTodo : t)
        );
      } catch (error) {
        console.error('Error toggling todo:', error);
      }
    };

  const handleSort = (criteria) => {
    const sorted = [...sortedTodos].sort((a, b) => {
      if (criteria === 'priority') {
        return a.priority - b.priority;
      } else if (criteria === 'dueDate') {
        return new Date(a.due_date) - new Date(b.due_date);
      }
      return 0;
    });
    setSortedTodos(sorted);
  };

  const filteredTodos = filterCompleted !== null
    ? sortedTodos.filter(todo => todo.completed === filterCompleted)
    : sortedTodos;

  return (
    <div className="todo-list">
         <div className="todo-controls">
        <button className="sort-button" onClick={() => handleSort('priority')}>Sort by Priority</button>
        <button className="sort-button" onClick={() => handleSort('dueDate')}>Sort by Due Date</button>
        <button className="filter-button" onClick={() => setFilterCompleted(true)}>Show Completed</button>
        <button className="filter-button" onClick={() => setFilterCompleted(false)}>Show Active</button>
        <button className="filter-button" onClick={() => setFilterCompleted(null)}>Show All</button>
      </div>
      {filteredTodos.map(todo => (
        <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
          <div className="todo-status-controls">
          <button 
            onClick={() => handleToggleCompleted(todo)}
            className={`status-button ${todo.completed ? 'completed' : ''}`}
          >
            Mark as {todo.completed ? 'Not Completed' : 'Completed'}
          </button>
          </div>
          <div className="todo-content">
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Priority: {todo.priority}</p>
            <p>Due Date: {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : 'No due date'}</p>
          </div>
          <div className="todo-actions">
            <button onClick={() => onUpdate(todo.id)}>Edit</button>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;