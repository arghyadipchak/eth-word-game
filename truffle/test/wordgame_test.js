const WordGameFactory = artifacts.require('WordGameFactory')
const WordGame = artifacts.require('WordGame')

contract('WordGame: let us play', (acc) => {
  it('game check', async () => {
    let fac = await WordGameFactory.deployed();
    await fac.newGame(2);
    addr = await fac.getLastGame();
    game = new web3.eth.Contract(WordGame.abi);
    game.options.address=addr;
    out = await game.methods.getWord().call();
    assert.equal(out, 'abdakdabra','word check failed');

    // test pure function isLastFirstSame
    assert.equal(await game.methods.isLastFirstSame('air','rice').call(),true,'isLastFirstSame failed');
    assert.equal(await game.methods.isLastFirstSame('air','like').call(),false,'isLastFirstSame failed');
    
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
    // he should not be able to start it
    assert.equal(await game.methods.gameStarted().call(),false,'acc[1] was able to start game');

    // acc[0] (contract creator) starts game
    await game.methods.startGame().send({from:acc[0]});
    // he should be able to start it since s/he created a contract
    assert.equal(await game.methods.gameStarted().call(),true,'acc[0] NOT was able to start game');
    
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
    
    await game.methods.sendWord('kayak').send({from:acc[0]});
    await game.methods.sendWord('kanye').send({from:acc[1]});
    await game.methods.sendWord('elon').send({from:acc[2]});
    
    assert.equal(await game.methods.hasGameEnded().call(),true,'game has NOT ended yet');

  });

  it('leave game tests: everyone leaves', async() => {
    let fac = await WordGameFactory.deployed();
    await fac.newGame(1);
    addr = await fac.getLastGame();
    game = new web3.eth.Contract(WordGame.abi);
    game.options.address=addr;

    //Will start to play a game now

    //3 people play a game
    await game.methods.joinGame().send({from:acc[0]});
    await game.methods.joinGame().send({from:acc[1]});
    await game.methods.joinGame().send({from:acc[2]});

    await game.methods.startGame().send({from:acc[0]});

    await game.methods.leaveGame().send({from:acc[1]});

    // acc[1] should no longer be a player
    assert.equal(await game.methods.checkIfPlayer(acc[1]).call(),false,'acc[1] is a player');
    
    // acc[0] sends word

    await game.methods.sendWord('abs').send({from:acc[0]});
    // turn of acc[2]
    assert.equal(await game.methods.getTurn().call(),2,'turn of acc[2] did NOT come');
    
    // acc[2] leaves
    await game.methods.leaveGame().send({from:acc[2]});
    // game should end
    assert.equal(await game.methods.hasGameEnded().call(),true,'game has NOT ended');
    
  });

  it('leave game tests: some people leave', async() => {
    let fac = await WordGameFactory.deployed();
    await fac.newGame(2);
    addr = await fac.getLastGame();
    game = new web3.eth.Contract(WordGame.abi);
    game.options.address=addr;
    game.options.gas = 5000000;

    //Will start to play a game now

    //3 people play a game
    await game.methods.joinGame().send({from:acc[0]});
    await game.methods.joinGame().send({from:acc[1]});
    await game.methods.joinGame().send({from:acc[2]});

    await game.methods.startGame().send({from:acc[0]});

    

    // acc[0] sends word
    await game.methods.sendWord('abs').send({from:acc[0]});

    //acc[1] leaves game
    await game.methods.leaveGame().send({from:acc[1]});
    // acc[1] should no longer be a player
    assert.equal(await game.methods.checkIfPlayer(acc[1]).call(),false,'acc[1] is a player');
    
    // turn of acc[2]
    await game.methods.sendWord('story').send({from:acc[2], gas: 5000000});
    assert.equal(await game.methods.getWord().call(),'story','acc[2] was NOT able to send word');

    // turn of acc[0]
    await game.methods.sendWord('yak').send({from:acc[0]});
    assert.equal(await game.methods.getWord().call(),'yak','acc[0] was NOT able to send word');
    
    // acc[2] leaves
    await game.methods.leaveGame().send({from:acc[2]});
    // game should end
    assert.equal(await game.methods.hasGameEnded().call(),true,'game has NOT ended');
    
  });

  it('leave game tests: some people leave 2', async() => {
    let fac = await WordGameFactory.deployed();
    await fac.newGame(2);
    addr = await fac.getLastGame();
    game = new web3.eth.Contract(WordGame.abi);
    game.options.address=addr;
    game.options.gas = 5000000;

    //Will start to play a game now

    //3 people play a game
    await game.methods.joinGame().send({from:acc[0]});
    await game.methods.joinGame().send({from:acc[1]});
    await game.methods.joinGame().send({from:acc[2]});

    await game.methods.startGame().send({from:acc[0]});

    

    // acc[0] sends word
    await game.methods.sendWord('abs').send({from:acc[0]});

    // turn of acc[1]
    await game.methods.sendWord('story').send({from:acc[1]});
    assert.equal(await game.methods.getWord().call(),'story','acc[1] was NOT able to send word');
    
    //acc[2] leaves game
    await game.methods.leaveGame().send({from:acc[2]});
    // acc[2] should no longer be a player
    assert.equal(await game.methods.checkIfPlayer(acc[2]).call(),false,'acc[2] is a player');

    // turn of acc[0]
    await game.methods.sendWord('yak').send({from:acc[0]});
    assert.equal(await game.methods.getWord().call(),'yak','acc[0] was NOT able to send word');
    
  });

  it('leave game tests: some people leave 3', async() => {
    let fac = await WordGameFactory.deployed();
    await fac.newGame(1);
    addr = await fac.getLastGame();
    game = new web3.eth.Contract(WordGame.abi);
    game.options.address=addr;
    game.options.gas = 5000000;

    //Will start to play a game now

    //3 people play a game
    await game.methods.joinGame().send({from:acc[0]});
    await game.methods.joinGame().send({from:acc[1]});
    await game.methods.joinGame().send({from:acc[2]});

    await game.methods.startGame().send({from:acc[0]});

    

    // acc[0] sends word
    await game.methods.sendWord('abs').send({from:acc[0]});

    // turn of acc[1]
    await game.methods.sendWord('story').send({from:acc[1]});
    assert.equal(await game.methods.getWord().call(),'story','acc[1] was NOT able to send word');
    
    //acc[2] leaves game
    await game.methods.leaveGame().send({from:acc[2]});
    // acc[2] should no longer be a player
    assert.equal(await game.methods.checkIfPlayer(acc[2]).call(),false,'acc[2] is a player');

    // game should end
    assert.equal(await game.methods.hasGameEnded().call(),true,'game has NOT ended yet');
    
  });
})
