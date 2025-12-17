**Todo Frontend**

- **Project**: React frontend for the 0xkb Todo dApp
- **Location**: `todo-frontend/`

**Summary**:
- **What**: A small React app that connects to MetaMask and interacts with the `Core` smart contract to create, list, complete and delete todos.
- **Network**: The UI is written to use the Sepolia testnet (the wallet connection code attempts to switch to Sepolia).
- **Contract address used by default**: `0xaA421FDdbcb813aC6a803A567E3e70fd4c3dB109` (set in `src/App.js`).

**Key files**:
- **`src/App.js`**: App entry and contract wiring. It reads `src/abis/Core.json` and creates a `web3.eth.Contract` instance.
- **`src/abis/Core.json`**: Contract ABI used by the frontend.
- **`src/Components/ConnectWallet.jsx`**: MetaMask connection, Sepolia network switch logic, and account management.
- **`src/Components/CreateTodo.jsx`**: UI to create new todos (calls `createTodo` on the contract).
- **`src/Components/TodoList.jsx`**: Fetches todos via `getAllTasks()` and renders `Todo` items.
- **`src/Components/Todo.jsx`**: Handles complete/delete interactions (`completeTask`, `deleteTask`) and deadline checks on the client side.

**Contract methods used by the frontend**:
- `createTodo(string name, string description, uint256 deadline)`
- `getAllTasks()`
- `completeTask(uint256 id)`
- `deleteTask(uint256 id)`

**Dependencies (from `package.json`)**:
- **React**: `react`, `react-dom`, `react-scripts`
- **Web3**: `web3` (v4)
- **Testing libs**: `@testing-library/*`, `web-vitals`

**Run (development)**
```bash
cd todo-frontend
npm install
npm start
```

**Build**
```bash
cd todo-frontend
npm run build
```

**Tests**
```bash
cd todo-frontend
npm test
```

**Notes & Configuration**
- The wallet connection will attempt to switch the user's MetaMask to Sepolia using chain id `0xaa36a7`.
- If you deploy the contract to a different network or address, update `CONTRACT_ADDRESS` in `src/App.js` and ensure `src/abis/Core.json` matches the deployed ABI.
- No environment variables are required by default — the contract address is hardcoded in `src/App.js`.

**Troubleshooting**
- If MetaMask is not installed the UI will show a prompt asking to install it.
- If you get RPC or network errors, confirm MetaMask is on Sepolia or change the contract address to a network you use.

**License & Author**
- Author: `0xkb`
- License: MIT (inherited from smart contract source)
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
