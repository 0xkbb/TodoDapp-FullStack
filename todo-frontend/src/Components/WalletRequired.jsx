// Components/WalletRequired.jsx
function WalletRequired() {
    return (
        <div className="wallet-required">
            <div className="wallet-required-card">
                <h3>🔒 Wallet not connected</h3>
                <p>
                    Please connect your wallet using the button at the top
                    to create and manage your tasks.
                </p>
            </div>
        </div>
    );
}

export default WalletRequired;
