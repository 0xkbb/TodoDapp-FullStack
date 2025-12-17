**Todo Solidity (Core contract)**

- **Project**: `Core.sol` — the smart contract that stores and manages user tasks.
- **Location**: `todo-solidity/src/Core.sol`

**Summary**:
- **What**: A per-user todo manager implemented in Solidity. Each user has an independent task list and may create, update, complete, delete, and clear tasks.
- **Author**: `0xkb` (from contract NatSpec comments)
- **Compiler**: Solidity `0.8.30` (contract metadata)
- **Max tasks per user**: `50` (constant `MAX_TASKS`)

**Important constants & behavior**:
- `MAX_TASKS = 50` — prevents unlimited task accumulation per user.
- Deadlines are UNIX timestamps; tasks with a non-zero deadline can only be completed after the timestamp.
- Each user's task IDs start at `1` and increment when new tasks are created.

**Public functions (contract API)**
- `createTodo(string _name, string _description, uint256 _deadline)` — create a new task (name ≥ 5 chars, description ≥ 10 chars). Emits `TasksCreated`.
- `updateTask(string _name, string _description, uint256 _deadline, uint256 _id)` — update a task (cannot update completed tasks). Emits `TaskUpdated`.
- `completeTask(uint256 _id)` — mark a task completed (reverts if deadline not passed or already completed). Emits `TaskCompleted`.
- `deleteTask(uint256 _id)` — remove a task; emits `TaskDeleted`.
- `clearAllTasks()` — deletes all tasks for the caller; emits `TasksCleared`.
- `getUserTask(uint256 _id) -> Task` — returns a single task.
- `getActiveTasks() -> Task[]` — returns active tasks only.
- `getAllTasks() -> Task[]` — returns all non-empty tasks.

**Events**
- `TasksCreated(address user, uint256 id, string name, string description, uint256 deadline)`
- `TaskUpdated(address user, uint256 id, string name, string description, uint256 deadline)`
- `TaskCompleted(address user, uint256 id)`
- `TaskDeleted(address user, uint256 id)`
- `TasksCleared(address user, uint256 clearedCount)`

**Custom Errors (reverts)**
- `InvalidStringLength()`
- `Invaliddeadline()`
- `TaskAlreadyExist()`
- `InvalidTaskId()`
- `NoTaskAdded()`
- `TaskAlreadyCompleted()`
- `NothingToUpdate()`
- `TaskIsStillRunning()`
- `MaximumTasksReached()`

**Build & Test (Foundry)**
- Build: `forge build`
- Run tests: `forge test`
- Foundry config: see `todo-solidity/foundry.toml` (src/out/libs locations)

**Notes for frontend integration**
- The frontend expects the contract ABI at `todo-frontend/src/abis/Core.json`. Ensure that ABI matches the deployed `Core` contract.
- The ABI in `todo-frontend/src/abis/Core.json` includes functions `createTodo`, `getAllTasks`, `completeTask`, `deleteTask` that the frontend calls.

**Dependencies**
- `ethers` is listed in `todo-solidity/package.json` (used for scripts or deployment helpers).

**License & Authors**
- Author: `0xkb`
- License: MIT (see contract header)

