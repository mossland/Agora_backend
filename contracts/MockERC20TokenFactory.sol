// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20TokenFactory {
    event MockERC20TokenCreated(address indexed tokenAddress, string name, string symbol);

    function createMockERC20Token(string memory name, string memory symbol, uint256 initialSupply) external returns (address) {
        MockERC20Token newToken = new MockERC20Token(name, symbol, initialSupply);
        emit MockERC20TokenCreated(address(newToken), name, symbol);
        return address(newToken);
    }
}

contract MockERC20Token is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}
