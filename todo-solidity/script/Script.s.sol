// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Script.sol";
import "../src/Core.sol";

contract DeployCore is Script {
    function run() external {
        // Start broadcasting transactions
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        // Deploy the Core contract
        Core core = new Core();

        // Print deployed address
        console.log("Core contract deployed at:", address(core));

        // Stop broadcasting
        vm.stopBroadcast();
    }
}
