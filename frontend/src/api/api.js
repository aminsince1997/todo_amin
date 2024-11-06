import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://nginx:8001';

export const isTokenExpired = (token) => {
  if (!token) return true; 
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000; 
  return decoded.exp < currentTime; 
};


export const fetchTodos = async (token) => {
  if (isTokenExpired(token)) {
    throw new Error('Token has expired');
  }
  
  const response = await fetch(`${API_BASE_URL}/todos/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  
  return response.json();
};


export const createTodo = async (todo, token) => {
  if (isTokenExpired(token)) {
    throw new Error('Token has expired');
  }

  todo.creation_date = new Date().toISOString();
  
  const response = await fetch(`${API_BASE_URL}/todos/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(todo),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  
  return response.json();
};


export const updateTodo = async (id, todo, token) => {
  if (isTokenExpired(token)) {
      throw new Error('Token has expired');
  }

  try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(todo),
      });

      if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Failed to update todo');
      }

      return response.json();
  } catch (error) {
      console.error('Update todo error:', error);
      throw error;
  }
};


export const deleteTodo = async (id, token) => {
  if (isTokenExpired(token)) {
    throw new Error('Token has expired');
  }

  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};


export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/todos/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  
  return response.json();
};


export const registerUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/todos/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to register');
  }
  
  return response.json();
};