// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Test,console} from "forge-std/Test.sol";
import {Core} from "../src/Core.sol";

contract CoreTest is Test {
    address public user = makeAddr("user");
    Core core;

    function setUp() public {
        core = new Core();
    }

    function test_CreateTodoList() public {
        core.createTodo("Learn Solidity", "Learn Solidity from scratch", block.timestamp + 1 days);
    }

    function test_CreateTodoListReverts() public {
        vm.expectRevert();
        core.createTodo("", "Do something", block.timestamp + 1 days);

        vm.expectRevert();
        core.createTodo("Do something", "", block.timestamp + 1 days);

        core.createTodo("Do something", "Do something", 0);
    }

    function test_UpdateTask() public {
        core.createTodo("Learn Solidity", "Learn Solidity from scratch", block.timestamp + 1 days);
        core.createTodo("Learn EVM", "Learn EVM from scratch", 0);

        vm.expectRevert();
        core.updateTask("", "", 0, 2);

        core.updateTask("Do pushups 44", "Do 100 pushups in 24 hours", 24 hours, 2);
        core.deleteTask(2);

        core.createTodo("Learn EVM", "Learn EVM from scratch", 0);

        vm.expectRevert();
        core.updateTask("Do pushups", "Do 100 pushups in 24 hours", 24 hours, 2);

        core.updateTask("Do pushups", "Do 100 pushups in 24 hours", 24 hours, 1);
    }

    function test_CompleteTask() public {
        core.createTodo("Learn Solidity", "Learn Solidity from scratch", block.timestamp + 1 days);
        core.createTodo("Learn EVM", "Learn EVM from scratch",  0);

        core.deleteTask(2);

        vm.warp(block.timestamp + 1 days);
        vm.expectRevert();
        core.completeTask(2);

        core.completeTask(1);
    }

    function test_DeleteTask() public {
        core.createTodo("Learn Solidity", "Learn Solidity from scratch", block.timestamp + 1 days);
        core.createTodo("Learn EVM", "Learn EVM from scratch",  0);

        core.deleteTask(2);

        vm.expectRevert();
        core.getUserTask(2);
    }

    function test_ClearTasks() public {
        core.createTodo("Learn Solidity", "Learn Solidity from scratch", block.timestamp + 1 days);
        core.createTodo("Learn EVM", "Learn EVM from scratch",  0);

        vm.warp(block.timestamp + 1 days);
        core.completeTask(1);
        core.deleteTask(2);

        core.clearAllTasks();

        vm.expectRevert();
        core.getUserTask(1);

        vm.expectRevert();
        core.getUserTask(2);
    }
}