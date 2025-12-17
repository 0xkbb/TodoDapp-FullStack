function TodoLoading() {
    return (
        <div className="todo-loading">
            <div className="todo-loading-card">
                <span className="spinner" />
                <h3>Loading your tasks</h3>
                <p>Syncing with the blockchain…</p>
            </div>
        </div>
    );
}

export default TodoLoading;
