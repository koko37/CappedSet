// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./BokkyPooBahsRedBlackTreeLibrary.sol";

contract CappedSet {
    using BokkyPooBahsRedBlackTreeLibrary for BokkyPooBahsRedBlackTreeLibrary.Tree;

    BokkyPooBahsRedBlackTreeLibrary.Tree valueTree;
    uint256 public numElements;

    constructor(uint256 _numElements) {
        numElements = _numElements;
    }

    function insert(
        address addr,
        uint256 value
    ) public returns (address newLowestAddress, uint256 newLowestValue) {}

    function remove(
        address addr
    ) public returns (address newLowestAddress, uint256 newLowestValue) {}

    function update(
        address addr,
        uint256 newVal
    ) public returns (address newLowestAddress, uint256 newLowestValue) {}

    function getValue(address addr) public view returns (uint256) {}
}
