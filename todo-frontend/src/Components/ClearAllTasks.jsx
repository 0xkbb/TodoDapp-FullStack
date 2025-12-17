import { useEffect, useState } from "react";
import ErrorOverlay from "./ErrorOverlay";

function ClearAllTasks({ account, contract }) {
    const [showComponent, setShowComponent] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!contract || !account) return;

        const fetchTodos = async () => {
            try {
                const todos = await contract.methods.getAllTasks().call({ from: account });
                setShowComponent(todos.length > 0);
            } catch {
                setShowComponent(false);
            }
        };

        fetchTodos();
    }, [contract, account]);

    const handleClearAllTasks = async () => {
        try {
            await contract.methods.clearAllTasks().send({ from: account });
        } catch (err) {
            setErrorMessage(err.message || "Failed to clear tasks");
        }
    };

    if (!showComponent) return null;

    return (
        <>
            <button className="btn clearAllTask-btn" onClick={handleClearAllTasks}>
                Clear All Tasks
            </button>

            <ErrorOverlay
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
            />
        </>
    );
}

export default ClearAllTasks;
