// Header.jsx
import { useState } from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from 'react-bootstrap';
import styles from './header.module.css';
import todoLogo from './logo-only-png.png';

export function Header({ onAddTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (title.trim() !== '') {
            onAddTask(title, description);
            setTitle('');
            setDescription('');
        }
    }

    return (
        <header className={styles.header}>
            <div>
                <div className={styles.headerContent}>
                <img src={todoLogo} className={styles.logo} /> 
                <h1>To Do List</h1>                    
                </div>

                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-auto">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="What's the task today?" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="col-auto">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                        />
                    </div>
                    <div className="col-auto">
                        <Button type="submit" className={styles.addTask}><AiOutlinePlus /> Add Task</Button>
                    </div>
                </form>
            </div>
        </header>
    )
}
