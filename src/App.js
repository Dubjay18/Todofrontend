import React from "react";
import "./App.css";

import Spinner from "react-spinkit";
import { useState } from "react";
import { useEffect } from "react";
const API_BASE = "https://todobackendjay.herokuapp.com";
function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((err) => console.error("Error: ", err));
  };
  const completeTodo = async (e) => {
    const data = await fetch(API_BASE + `/todo/complete/${e}`).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };
  const deleteTodo = async (e) => {
    const data = await fetch(API_BASE + `/todo/delete/${e}`, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  useEffect(() => {
    GetTodos();
  }, [todos]);
  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todos/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());
    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  };
  return (
    <div className="app">
      <h1>Welcome, User</h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todos.length !== 0 ? (
          todos.map((todo) => (
            <div
              className={todo.complete ? "todo is-complete" : "todo"}
              key={todo._id}
            >
              <div
                className="checkbox"
                onClick={() => completeTodo(todo._id)}
              ></div>
              <div className="text">{todo.text}</div>
              <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                x
              </div>
            </div>
          ))
        ) : (
          <Spinner color="white" />
        )}
      </div>
      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>
      {popupActive && (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>

            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
