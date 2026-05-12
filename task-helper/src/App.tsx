import { useState,useEffect } from 'react'
import type { Task,TaskFilter,TaskStatus } from './types'

import './App.css'
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import StatusFilter from './components/StatusFilter';

function App() {
  const[filter,setFilter] = useState<TaskFilter>(()=>{
    const retrieved = localStorage.getItem("task-helper-filter")
    if(retrieved){
      return JSON.parse(retrieved);
    }
    return "All";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const[tasks, setTasks] = useState<Task[]>([]);
  const addTask = (title:string) => {
    setLoading(true)
    fetch("http://127.0.0.1:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    })
      .then((response) => response.json())
      .then((newTask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
      });
    setLoading(false)
  }
  const deleteTask = (id: string) =>{
    setLoading(true)
    fetch(`http://127.0.0.1:8000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((deletedTask) => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== deletedTask.id)
        );
      });
    setLoading(false)
  }
  const changeTaskStatus = (id: string) =>{
    setLoading(true)
    fetch(`http://127.0.0.1:8000/tasks/${id}`, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      });
    setLoading(false)
  };
  const getFilteredTasks = () =>{
    if (filter === "All") return tasks
    return tasks.filter((task) => task.status === filter)
  }
  useEffect(()=>{
    localStorage.setItem("task-helper-filter",JSON.stringify(filter))
  }, [filter])
  useEffect(() => {
    setLoading(true)
    fetch("http://127.0.0.1:8000/tasks")
      .then((response) => {
        if(!response.ok){
          throw new Error("Request failed");
        }
        return response.json()})
      .then((data) => {
        setTasks(data);
      }).catch((error)=>{
        console.error(error)
      });
    setLoading(false)
    
  }, []);
  return (
    <>
      <h1>Task Helper</h1>
      <StatusFilter
        filterStatus={filter}
        setFilterStatus={setFilter}
      />
      <TaskForm
        onAddTask={addTask}
      />
      {loading && <p>Loading tasks...</p>}
      {!loading && (
        <TaskList
          tasks={getFilteredTasks()}
          onChangeStatus={changeTaskStatus}
          onDelete={deleteTask}
        />
      )}
    </>
  )
}

export default App
