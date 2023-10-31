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
        require(_cap != 0, "wrong cap");
        cap = _cap;
    }

    function insert(
        address addr,
        uint256 value
    ) public returns (address newLowestAddress, uint256 newLowestValue) {
        require(addr != address(0) && value != 0, "invalid element");
        require(
            addresses[value] == address(0) && values[addr] == 0,
            "already exists"
        );

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

        _insertElement(addr, value);

        newLowestAddress = value > lowestValue ? addresses[lowestValue] : addr;
        newLowestValue = value > lowestValue ? lowestValue : value;
    }

    function remove(
        address addr
    ) public returns (address newLowestAddress, uint256 newLowestValue) {
        require(addr != address(0), "invalid element");

        uint256 value = values[addr];
        require(value != 0, "no exists");

        _removeElement(value);
        numElements--;

        newLowestValue = valueTree.first();
        newLowestAddress = addresses[newLowestValue];
    }

    function update(
        address addr,
        uint256 newValue
    ) public returns (address newLowestAddress, uint256 newLowestValue) {
        require(addr != address(0) && newValue != 0, "invalid element");

        uint256 oldValue = values[addr];
        require(oldValue != 0, "no exists");
        require(oldValue != newValue, "no changes");

        require(addresses[newValue] == address(0), "value exists");

        _removeElement(oldValue);
        _insertElement(addr, newValue);

        newLowestValue = valueTree.first();
        newLowestAddress = addresses[newLowestValue];
    }

    function getValue(address addr) public view returns (uint256) {
        return values[addr];
    }

    function _insertElement(address addr, uint256 value) internal {
        valueTree.insert(value);
        values[addr] = value;
        addresses[value] = addr;
    }

    function _removeElement(uint256 value) internal {
        address _address = addresses[value];

        valueTree.remove(value);
        delete values[_address];
        delete addresses[value];
    }
}
