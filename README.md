# TodoList Fullstack (Frontend + Smart Contract)

This repository contains a simple Todo dApp implemented as a React frontend and a Solidity smart contract. The project demonstrates a per-user todo list where users can create, update, complete, delete and clear tasks with optional deadlines.

**Structure**
- `todo-frontend/` — React application that connects to MetaMask and interacts with the `Core` contract.
- `todo-solidity/` — Foundry-based Solidity project containing `src/Core.sol` (the smart contract), tests, and deployment scripts.

**Key points**
- Contract enforces a per-user task list with a maximum of 50 tasks.
- Deadlines are UNIX timestamps; tasks with deadlines can only be completed after the timestamp.
- The frontend calls `createTodo`, `getAllTasks`, `completeTask`, and `deleteTask` on the `Core` contract.

**Quickstart — Frontend**
1. Open a terminal and run:
```bash
cd todo-frontend
npm install
npm start
```
2. The app expects MetaMask and will attempt to switch the wallet to the Sepolia testnet. The default contract address used in the app is set in `todo-frontend/src/App.js`. If you deploy the contract to another network or address, update that constant and the ABI file.

**Quickstart — Solidity (Foundry)**
1. Install Foundry (if you don't have it): https://book.getfoundry.sh/
2. From the `todo-solidity` folder:
```bash
cd todo-solidity
forge build
forge test
```

**Frontend ↔ Contract integration**
- ABI used by the frontend: `todo-frontend/src/abis/Core.json`.
- If you redeploy the contract, update the address in `todo-frontend/src/App.js` and ensure the ABI matches the deployed contract.

**Testing**
- Frontend: `cd todo-frontend && npm test`
- Solidity: `cd todo-solidity && forge test`

**Where to look**
- Smart contract source: `todo-solidity/src/Core.sol` (includes NatSpec comments and custom errors/events).
- Frontend entry: `todo-frontend/src/App.js` and components in `todo-frontend/src/Components/`.

**License & Author**
- Author: `0xkb` (from contract NatSpec / repo files)
- License: MIT

