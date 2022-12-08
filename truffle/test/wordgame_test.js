const WordGameFactory = artifacts.require('WordGameFactory')
const WordGame = artifacts.require('WordGame')

contract('WordGame: let us play', (acc) => {
  it('game check', async () => {
    let fac = await WordGameFactory.deployed();
    await fac.newGame();
    addr = await fac.getLastGame();
    game = new web3.eth.Contract(WordGame.abi);
    game.options.address=addr;
    out = await game.methods.getWord().call();
    assert.equal(out, 'abdakdabra','word check failed');

    //Will start to play a game now

    //3 people play a game
    await game.methods.joinGame().send({from:acc[0]});
    assert.equal(await game.methods.checkIfPlayer(acc[0]).call(),true,'acc[0] is NOT a player');
    
    await game.methods.joinGame().send({from:acc[1]});
    assert.equal(await game.methods.checkIfPlayer(acc[1]).call(),true,'acc[1] is NOT a player');
    
    await game.methods.joinGame().send({from:acc[2]});
    assert.equal(await game.methods.checkIfPlayer(acc[2]).call(),true,'acc[2] is NOT a player');
    
    //some other guy tries to start a game
    await game.methods.startGame().send({from:acc[3]});
    //other guy should not be able to start it
    assert.equal(await game.methods.gameStarted().call(),false,'other guy was able to start game');
    
    // acc[1] starts game
    await game.methods.startGame().send({from:acc[1]});
    assert.equal(await game.methods.gameStarted().call(),true,'acc[1] was NOT able to start game');
    
    // acc[1] tries to send a word
    await game.methods.sendWord('atom').send({from:acc[1]});
    // he fails cause not his turn
    assert.equal(await game.methods.getWord().call(),'abdakdabra','acc[1] was able to send word when not his turn');
    // acc[0] sends a wrong word
    await game.methods.sendWord('bat').send({from:acc[0]});
    // he should fail
    assert.equal(await game.methods.getWord().call(),'abdakdabra','acc[0] was able to send wrong word');
    
    // acc[0] sends a corrct word
    await game.methods.sendWord('abs').send({from:acc[0]});
    // he should succed
    assert.equal(await game.methods.getWord().call(),'abs','acc[0] was NOT able to send correct word');
    //acc[1]'s turn should come
    assert.equal(await game.methods.getTurn().call(),1,'turn of acc[1] did NOT come');
    
    // now play until acc[0]'s turn comes

    await game.methods.sendWord('story').send({from:acc[1]});
    await game.methods.sendWord('yak').send({from:acc[2]});

    // acc[0]'s turn
    assert.equal(await game.methods.getTurn().call(),0,'turn of acc[0] did NOT come');
    
  })
})
