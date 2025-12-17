import { useEffect, useState } from "react";
import ErrorOverlay from "./ErrorOverlay";
import Web3 from "web3";

const SEPOLIA_CHAIN_ID = 11155111;
function ConnectWallet({ account, setAccount, setWeb3 }) {
    const [errorMessage, setErrorMessage] = useState(null);


    const shortAddress = (addr) =>
        addr ? `${addr.slice(0, 6)}***${addr.slice(-4)}` : "";

    const connect = async () => {
        try {
            if (!window.ethereum) {
                setErrorMessage("MetaMask not installed");
                return;
            }

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            const web3Instance = new Web3(window.ethereum);
            const chainId = await web3Instance.eth.getChainId();

            if (chainId !== SEPOLIA_CHAIN_ID) {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0xaa36a7" }],
                });
            }

            setWeb3(web3Instance);
            setAccount(accounts[0]);

            localStorage.setItem("walletConnected", "true");
        } catch (err) {
            setErrorMessage(err.message);
        }
    };


    // const disconnect = () => {
    //     setAccount(null);
    //     setWeb3(null);
    //     setChainId(null);
    //     setError(null);
    //     localStorage.removeItem("walletConnected");

    //     if (onConnect) onConnect(null, null);
    // };

    // // Listen to account and chain changes
    // useEffect(() => {
    //     const handleAccountsChanged = (accounts) => {
    //     if (!accounts || accounts.length === 0) {
    //         // MetaMask locked or no accounts
    //         disconnect();
    //     } else {
    //         setAccount(accounts[0]);
    //         if (onConnect && web3) onConnect(web3, accounts[0]);
    //     }
    //     };

    //     const handleChainChanged = (chainIdHex) => {
    //         setChainId(chainIdHex);
    //     // Optionally reload page or re-init things
    //     // window.location.reload();
    //     };

    //     if (window.ethereum) {
    //         window.ethereum.on("accountsChanged", handleAccountsChanged);
    //         window.ethereum.on("chainChanged", handleChainChanged);
    //     }

    //     // cleanup
    //     return () => {
    //         if (window.ethereum) {
    //             try {
    //                 window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    //                 window.ethereum.removeListener("chainChanged", handleChainChanged);
    //             } catch (e) {
    //             // ignore if provider removed
    //             }
    //         }
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [web3, onConnect]);

    // useEffect(() => {
    //     const reconnect = async () => {
    //         if (!window.ethereum) return;
    //         if (!localStorage.getItem("walletConnected")) return;


    //         try {
    //             const provider = window.ethereum;
    //             const accounts = await provider.request({
    //                 method: "eth_accounts",
    //             });

    //             if (accounts.length === 0) return;

    //             const web3Instance = new Web3(provider);
    //             const chainId = await web3Instance.eth.getChainId();

    //             if (chainId !== SEPOLIA_CHAIN_ID) return;

    //             setWeb3(web3Instance);
    //             setAccount(accounts[0]);
    //             setChainId(SEPOLIA_CHAIN_ID);

    //             if (onConnect) {
    //                 onConnect(web3Instance, accounts[0]);
    //             }
    //         } catch (err) {
    //             console.warn("Auto-connect failed:", err);
    //         }
    //     };

    //     reconnect();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);


    return (
        <div className="connectWallet">
        {account ? (
            <h3 className="connectWallet-btn btn">Connected: {shortAddress(account)}</h3>
        ) : (
            <button className="connectWallet-btn btn" onClick={connect}>
            Connect Wallet
            </button>
        )}

        <ErrorOverlay
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
        />
        </div>
    );

}

export default ConnectWallet;