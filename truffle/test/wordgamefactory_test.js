const WordGameFactory = artifacts.require('WordGameFactory')

contract('WordGameFactory: deployment', () => {
  it('has been deployed', async () => {
    const fundraiserFactory = WordGameFactory.deployed()
    assert(fundraiserFactory, 'wordgame factory was not deployed')
  })
})
