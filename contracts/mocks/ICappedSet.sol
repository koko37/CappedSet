// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ICappedSet {
    function insert(
        address addr,
        uint256 value
    ) external returns (address newLowestAddress, uint256 newLowestValue);

    function remove(
        address addr
    ) external returns (address newLowestAddress, uint256 newLowestValue);

    function update(
        address addr,
        uint256 newValue
    ) external returns (address newLowestAddress, uint256 newLowestValue);

    function getValue(address addr) external view returns (uint256);
}
