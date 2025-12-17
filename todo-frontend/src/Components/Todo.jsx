import { useState, useEffect } from "react";
import ErrorOverlay from "./ErrorOverlay";

function Todo(props) {
    const [completed, setCompleted] = useState(props.completed);
    const [deleted, setDeleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const now = Math.floor(Date.now() / 1000);

    const handleComplete = async () => {
        if (props.deadline !== 0 && now < props.deadline) {
            setErrorMessage("You cannot complete this task yet. The deadline has not passed.");
            return;
        }
        try {
            // const id = await props.contract.methods.getUserTask(props.id).call({from: props.account});
            // console.log("Current task ID for user:", id);  

            await props.contract.methods.completeTask(Number(props.id)).send({ from: props.account });
            console.log("Completing task ID:", props.id, props.completed);

        } catch (err) {
            setErrorMessage(err.message || "Transaction failed");
            return;
        }
        setCompleted(true);

    }

    const handleDelete = async () => {
        try {
            await props.contract.methods.deleteTask(Number(props.id)).send({ from: props.account });
        } catch (err) {
            alert(err.message || "Error deleting the todo");
            console.log("Deleting task ID:", props.id, typeof props.id);
            return;
        }
        setDeleted(true);
    }

    useEffect(() => {
        setCompleted(props.completed);
        setDeleted(false);
    }, [props.completed, props.id]);

    function formatTimeLeft(deadline) {
        if (!deadline) return null;

        const deadlineNum = Number(deadline);
        const diff = deadlineNum - now;

        if (diff == 0) return "No time set";

        const totalMinutes = Math.floor(diff / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const days = Math.floor(totalHours / 24);

        if (days > 0) {
            const hoursLeft = totalHours % 24;
            return `${days}d ${hoursLeft}h left`;
        }

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);

        return `${hours}h ${minutes}m left`;
    }




    return (
        <div
            className="todoItem"
            style={{
                backgroundColor: props.completed
                    ? "#C8EFD4"
                    : "rgb(233, 220, 220)",
            }}
        >            
            <h1 className="todoItem-title">{props.title}</h1>
            <p className="todoItem-description">{props.description}</p>

            <div className="todoItem-bottom">
                <div className="todoItem-dealineConatiner">
                    {!props.completed && (
                        <p
                            className="todoItem-deadline"
                            style={{
                                display: formatTimeLeft(props.deadline) ? "block" : "none",
                            }}
                        >
                            ⏱ {formatTimeLeft(props.deadline)}
                        </p>
                    )}
                </div>

                <div 
                    className={`todoItem-buttons ${
                        props.completed ? "completed-layout" : "todoItem-buttons"
                    }`}
                    >
                    <button className="delete-btn btn" onClick={handleDelete}>Delete</button>

                    {!props.completed && (
                        <button className="complete-btn btn" onClick={handleComplete}>Complete</button>
                    )}
                </div>
            </div>
            <ErrorOverlay
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
            />
        </div>
        
    );

}

export default Todo;