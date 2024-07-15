// src/TodoList.js

import React, { useState, useEffect } from 'react';
import './TodoList.css';
import { FaEdit, FaTrashAlt, FaCheck, FaUndo } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('low');
  const [filter, setFilter] = useState('all');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskInput.trim()) {
      const newTask = { text: taskInput, completed: false, dueDate, priority };
      if (editIndex !== null) {
        const updatedTasks = tasks.map((task, index) =>
          index === editIndex ? newTask : task
        );
        setTasks(updatedTasks);
        setEditIndex(null);
      } else {
        setTasks([...tasks, newTask]);
      }
      setTaskInput('');
      setDueDate('');
      setPriority('low');
    }
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleTaskCompletion = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const editTask = (index) => {
    const task = tasks[index];
    setTaskInput(task.text);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setEditIndex(index);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <h1 className="todo-title">To Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a new task"
          className="task-input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={addTask} className="add-button">
          {editIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={`filter-button ${filter === 'all' ? 'active' : ''}`}>All</button>
        <button onClick={() => setFilter('completed')} className={`filter-button ${filter === 'completed' ? 'active' : ''}`}>Completed</button>
        <button onClick={() => setFilter('pending')} className={`filter-button ${filter === 'pending' ? 'active' : ''}`}>Pending</button>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task, index) => (
          <li key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-details">
              <span className="task-text">{task.text}</span>
              <span className="task-date">Due: {task.dueDate}</span>
              <span className={`task-priority ${task.priority}`}>{task.priority}</span>
            </div>
            <div className="task-buttons">
              <button onClick={() => toggleTaskCompletion(index)} className="complete-button" data-tooltip-id="tooltip" data-tooltip-content={task.completed ? 'Undo' : 'Complete'}>
                {task.completed ? <FaUndo /> : <FaCheck />}
              </button>
              <button onClick={() => editTask(index)} className="edit-button" data-tooltip-id="tooltip" data-tooltip-content="Edit"><FaEdit /></button>
              <button onClick={() => removeTask(index)} className="remove-button" data-tooltip-id="tooltip" data-tooltip-content="Remove"><FaTrashAlt /></button>
            </div>
          </li>
        ))}
      </ul>
      <Tooltip id="tooltip" place="top" effect="solid" />
    </div>
  );
};

export default TodoList;
