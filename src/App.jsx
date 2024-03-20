import React, { useEffect, useState } from 'react';
import { Header } from './components/header';
import { Tasks } from './components/tasks';
import 'bootstrap/dist/css/bootstrap.min.css';

const LOCAL_STORAGE_KEY = 'todo:savedTasks';
const COMPLETED_STORAGE_KEY = 'todo:completedTasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  function loadSavedTasks() {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }

  function loadCompletedTasks() {
    const savedCompletedTasks = localStorage.getItem(COMPLETED_STORAGE_KEY);
    if (savedCompletedTasks) {
      setCompletedTasks(JSON.parse(savedCompletedTasks));
    }
  }

  useEffect(() => {
    loadSavedTasks();
    loadCompletedTasks();
  }, []);

  function saveTasks(newTasks) {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
  }

  function saveCompletedTasks(newCompletedTasks) {
    setCompletedTasks(newCompletedTasks);
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(newCompletedTasks));
  }

  function addTask(taskTitle, taskDescription) {
    saveTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: taskTitle,
        description: taskDescription,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  function deleteTaskById(taskID) {
    const newTasks = tasks.filter(task => task.id !== taskID);
    saveTasks(newTasks);

    const newCompletedTasks = completedTasks.filter(task => task.id !== taskID);
    saveCompletedTasks(newCompletedTasks);
  }

  function toggleTaskComplete(taskID) {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskID) {
        const updatedTask = {
          ...task,
          isCompleted: !task.isCompleted,
          status: task.isCompleted ? 'in-progress' : 'done', // Update status based on completion
        };
        if (updatedTask.isCompleted) {
          updatedTask.completedAt = new Date().toISOString();
          setCompletedTasks(prevCompletedTasks => [...prevCompletedTasks, updatedTask]);
          const updatedCompletedTasks = [...completedTasks, updatedTask];
          localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(updatedCompletedTasks));
        }
        return updatedTask;
      }
      return task;
    });
    const filteredTasks = updatedTasks.filter(task => task.id !== taskID);
    saveTasks(filteredTasks);
  }

  function undoCompleteTask(taskID) {
    const taskToUndo = completedTasks.find(task => task.id === taskID);
    if (!taskToUndo) return;

    const updatedCompletedTasks = completedTasks.filter(task => task.id !== taskID);
    saveCompletedTasks(updatedCompletedTasks);

    setTasks(prevTasks => [...prevTasks, { ...taskToUndo, isCompleted: false }]);
    saveTasks([...tasks, { ...taskToUndo, isCompleted: false }]);
  }

  function markAllAsCompleted() {
    const completedTasksWithTime = tasks.map(task => ({
      ...task,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    }));

    saveCompletedTasks([...completedTasks, ...completedTasksWithTime]);
    setTasks([]);
    localStorage.setItem(LOCAL_STORAGE_KEY, '[]');
  }

  function undoneAllCompletedTasks() {
    const updatedTasks = completedTasks.map(task => ({
      ...task,
      isCompleted: false,
    }));

    const allTasks = [...tasks, ...updatedTasks];
    saveTasks(allTasks);
    saveCompletedTasks([]);
  }

  function deleteAllCompletedTasks() {
    saveCompletedTasks([]);
  }

  function deleteAllOngoingTasks() {
    saveTasks([]);
  }

  function saveEditedTask(updatedTask) {
    const updatedTasks = tasks.map(task => {
      if (task.id === updatedTask.id) {
        return updatedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
  }

  return (
    <>
      <Header onAddTask={addTask} />
      <Tasks
        tasks={tasks}
        completedTasks={completedTasks}
        onDelete={deleteTaskById}
        onComplete={toggleTaskComplete}
        onUnclick={undoCompleteTask}
        onDoneAll={markAllAsCompleted}
        onDeleteAllCompleted={deleteAllCompletedTasks}
        onDeleteAllOngoingTasks={deleteAllOngoingTasks}
        onSave={saveEditedTask}
        onUndoneAllCompletedTasks={undoneAllCompletedTasks}
      />
    </>
  );
}

export default App;
