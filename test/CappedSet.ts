import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const TEST_CAP = 4;

describe("CappedSet", function () {
  async function deployCappedSetFixture() {
    const CappedSet = await ethers.getContractFactory("CappedSet");
    const contract = await CappedSet.deploy(TEST_CAP);

    // it has no way to read return value of non-view/non-pure function from off-chain
    // so it uses wrapper contract that emits the result as event
    const TestCappedSet = await ethers.getContractFactory("TestCappedSet");
    const wrapperContract = await TestCappedSet.deploy(contract.target);

    return { contract, wrapperContract };
  }
  describe("Deployment", function () {
    it("Should reject if cap size is invalid", async function () {
      const CappedSet = await ethers.getContractFactory("CappedSet");

      await expect(CappedSet.deploy(0)).to.be.revertedWith("wrong cap");
    });

    it("Should configure the cap size correctly", async function () {
      const { contract } = await loadFixture(deployCappedSetFixture);
      const cap = await contract.cap();

      expect(cap).to.equal(TEST_CAP);
    });
  });

  describe("Insert", function () {
    it("Should reject if address or value is invalid", async function () {
      const { contract } = await loadFixture(deployCappedSetFixture);
      const [addr1] = await ethers.getSigners();

      await expect(contract.insert(ethers.ZeroAddress, 0)).to.be.revertedWith(
        "invalid element"
      );
      await expect(contract.insert(ethers.ZeroAddress, 1)).to.be.revertedWith(
        "invalid element"
      );
      await expect(contract.insert(addr1.address, 0)).to.be.revertedWith(
        "invalid element"
      );
      await expect(contract.insert(addr1.address, 1)).not.be.reverted;
    });

    it("Should return zero after adding 1st element", async function () {
      const { wrapperContract } = await loadFixture(deployCappedSetFixture);
      const [addr1] = await ethers.getSigners();

      // const tx = await contract.insert(addr1, 1);
      await expect(wrapperContract.insert(addr1, 1))
        .to.emit(wrapperContract, "Inserted")
        .withArgs(ethers.ZeroAddress, 0);
    });

    it("Should reject duplicate address or value", async function () {
      const { contract } = await loadFixture(deployCappedSetFixture);
      const [addr1, addr2] = await ethers.getSigners();

      await contract.insert(addr1.address, 1);
      // try to insert with same address
      await expect(contract.insert(addr1.address, 2)).to.be.revertedWith(
        "already exists"
      );
      // try to insert with same value
      await expect(contract.insert(addr2.address, 1)).to.be.revertedWith(
        "already exists"
      );
      await expect(contract.insert(addr2.address, 2)).not.be.reverted;
    });

    it("Should return lowest element after adding 2nd element", async function () {
      const { contract, wrapperContract } = await loadFixture(
        deployCappedSetFixture
      );
      const [addr1, addr2, addr3] = await ethers.getSigners();

      // adding 1st element, return 0
      await contract.insert(addr1.address, 3);
      // adding 2nd element
      await expect(wrapperContract.insert(addr2.address, 2))
        .to.emit(wrapperContract, "Inserted")
        .withArgs(addr2.address, 2);
      expect(await contract.numElements()).to.equal(2);

      // adding 3rd element
      await expect(wrapperContract.insert(addr3.address, 4))
        .to.emit(wrapperContract, "Inserted")
        .withArgs(addr2.address, 2);
      expect(await contract.numElements()).to.equal(3);
    });

    it("Should boot out lowest element if cap is reached already", async function () {
      const { contract, wrapperContract } = await loadFixture(
        deployCappedSetFixture
      );
      const addrs = await ethers.getSigners();

      await contract.insert(addrs[0].address, 3);
      await contract.insert(addrs[1].address, 4);
      await contract.insert(addrs[2].address, 2);
      await expect(wrapperContract.insert(addrs[3].address, 5))
        .to.emit(wrapperContract, "Inserted")
        .withArgs(addrs[2].address, 2);

      expect(await contract.numElements()).to.equal(4);

      // cap is reached
      await expect(wrapperContract.insert(addrs[4].address, 6))
        .to.emit(wrapperContract, "Inserted")
        .withArgs(addrs[0].address, 3);

      expect(await contract.numElements()).to.equal(4);
    });
  });

  describe("getValue", function () {
    it("Should return correct value", async function () {
      const { contract } = await loadFixture(deployCappedSetFixture);
      const [addr1, addr2] = await ethers.getSigners();

      await contract.insert(addr1.address, 10);
      await contract.insert(addr2.address, 9);

      expect(await contract.getValue(ethers.ZeroAddress)).to.equal(0);
      expect(await contract.getValue(addr2.address)).to.equal(9);
      expect(await contract.getValue(addr1.address)).to.equal(10);
    });
  });

  describe("Remove", function () {
    it("Should reject if address is invalid", async function () {
      const { contract } = await loadFixture(deployCappedSetFixture);
      const [addr1, addr2] = await ethers.getSigners();

      await contract.insert(addr1.address, 1);
      await expect(contract.remove(ethers.ZeroAddress)).to.be.revertedWith(
        "invalid element"
      );
      await expect(contract.remove(addr2.address)).to.be.revertedWith(
        "no exists"
      );
    });

    it("Should remove element correctly", async function () {
      const { contract, wrapperContract } = await loadFixture(
        deployCappedSetFixture
      );
      const [addr1, addr2] = await ethers.getSigners();

      await contract.insert(addr1.address, 6);
      await contract.insert(addr2.address, 8);
      expect(await contract.numElements()).to.equal(2);
      expect(await contract.getValue(addr2.address)).to.equal(8);

      await expect(wrapperContract.remove(addr2.address))
        .to.emit(wrapperContract, "Removed")
        .withArgs(addr1.address, 6);
      expect(await contract.numElements()).to.equal(1);
      expect(await contract.getValue(addr2.address)).to.equal(0);
    });
  });

  describe("Update", function () {
    it("Should reject if address or value is invalid", async function () {
      const { contract } = await loadFixture(
        deployCappedSetFixture
      );
      const [addr1] = await ethers.getSigners();

      await expect(contract.update(ethers.ZeroAddress, 1)).to.be.revertedWith(
        "invalid element"
      );
      await expect(contract.update(addr1.address, 0)).to.be.revertedWith(
        "invalid element"
      );
      await expect(contract.update(addr1.address, 2)).to.be.revertedWith(
        "no exists"
      );
      await contract.insert(addr1.address, 6);
      await expect(contract.update(addr1.address, 6)).to.be.revertedWith(
        "no changes"
      );
    });

    it("Should update value correctly", async function () {
      const { contract, wrapperContract } = await loadFixture(
        deployCappedSetFixture
      );
      const [addr1, addr2] = await ethers.getSigners();

      await contract.insert(addr1.address, 6);
      await expect(wrapperContract.insert(addr2.address, 8))
        .to.emit(wrapperContract, "Inserted")
        .withArgs(addr1.address, 6);
      expect(await contract.getValue(addr1.address)).to.equal(6);
			expect(await contract.numElements()).to.equal(2);

      // can't update another existing value
      await expect(contract.update(addr1.address, 8)).to.be.revertedWith(
        "value exists"
      );
      await expect(wrapperContract.update(addr1.address, 16))
        .to.emit(wrapperContract, "Updated")
        .withArgs(addr2.address, 8);
      expect(await contract.getValue(addr1.address)).to.equal(16);
			expect(await contract.numElements()).to.equal(2);
    });
  });
});
