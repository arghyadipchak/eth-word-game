const WordGameFactory = artifacts.require('WordGameFactory')
const WordGame = artifacts.require('WordGame')

contract('WordGameFactory: deployment', () => {
  it('has been deployed', async () => {
    const fundraiserFactory = WordGameFactory.deployed()
    assert(fundraiserFactory, 'wordgame factory was not deployed')
  })
})
