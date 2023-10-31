import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const CAP_SIZE = 100;

describe("CappedSet", function () {
  async function deployCappedSetFixture() {
    const [user, addr1, addr2, addr3] = await ethers.getSigners();
    const CappedSet = await ethers.getContractFactory("CappedSet");
    const contract = await CappedSet.deploy(CAP_SIZE);

    // it has no way to read return value of no-view/no-pure function from off-chain
    // so it uses another contract that emits the result as event
    const TestCappedSet = await ethers.getContractFactory("TestCappedSet");
    const wrapperContract = await TestCappedSet.deploy(contract.target);

    return { user, addr1, addr2, addr3, contract, wrapperContract };
  }
  describe("Deployment", function () {
    it("Should reject if cap size is invalid", async function () {
      const CappedSet = await ethers.getContractFactory("CappedSet");

      await expect(CappedSet.deploy(0)).to.be.revertedWith("wrong cap");
    });

    it("Should configure the cap size correctly", async function () {
      const { contract } = await loadFixture(deployCappedSetFixture);
      const cap = await contract.cap();

      expect(cap).to.equal(CAP_SIZE);
    });
  });

  describe("Insert", function () {
    it("Should reject if address or value is invalid", async function () {
      const { contract, addr1 } = await loadFixture(deployCappedSetFixture);

      await expect(contract.insert(ethers.ZeroAddress, 0)).to.be.revertedWith(
        "invalid element"
      );
      await expect(contract.insert(ethers.ZeroAddress, 1)).to.be.revertedWith(
        "invalid element"
      );
      await expect(contract.insert(addr1.address, 0)).to.be.revertedWith(
        "invalid element"
      );
    });

    it("Should return zero after adding 1st element", async function () {
      const { wrapperContract, addr1 } = await loadFixture(
        deployCappedSetFixture
      );

      // const tx = await contract.insert(addr1, 1);
      await expect(wrapperContract.insert(addr1, 1))
        .to.emit(wrapperContract, "Inserted")
        .withArgs(ethers.ZeroAddress, 0);
    });
  });

  describe("Remove", function () {});

  describe("Update", function () {});

  describe("getValue", function () {});
});
