// Tasks.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Task } from '../task';
import ConfirmationModal from '../modular/ConfirmationModal';
import { Button } from 'react-bootstrap';
import styles from './tasks.module.css';


export function Tasks({ tasks, completedTasks, onUnclick, onComplete, onDelete, onDoneAll, onDeleteAllCompleted, onDeleteAllOngoingTasks, onSave, onUndoneAllCompletedTasks }) {
  const tasksQuantity = tasks.length;
  const OverallQuantity = tasks.length + completedTasks.length;
  const completeTasks = completedTasks.length;

  const [showDeleteOngoingConfirmation, setShowDeleteOngoingConfirmation] = useState(false); // State for delete confirmation modal for ongoing tasks
  const [showDeleteCompletedConfirmation, setShowDeleteCompletedConfirmation] = useState(false); // State for delete confirmation modal for completed tasks

  const handleDeleteAllOngoingTasks = () => {
    setShowDeleteOngoingConfirmation(true);
  };

  const handleDeleteAllCompleted = () => {
    setShowDeleteCompletedConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteAllCompleted();
    setShowDeleteCompletedConfirmation(false); // Close the confirmation modal for completed tasks
  };

  const handleDeleteConfirm2 = () => {
    onDeleteAllOngoingTasks(); 
    setShowDeleteOngoingConfirmation(false); // Close the confirmation modal for ongoing tasks
  }

  const handleDeleteCancel = () => {
    setShowDeleteOngoingConfirmation(false); // Close the confirmation modal for ongoing tasks if cancel is clicked
    setShowDeleteCompletedConfirmation(false); // Close the confirmation modal for completed tasks if cancel is clicked
  };

  return (
    <section className={styles.container}>
      <div className="row">
        <div className="col-md-6">
          <header className="mb-3">
            <h3>Ongoing tasks:</h3>
            <p>{tasksQuantity}</p>
          </header>

          <div className="mb-3">
            <Button className={styles.doneAll} onClick={onDoneAll}>Done all</Button>
            <Button className={styles.deleteAll} onClick={handleDeleteAllOngoingTasks}>Delete all</Button>
          </div>

          {tasks.map(task => (
            <Task key={task.id} task={task} onComplete={onComplete} onDelete={onDelete} onSave={onSave} />
          ))}
        </div>

        <div className="col-md-6">
          <header className="mb-3">
            <h3 className={'text-purple'}>Completed Tasks:</h3>
            <p>{completeTasks} of {OverallQuantity}</p>
          </header>

          <div className="mb-3">
            <Button className={styles.undoneAll} onClick={onUndoneAllCompletedTasks}>Undone all</Button>
            <Button className={styles.deleteAll2} onClick={handleDeleteAllCompleted}>Delete all</Button>
          </div>

          {completedTasks.map(task => (
            <Task key={task.id} task={task} onComplete={onComplete} onUnclick={onUnclick} onDelete={onDelete} onSave={onSave} />
          ))}
        </div>
      </div>

      {/* Confirmation modal for delete all ongoing tasks */}
      <ConfirmationModal
        show={showDeleteOngoingConfirmation}
        onHide={() => setShowDeleteOngoingConfirmation(false)}
        onConfirm={handleDeleteConfirm2}
        onCancel={handleDeleteCancel}
      />

      {/* Confirmation modal for delete all completed tasks */}
      <ConfirmationModal
        show={showDeleteCompletedConfirmation}
        onHide={() => setShowDeleteCompletedConfirmation(false)}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </section>
  )
}
