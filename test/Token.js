const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", () => {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("Token");
    const [owner, address1, address2] = await ethers.getSigners();

    const hardhatToken = await Token.deploy();
    await hardhatToken.deployed();

    return { Token, hardhatToken, owner, address1, address2 };
  }

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async () => {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);

      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", () => {
    it("Should transfer tokens between accounts", async () => {
      const { hardhatToken, owner, address1, address2 } = await loadFixture(deployTokenFixture);

      await expect(
        hardhatToken.transfer(address1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, address1], [-50, 50]);

      await expect(
        hardhatToken.connect(address1).transfer(address2.address, 50)
      ).to.emit(hardhatToken, "Transfer").withArgs(address1.address, address2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async () => {
      const { hardhatToken, owner, address1 } = await loadFixture(deployTokenFixture);
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      await expect(
        hardhatToken.connect(address1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });
});
