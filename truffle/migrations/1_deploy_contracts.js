const StringSol = artifacts.require('strings')
const WordGame = artifacts.require('WordGame')

module.exports = function (deployer) {
  deployer.deploy(StringSol)
  deployer.link(StringSol, WordGame)
  deployer.deploy(WordGame)
}
