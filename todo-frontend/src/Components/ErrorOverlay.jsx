function ErrorOverlay({ message, onClose }) {
    if (!message) return null;

    return (
        <div className="overlay-backdrop">
            <div className="overlay-card error-card">
                <h2>Error</h2>
                <p>{message}</p>

                <button className="btn error-btn" onClick={onClose}>
                    Okay
                </button>
            </div>
        </div>
    );
}

export default ErrorOverlay;
