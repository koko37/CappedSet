import { ethers } from "hardhat";

async function main() {
  const cappedSet = await ethers.deployContract("CappedSet", [5]);
  await cappedSet.waitForDeployment();
  console.log(`Deployed CappedSet at ${cappedSet.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
