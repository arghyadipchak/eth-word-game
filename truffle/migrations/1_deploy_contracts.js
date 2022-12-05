const WordGame = artifacts.require("WordGame");

module.exports = function(deployer)
{
	deployer.deploy(WordGame);
}
