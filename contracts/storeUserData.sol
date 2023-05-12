// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.0 < 0.9.0;
pragma abicoder v2; 

contract UserStorageData {
    struct TransactionStruck {
        address caller;
        address poolAddress;
        address tokenAddress0;
        address tokenAddress1;
    }

    TransactionStruck[] transaction;

    function addToBlockchain(address poolAddress, address tokenAddress0, address tokenAddress1) public {
        transaction.push(TransactionStruck(msg.sender, poolAddress, tokenAddress0, tokenAddress1));
    }
    function getAllTransactions() public view returns (TransactionStruck[] memory) { // memory is a keyword that creates a variable in memory for the return value
        return transaction;
    }
}