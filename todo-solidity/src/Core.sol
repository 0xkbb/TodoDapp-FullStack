// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/// @title A Simple Todo List Smart Contract
/// @author 0xkb
/// @notice This contract allows users to create, update, complete, delete, and manage tasks with deadlines.
/// @dev Each user has their own independent task list. Deadlines prevent tasks from being completed prematurely.

contract Core {
    
    /// @notice Enum representing the task status
    enum Status {
        none,
        Active, 
        Completed 
    }

    // Task structure
    struct Task {
        uint256 id; // unique task ID per user
        string name; // task name
        string description; // task description
        uint256 deadline; // // timestamp after which task can be completed in seconds
        Status status; // // current status of the task
    }

    /// @notice Maximum tasks a user can have
    uint256 private constant MAX_TASKS = 50;

    /// @notice Mapping from user address to their tasks
    mapping (address => mapping(uint256 => Task)) private userTasks;
    /// @notice Mapping from user address to their latest task ID
    mapping (address => uint256) private userCurrentId;


    // erros
    error InvalidStringLength();
    error Invaliddeadline();
    error TaskAlreadyExist();
    error InvalidTaskId();
    error NoTaskAdded();
    error TaskAlreadyCompleted();
    error NothingToUpdate();
    error TaskIsStillRunning();
    error MaximumTasksReached();

    // Events
    event TasksCreated(address indexed user, uint256 id, string name, string description, uint256 deadline);
    event TaskUpdated(address indexed user, uint256 id, string name, string description, uint256 deadline);
    event TaskCompleted(address indexed user, uint256 id);
    event TaskDeleted(address indexed user, uint256 id);
    event TasksCleared(address indexed user, uint256 clearedCount);

    /// @notice Create a new task for the caller 
    /// @param _name Name of the task, minimum 5 characters 
    /// @param _description Description of the task, minimum 10 characters 
    /// @param _deadline UNIX timestamp after which the task can be completed (0 for no deadline) 
    /// @dev Task IDs increment automatically. Reverts if maximum tasks reached or inputs invalid.
    function createTodo(string memory _name, string memory _description, uint256 _deadline) external {
        // Ensure the ID is exactly currentId + 1
        uint256 expectedId = userCurrentId[msg.sender] + 1;
        if (expectedId > MAX_TASKS) {
            revert MaximumTasksReached();
        }

        // Check if task already exists at this ID
        if (userTasks[msg.sender][expectedId].id != 0) {
            revert TaskAlreadyExist();
        }

        if (bytes(_name).length  < 5) {
            revert InvalidStringLength();
        }
        if (bytes(_description).length  < 10) {
            revert InvalidStringLength();
        }
        if (_deadline != 0 && _deadline <= block.timestamp) {
            revert Invaliddeadline();
        }
        userTasks[msg.sender][expectedId]  = Task({
            id: expectedId, 
            name: _name, 
            description: _description, 
            deadline: _deadline, 
            status: Status.Active
        });

        // Update the current ID for this user
        userCurrentId[msg.sender] = expectedId;
        emit TasksCreated(msg.sender, expectedId, _name, _description, _deadline);
    }

    /// @notice Update an existing task 
    /// @param _name Updated task name (min 5 chars), set to "" to leave unchanged 
    /// @param _description Updated task description (min 10 chars), set to "" to leave unchanged 
    /// @param _deadline Updated task deadline, set to 0 to leave unchanged 
    /// @param _id ID of the task to update 
    /// @dev Cannot update completed tasks.
    function updateTask(string memory _name, string memory _description, uint256 _deadline, uint256 _id) external {
        uint256 currentId = userCurrentId[msg.sender];

        if (currentId == 0) {
            revert NoTaskAdded();
        }
        Task storage userTask = userTasks[msg.sender][_id];

        if (userTask.id == 0 || userTask.id != _id) {
            revert InvalidTaskId();
        }


        if(userTask.status == Status.Completed) {
            revert TaskAlreadyCompleted();
        }

        if(bytes(_name).length == 0 && bytes(_description).length == 0 && _deadline == 0) {
            revert NothingToUpdate();
        }

        if (bytes(_name).length >= 5) {
            userTask.name = _name;
        }
        if (bytes(_description).length >= 10) {
            userTask.description = _description;
        }
        if (_deadline != 0 && _deadline > block.timestamp) {
            userTask.deadline = _deadline;
        } 
        emit TaskUpdated(msg.sender, _id, userTask.name, userTask.description, userTask.deadline);
    }

    /// @notice Mark a task as completed 
    /// @param _id ID of the task 
    /// @dev Reverts if task is not yet eligible (deadline not reached) or already completed.
    function completeTask(uint256 _id) public {
        uint256 currentId = userCurrentId[msg.sender];
        if (currentId == 0) {
            revert NoTaskAdded();
        }
        Task storage userTask = userTasks[msg.sender][_id];

        if (userTask.id == 0 || userTask.id != _id) {
            revert InvalidTaskId();
        }
        if(userTask.status == Status.Completed) {
            revert TaskAlreadyCompleted();
        }
        if (userTask.deadline != 0 && block.timestamp < userTask.deadline) {
            revert TaskIsStillRunning();
        }

        userTask.status = Status.Completed;
        emit TaskCompleted(msg.sender, _id);
    }

    /// @notice Delete a task permanently 
    /// @param _id ID of the task
    function deleteTask(uint256 _id) external {
        Task storage t = userTasks[msg.sender][_id];
        if (t.id == 0 || userCurrentId[msg.sender] < _id) revert InvalidTaskId();

        delete userTasks[msg.sender][_id];
        emit TaskDeleted(msg.sender, _id);
    }

    /// @notice Delete all tasks for the caller
    function clearAllTasks() external {
        uint256 currentId = userCurrentId[msg.sender];
        if (currentId == 0) revert NoTaskAdded();

        for (uint256 i = 1; i <= currentId; ++i) {
            delete userTasks[msg.sender][i];
        }

        userCurrentId[msg.sender] = 0;
        emit TasksCleared(msg.sender, currentId);
    }

    /// @notice Get a single task by ID 
    /// @param _id ID of the task 
    /// @return The task object
    function getUserTask(uint256 _id) public view returns (Task memory) {
        if (userTasks[msg.sender][_id].id == 0) {
            revert InvalidTaskId();
        }
        return userTasks[msg.sender][_id];
    }

    /// @notice Get all active tasks for the caller 
    /// @return Array of active tasks
    function getActiveTasks() public view returns (Task[] memory) {
        uint256 currentId = userCurrentId[msg.sender];
        if (currentId == 0) {
            revert NoTaskAdded();
        }

        uint256 activeCount = 0;
        for (uint256 i = 1; i <= currentId; i++) {
            if (userTasks[msg.sender][i].status == Status.Active) {
                activeCount++;
            }
        }

        Task[] memory activeTasksList = new Task[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= currentId; i++) {
            if (userTasks[msg.sender][i].status == Status.Active) {
                activeTasksList[index] = userTasks[msg.sender][i];
                index++;
            }
        }

        return activeTasksList;
    }

    /// @notice Get all active tasks for the caller 
    /// @return Array of active tasks
    function getAllTasks() public view returns (Task[] memory) {
        uint256 currentId = userCurrentId[msg.sender];
        if (currentId == 0) revert NoTaskAdded();

        // Count all non-empty tasks
        uint256 count = 0;
        for (uint256 i = 1; i <= currentId; i++) {
            if (userTasks[msg.sender][i].status != Status.none) {
                count++;
            }
        }

        // Fill the array
        Task[] memory allTasks = new Task[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= currentId; i++) {
            if (userTasks[msg.sender][i].status != Status.none) {
                allTasks[index] = userTasks[msg.sender][i];
                index++;
            }
        }

        return allTasks;
    }

}