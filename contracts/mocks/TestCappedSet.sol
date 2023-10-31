// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ICappedSet.sol";

/**
 * @notice It has no way to read return values from off-chain.
 * So it calls functions of CappedSet internally, and emits event holding results.
 */
contract TestCappedSet {
    ICappedSet public cappedSet;

    event Inserted(address newLowestAddress, uint256 newLowestValue);
    event Removed(address newLowestAddress, uint256 newLowestValue);
    event Updated(address newLowestAddress, uint256 newLowestValue);

    constructor(address _set) {
        cappedSet = ICappedSet(_set);
    }

    function insert(address addr, uint256 value) public {
        (address newLowestAddress, uint256 newLowestValue) = cappedSet.insert(
            addr,
            value
        );
        emit Inserted(newLowestAddress, newLowestValue);
    }
}
