import React, { useEffect, useState } from 'react';
import { fetchTodos, createTodo, deleteTodo, updateTodo ,isTokenExpired} from './api/api';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import LoginForm from './components/LoginForm';
import './css/App.css';
import RegisterForm from './components/RegisterForm';
import Quote from './components/Quote';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      handleLogout();
      return;
    }

    const loadTodos = async () => {
      if (!token) return;
      if (token && isTokenExpired(token)) {
        handleLogout();
        return;
      }
      try {
        const data = await fetchTodos(token);
        setTodos(data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, [token]);
  const handleApiError = (error) => {
    if (token && isTokenExpired(token)) {
      handleLogout();
      return;
    }
    if (error.message === 'Token has expired') {
      handleLogout();
    }
    console.error(error);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setTodos([]);
  };
  const handleCreateTodo = async (newTodo) => {
    try {
      if (token && isTokenExpired(token)) {
        handleLogout();
        return;
      }
      const createdTodo = await createTodo(newTodo, token);
      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleSubmitUpdate = async (updatedData) => {
    try {
      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }
      if (currentTodo) {
       
        const updatedTodo = await updateTodo(currentTodo.id, {
          ...updatedData,
          completed: currentTodo.completed 
        }, token);
        setTodos(prevTodos => 
          prevTodos.map(todo => todo.id === currentTodo.id ? updatedTodo : todo)
        );
        setCurrentTodo(null);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (token && isTokenExpired(token)) {
      handleLogout();
      return;
    }
    await deleteTodo(id, token);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleUpdateTodoStatus = async (updatedTodo) => {
    try {
      if (!token || isTokenExpired(token)) {
        handleLogout();
        return;
      }
      const updated = await updateTodo(updatedTodo.id, {
        ...updatedTodo
      }, token);
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === updated.id ? updated : todo)
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleUpdateTodo = (id) => {
    if (!token || isTokenExpired(token)) {
      handleLogout();
      return;
    }
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (todoToUpdate) {
      setCurrentTodo(todoToUpdate);
    }
  };

 

  return (
    <div className="app">
      <h1>To-Do List</h1>
      {token ? (
        <>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <Quote />
          <TodoForm
            onSubmit={currentTodo ? handleSubmitUpdate : handleCreateTodo}
            currentTodo={currentTodo}
            setCurrentTodo={setCurrentTodo}
          />
          <TodoList
            todos={todos}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            onStatusUpdate={handleUpdateTodoStatus} 

          />
        </>
      ) : isRegistering ? (
        <RegisterForm
          setToken={setToken}
          switchToLogin={() => setIsRegistering(false)}
        />
      ) : (
        <LoginForm
          setToken={setToken}
          switchToRegister={() => setIsRegistering(true)}
        />
      )}
    </div>
  );
};




export default App;
