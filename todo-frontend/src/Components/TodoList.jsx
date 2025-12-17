import Todo from "./Todo";
import { useState, useEffect } from "react";
import TodoLoading from "./TodoLoading";

// contract: 0xaA421FDdbcb813aC6a803A567E3e70fd4c3dB109
function TodoList({ web3, account, contract }) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTodos = async () => {
        try {
            setLoading(true);

            const todos = await contract.methods.getAllTasks().call({ from: account });
            setTodos(todos);
            console.log("fetched todos:", todos);

        } catch (err) {
            // 👇 swallow revert caused by "no tasks"
            console.warn("No tasks yet or call reverted:", err.message);
            setTodos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!web3 || !account || !contract) return;
        fetchTodos();

    }, [web3, account, contract]);

    if (loading) {
        return <TodoLoading />
    }

    if (account && todos.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started.</p>
            </div>
        );
    }


    return (
        <div className="todoList">
            {todos.map((todo) => (
                <Todo
                    key={todo.id}
                    id={todo.id}
                    title={todo.name}
                    description={todo.description}
                    completed={todo.status == 2}
                    deadline={todo.deadline}
                    contract={contract}
                    web3={web3}
                    account={account}
                />
            ))}
        </div>
    );
}

export default TodoList;