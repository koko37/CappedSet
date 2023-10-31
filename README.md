# Web3 Solidity Developer Interview Assignment

We want you to help implement a set-like structure in Solidity (using hardhat to help out) that only allows a certain amount of elements" in the set. Once you've created the Solidity contract, we want you to test it in TypeScript, not in Solidity.

## Execution
Try running some of the following tasks:

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## Major Files
```
contracts/CappedSet.sol
test/CappedSet.ts
```

## Notice
Please refer to `contracts/mocks/TestCappedSet.sol`. There is no way to read return values of non-view/non-pure functions from off-chain. So I used wrapper contract that executes the target function and emit result as event.