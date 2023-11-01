# Web3 Solidity Developer Interview Assignment

We want you to help implement a set-like structure in Solidity (using hardhat to help out) that only allows a certain amount of elements" in the set. Once you've created the Solidity contract, we want you to test it in TypeScript, not in Solidity.

## Execution
Try running some of the following tasks:

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test

npx hardhat --network goerli run scripts/deploy.ts
npx hardhat --network goerli verify --contract "contracts/CappedSet.sol:CappedSet" 0xf43587B709Cd6E523495C718C2c499eCAC94ba51 5
```

## Contract Addresses
[0xf43587B709Cd6E523495C718C2c499eCAC94ba51](https://goerli.etherscan.io/address/0xf43587B709Cd6E523495C718C2c499eCAC94ba51)

## Major Files
```
contracts/CappedSet.sol
test/CappedSet.ts
```

## Notice
Please refer to `contracts/mocks/TestCappedSet.sol`. There is no way to read return values of non-view/non-pure functions from off-chain. So I used wrapper contract that executes the target function and emit result as event.