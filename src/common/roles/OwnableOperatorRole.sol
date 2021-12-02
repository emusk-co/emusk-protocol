
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../Ownable.sol";
import "./OperatorRole.sol";
contract OwnableOperatorRole is Ownable, OperatorRole {
    function addOperator(address account) external onlyOwner {
        _addOperator(account);
    }

    function removeOperator(address account) external onlyOwner {
        _removeOperator(account);
    }
}