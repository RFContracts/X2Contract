var Migrations = artifacts.require("./Migrations.sol");
var X2Contract = artifacts.require("./X2Contract.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(X2Contract);
};
