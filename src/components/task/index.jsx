import React, { useState } from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa';
import { Modal, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import ConfirmationModal from '../modular/ConfirmationModal';
import styles from './task.module.css';

export function Task({ task, onComplete, onUnclick, onDelete, onSave }) {
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [status, setStatus] = useState(task.status);
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [completedAt, setCompletedAt] = useState(task.completedAt ? new Date(task.completedAt).toLocaleString() : '');
    const createdAtDate = new Date(task.createdAt);
    const createdAtString = createdAtDate.toLocaleString();

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleToggleComplete = () => {
        if (task.isCompleted) {
            onUnclick(task.id); // If the task is completed, unclick it
            setCompletedAt('');
        } else {
            onComplete(task.id); // If the task is ongoing, complete it
            const currentDate = new Date().toLocaleString(); // Get the current date and time
            setCompletedAt(currentDate); // Update completedAt with the current date and time
        }
    };
    
    
    const handleSave = () => {
        setEditMode(false);
        
        // Check if the edited title is not blank
        if (editedTitle.trim() === '') {
            setShowAlert(true);
            return; // Stop execution here
        }

        // Check if any changes were made
        if (editedTitle !== task.title || status !== task.status || editedDescription !== task.description) {
            const updatedTask = { ...task, title: editedTitle, description: editedDescription, status: status };
            onSave(updatedTask); // Call onSave function with updated task
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
        setEditMode(true);
    };
    
    const handleCancel = () => {
        setEditMode(false);
        setEditedTitle(task.title);
        setEditedDescription(task.description);
        setStatus(task.status);
    };

    const handleTitleChange = (e) => {
        setEditedTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setEditedDescription(e.target.value);
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        const updatedTask = { ...task, status: newStatus };
        onSave(updatedTask);
    };
    
    const iconColor = task.isCompleted ? "#5E1B89" : "#5E1B89";

    const handleDeleteClick = () => {
        setShowConfirmation(true);
    };

    const handleDeleteConfirm = () => {
        onDelete(task.id);
        setShowConfirmation(false);
    };

    return (
        <div className="card mb-3">
            <div className={styles.body}>
                <div className={styles.tasks}>
                    {task.isCompleted ? (
                            <FaCheckSquare size={30} color={iconColor} onClick={handleToggleComplete} />
                        ) : (
                        <FaRegSquare size={30} color={iconColor} onClick={handleToggleComplete} />
                    )}
                    <div>
                        <div>
                            {editMode ? (
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={handleTitleChange}
                                    className="form-control mb-2"
                                    autoFocus
                                />
                            ) : (
                                <h5 className={task.isCompleted ? 'text-decoration-line-through mb-2' : 'mb-2'}>{editedTitle}</h5>
                            )}
                            <p className="mb-2">{editedDescription}</p>
                        </div>
                    </div>
                        {!task.isCompleted ? (
                            <DropdownButton 
                                id="dropdown-basic-button" 
                                title={status === "in-progress" ? "In Progress" : status === "not-started" ? "Not Yet Started" : "Status"} 
                                variant="light"
                            >
                                <Dropdown.Item onClick={() => handleStatusChange("in-progress")}>In Progress</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusChange("not-started")}>Not Yet Started</Dropdown.Item>
                                <Dropdown.Item onClick={() => onComplete(task.id)}>Done</Dropdown.Item>
                            </DropdownButton>
                        ) : (
                            <span className={`text-success ${styles.doneText}`}>Done</span>
                        )}
                </div>
                <div className={styles.dateTime}>
                    <small className="text-muted">
                        {task.isCompleted ? `Completed at: ${completedAt}` : `Created at: ${createdAtString}`}
                    </small>
                    <div>
                        {!task.isCompleted && ( // Render the edit button only if the task is not completed
                            <Button className={styles.edit} onClick={handleEdit}><AiFillEdit size={20} /></Button>
                        )}
                        <Button className={styles.delete} onClick={handleDeleteClick}><AiFillDelete size={20} /></Button>
                    </div>
                </div>
            </div>

            {/* Modal for editing title */}
            <Modal show={editMode} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        value={editedTitle} 
                        onChange={handleTitleChange}
                        className="form-control mb-2"
                        autoFocus
                        required
                    />
                    <input
                        type="text"
                        value={editedDescription}
                        onChange={handleDescriptionChange}
                        className="form-control mb-2"
                        autoFocus
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button className={styles.cncl} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button className={styles.save} onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAlert} onHide={handleCloseAlert}>
                    <Modal.Header closeButton>
                        <Modal.Title>Alert</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Title cannot be blank.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className={styles.save} onClick={handleCloseAlert}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>

            {/* Confirmation modal for delete */}
            <ConfirmationModal
                show={showConfirmation}
                onHide={() => setShowConfirmation(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
