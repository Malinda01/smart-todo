import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // New state to control the modal
  const [editingTask, setEditingTask] = useState(null); 

  const userName = localStorage.getItem('userName') || 'User';
  const navigate = useNavigate();

  const getConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/tasks', getConfig());
        setTasks(response.data);
      } catch (error) {
        if (error.response?.status === 401) navigate('/login');
      }
    };
    fetchTasks();
  }, [navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        { title: newTaskTitle },
        getConfig()
      );
      setTasks([response.data, ...tasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  const handleToggleDone = async (id, currentStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/tasks/${id}/done`,
        { is_done: !currentStatus },
        getConfig()
      );
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, is_done: !currentStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  // --- NEW: Submit the edits to the backend ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${editingTask.id}`,
        { title: editingTask.title },
        getConfig()
      );

      // Update the task in the UI array
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...task, title: response.data.title } : task
      ));
      
      // Close the modal
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const activeTasks = tasks.filter(task => !task.is_done);
  const completedTasks = tasks.filter(task => task.is_done);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="brand-title">Mindflow</div>
        <div className="nav-section">
          <div className="nav-label">Personal Space</div>
          <div className="nav-item active">☐ Inbox</div>
          <div className="nav-item">Today</div>
          <div className="nav-item">Upcoming</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>Welcome back, {userName.split(' ')[0]}</h1>
          <p>What needs to be done today?</p>
        </div>

        <form className="add-task-form" onSubmit={handleAddTask}>
          <input 
            type="text" 
            placeholder="e.g., Finalize the quarterly cognitive load report..." 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit" className="add-btn">Add Task</button>
        </form>

        <div className="section-title">ACTIVE TASKS ({activeTasks.length})</div>
        <div className="task-list">
          {activeTasks.map(task => (
            <div key={task.id} className="task-card">
              <div 
                className="checkbox" 
                onClick={() => handleToggleDone(task.id, task.is_done)}
              ></div>
              {/* Clicking the title opens the modal */}
              <div className="task-title" onClick={() => setEditingTask(task)}>
                {task.title}
              </div>
            </div>
          ))}
          {activeTasks.length === 0 && <p style={{color: 'var(--text-muted)'}}>No active tasks. You are all caught up!</p>}
        </div>

        {completedTasks.length > 0 && (
          <>
            <div className="section-title">COMPLETED ({completedTasks.length})</div>
            <div className="task-list">
              {completedTasks.map(task => (
                <div key={task.id} className="task-card completed">
                  <div 
                    className="checkbox" 
                    onClick={() => handleToggleDone(task.id, task.is_done)}
                  ></div>
                  <div className="task-title" onClick={() => setEditingTask(task)}>
                    {task.title}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- NEW: The Edit Modal Overlay --- */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Task</h3>
              <button className="close-btn" onClick={() => setEditingTask(null)}>✕</button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  value={editingTask.title} 
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  required
                />
              </div>

              {/* These fields match the PDF but are visual-only for now until the DB is expanded */}
              <div className="form-group">
                <label>Details</label>
                <textarea placeholder="Add any details or notes here..."></textarea>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Priority</label>
                  <select>
                    <option>Low</option>
                    <option selected>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setEditingTask(null)}>Cancel</button>
                <button type="submit" className="primary-btn small">Done</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;