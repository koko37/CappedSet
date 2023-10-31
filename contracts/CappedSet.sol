// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./BokkyPooBahsRedBlackTreeLibrary.sol";

contract CappedSet {
    using BokkyPooBahsRedBlackTreeLibrary for BokkyPooBahsRedBlackTreeLibrary.Tree;

    uint256 public immutable cap;

    BokkyPooBahsRedBlackTreeLibrary.Tree valueTree;
    mapping(address => uint256) values;
    mapping(uint256 => address) addresses;

    uint256 public numElements;

    constructor(uint256 _cap) {
        cap = _cap;
    }

    function insert(
        address addr,
        uint256 value
    ) public returns (address newLowestAddress, uint256 newLowestValue) {
        require(addr != address(0) && value != 0, "invalid element");
        require(!valueTree.exists(value), "already exists");

        uint256 lowestValue = valueTree.first();
        require(value > lowestValue || numElements < cap, "too low value");

        if (numElements == cap) {
            // it has reached to cap already, so removes current lowest value.
            _removeElement(lowestValue);

            // get new lowest value
            lowestValue = valueTree.first();
        } else {
            numElements++;
        }

        valueTree.insert(value);
        values[addr] = value;
        addresses[value] = addr;

        newLowestAddress = value > lowestValue ? addresses[lowestValue] : addr;
        newLowestValue = value > lowestValue ? lowestValue : value;
    }

    function remove(
        address addr
    ) public returns (address newLowestAddress, uint256 newLowestValue) {
        require(addr != address(0), "invalid element");

        uint256 value = values[addr];
        require(value != 0, "invalid element");

        _removeElement(value);
        newLowestValue = valueTree.first();
        newLowestAddress = addresses[newLowestValue];
    }

    function update(
        address addr,
        uint256 newVal
    ) public returns (address newLowestAddress, uint256 newLowestValue) {}

    function getValue(address addr) public view returns (uint256) {}

    function _removeElement(uint256 value) internal {
        address _address = addresses[value];

        valueTree.remove(value);
        delete values[_address];
        delete addresses[value];
    }
}
