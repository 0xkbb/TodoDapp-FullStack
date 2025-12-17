import { useState, useEffect } from "react";
import CoreABI from "./abis/Core.json";
import TodoList from "./Components/TodoList";
import ConnectWallet from "./Components/ConnectWallet";
import CreateTodo from "./Components/CreateTodo";
import Web3 from "web3";
import "./App.css";
import ClearAllTasks from "./Components/ClearAllTasks";
import WalletRequired from "./Components/WalletRequired";

const CONTRACT_ADDRESS = "0xaA421FDdbcb813aC6a803A567E3e70fd4c3dB109";

function App() {
    const [showCreateTodo, setShowCreateTodo] = useState(false);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);


    const SEPOLIA_CHAIN_ID = 11155111;

    const handleConnect = (web3Instance, accountAddr) => {
        setWeb3(web3Instance);
        setAccount(accountAddr);
    };

    // 🔥 RESTORE WALLET AFTER REFRESH
    useEffect(() => {
        const reconnect = async () => {
            if (!window.ethereum) return;

            const wasConnected = localStorage.getItem("walletConnected");
            if (!wasConnected) return;

            try {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });

                if (!accounts.length) return;

                const web3Instance = new Web3(window.ethereum);
                const chainId = await web3Instance.eth.getChainId();

                if (chainId !== SEPOLIA_CHAIN_ID) return;

                setWeb3(web3Instance);
                setAccount(accounts[0]);
            } catch (err) {
                console.warn("Reconnect failed:", err);
            }
        };

        reconnect();
    }, []);

    // 🔁 INIT CONTRACT
    useEffect(() => {
        if (!web3 || !account) {
            setContract(null);
            return;
        }

        const core = new web3.eth.Contract(
            CoreABI.abi || CoreABI,
            CONTRACT_ADDRESS,
            { from: account }
        );

        setContract(core);
    }, [web3, account]);

    // 🔁 LISTEN FOR ACCOUNT CHANGES
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts) => {
            if (!accounts.length) {
                setAccount(null);
                setWeb3(null);
                localStorage.removeItem("walletConnected");
            } else {
                setAccount(accounts[0]);
            }
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);

        return () => {
            window.ethereum.removeListener(
                "accountsChanged",
                handleAccountsChanged
            );
        };
    }, []);


    return (
        <div>
            <nav className="navBar">
                <h1 className="logo-title">0xkb Todo App</h1>
                <ConnectWallet
                    account={account}
                    setAccount={setAccount}
                    setWeb3={setWeb3}
                />
            </nav>

            <div className="todoListDisplay">
                <div className="todoListWrapper">
                    <TodoList
                        web3={web3}
                        account={account}
                        contract={contract}
                    />

                    <div className="create-task-container">
                        {!account ? (
                            <WalletRequired />
                        ) : (
                            <button
                                className="btn create-task-wide"
                                onClick={() => setShowCreateTodo(true)}
                            >
                                + Create New Task
                            </button>
                        )}

                    </div>
                    <ClearAllTasks
                        account={account}
                        contract={contract}
                    />

                </div>

                <CreateTodo
                    isOpen={showCreateTodo}
                    onClose={() => setShowCreateTodo(false)}
                    web3={web3}
                    account={account}
                    contract={contract}
                />
            </div>
        </div>
    );
}

export default App;
