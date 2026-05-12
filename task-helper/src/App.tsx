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
  const[tasks, setTasks] = useState<Task[]>(()=>{
    const retrieved = localStorage.getItem("task-helper-tasks")
    if(retrieved){
      return JSON.parse(retrieved);
    }
    return [];
  });
  const addTask = (title:string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: "Todo",
    };
    setTasks([...tasks, newTask]);
  }
  const deleteTask = (id: string) =>{
    setTasks(tasks.filter((task) => task.id !== id));
  }
  const updateFilter = (filter:TaskFilter) =>{
    setFilter(filter);
  }
  const getNextStatus = (status: TaskStatus): TaskStatus =>{
    if(status === "Todo") return "In Progress";
    if(status === "In Progress") return "Done";
    return "Todo"
  };
  const changeTaskStatus = (id: string) =>{
    setTasks(
      tasks.map((task)=>{
        if(task.id !== id) return task;
      
      return {
        ...task,
        status: getNextStatus(task.status),
      };
      })
    );
  };
  const getFilteredTasks = () =>{
    if (filter === "All") return tasks
    return tasks.filter((task) => task.status === filter)
  }
  useEffect(()=>{
    localStorage.setItem("task-helper-tasks",JSON.stringify(tasks))
  }, [tasks])
  useEffect(()=>{
    localStorage.setItem("task-helper-filter",JSON.stringify(filter))
  }, [filter])
  return (
    <>
      <h1>Task Helper</h1>
      <StatusFilter
        filterStatus={filter}
        setFilterStatus={updateFilter}
      />
      <TaskForm
        onAddTask={addTask}
      />
      <TaskList
        tasks={getFilteredTasks()} 
        onChangeStatus={changeTaskStatus}
        onDelete={deleteTask}
      />
    </>
  )
}

export default App
