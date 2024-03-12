import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    // Automatic fetch at every refresh/render to update todos from the DB server to UI
    axios.get('http://localhost:4000/getTodos').then((response) => {
      setTodos(response.data);
    });
  }, []);

  const addTodo = () => {
    // Add a new todo to the server
    axios.post('http://localhost:4000/addTodo', { name,age }).then(() => {
      // Refresh the todos
      axios.get('http://localhost:4000/getTodos').then((response) => {
        setTodos(response.data);
        setName('');
        setAge('');
      });
    });
  };
  const deleteData = (id) => {
    axios.delete(`http://localhost:4000/deleteData/${id}`).then(()=> {
      axios.get('http://localhost:4000/getTodos').then((response) => {
        setTodos(response.data);
      })
    });
  }; 

  const editTodoHandler = (todo) => {
    setEditTodo(todo);
    setEditName(todo.name);
    setEditAge(todo.age);
  };

  const updateData = () => {
    axios.put(`http://localhost:4000/updateData/${editTodo._id}`,{name: editName, age: editAge,}).then(()=> {
      
    setEditTodo(null);// So that we can click on other Edits, and the old one dont grets merged with new ones data, so we empty old state data
    axios.get('http://localhost:4000/getTodos').then((response) => {
        setTodos(response.data);
      });
    });
  };
  
  return (
    <div>
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        
      <div className="card-container"></div>
        <tbody>
        {/* For editinga  particular row, we have to traverse all the rows with the Unique Id of that row, and return that row, when matched with its id */}
        {todos.map((todo) => (
          <tr key={todo._id} >
            <td>{ editTodo && editTodo._id === todo._id?(
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
            />
            ):(todo.name)}</td>
            <td>{ editTodo && editTodo._id === todo._id ? (
              <input
                type="text"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
              ):(todo.age)}
            </td>
            <td>{ editTodo &&  editTodo._id === todo._id ? (
              <button onClick={updateData}>Update</button>)
              :
              (<button onClick={() => editTodoHandler(todo)}>Edit</button>)
            }
            </td>
            <td>
              <button onClick={() => deleteData(todo._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}

export default App;
