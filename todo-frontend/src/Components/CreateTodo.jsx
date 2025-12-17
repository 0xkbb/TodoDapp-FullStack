import { useState } from "react";

function CreateTodo({ isOpen, onClose, web3, account, contract }) {
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(null);
    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!web3 || !account || !contract) {
            alert("wallet not connect");
            return;
        }

        try {
            const deadlineTimestamp = deadline
                ? Math.floor(new Date(deadline).getTime() / 1000)
                : 0;
            
            await contract.methods.createTodo(title, description, deadlineTimestamp).send({from: account});
        } catch (err) {
            console.log(err);
            alert(err.message || "Error creating a todo");
        }
    }

    return (
        <div className="createTask-overlay" onClick={onClose}>
            <div
                className="createTask"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="createTask-title">Create a Task</h2>

                <p>Task Title:</p>
                <input
                    className="task_title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <p>Task Description:</p>
                <input
                    className="task_decs-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <p>Task Deadline:</p>
                <input
                    type="date"
                    className="task_deadline-input"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />

                <button className="btn createTask-btn" onClick={handleCreate}>
                    Create
                </button>
            </div>
        </div>
    );
}

export default CreateTodo;
