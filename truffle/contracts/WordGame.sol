// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.0;

contract WordGame {
  bool started;
  address owner;
  address judge;
  address winner;
  address[] players;
  mapping(address => uint256) lives;
  uint256 alive;
  uint256 turn;
  string lastWord;
  string appWord;
  bool appNeeded;

  event PlayerJoined(address player);
  event PlayerRejected(address player);
  event PlayerLeft(address player);
  event PlayerWon(address player);
  event GameStarted(address cont);
  event Approval(string word);
  event Turn(
    address player,
    uint256 playerLives,
    uint256 nextTurn,
    string word,
    bool correct
  );

  constructor(address creator, address _judge) {
    owner = creator;
    judge = _judge;
    players.push(creator);
    lives[creator] = 3;
    alive = 1;
    lastWord = 'abdakdabra';

    emit PlayerJoined(creator);
  }

  function gameStarted() public view returns (bool) {
    return started;
  }

  function getOwner() public view returns (address) {
    return owner;
  }

  function getJudge() public view returns (address) {
    return judge;
  }

  function getWinner() public view returns (address) {
    return winner;
  }

  function playerCount() public view returns (uint256) {
    return players.length;
  }

  function playerList(uint256 i) public view returns (address, bool) {
    return (players[i], lives[players[i]] != 0);
  }

  function getIndex() public view returns (uint256) {
    uint256 i;
    while (i < players.length && players[i] != msg.sender) i++;
    return i;
  }

  function getLives() public view returns (uint256) {
    return lives[msg.sender];
  }

  function getAlive() public view returns (uint256) {
    return alive;
  }

  function getLastWord() public view returns (string memory) {
    return lastWord;
  }

  function getTurn() public view returns (uint256) {
    return turn;
  }

  function getApproval() public view returns (bool, string memory) {
    return (appNeeded, appWord);
  }

  function isLastFirstSame(string memory w0, string memory w1)
    private
    pure
    returns (bool)
  {
    // strings.slice memory s = w1.toSlice();
    // s._len = 1;
    // return (w0.toSlice().endsWith(s));
    bytes memory tmp = bytes(w0);
    return tmp[tmp.length - 1] == bytes(w1)[0];
  }

  function setNextTurn() private {
    uint256 next = (turn + 1) % players.length;
    while (lives[players[next]] == 0 && next != turn) {
      next = (next + 1) % players.length;
    }
    if (next != turn) turn = next;
  }

  function decAlive() private {
    alive -= 1;
    if (alive <= 1) {
      winner = players[turn];
      emit PlayerWon(winner);
    }
  }

  function startGame() external {
    require(msg.sender == owner, 'Not Game Owner!');

    if (!started) {
      started = true;
      if (alive <= 1) {
        winner = owner;
        emit PlayerWon(winner);
      } else emit GameStarted(address(this));
    }
  }

  function joinGame() external {
    uint256 i = getIndex();
    if (started && i == players.length) emit PlayerRejected(msg.sender);
    else {
      if (!started && lives[msg.sender] == 0) {
        lives[msg.sender] = 3;
        alive += 1;
      }
      if (i == players.length) players.push(msg.sender);
      emit PlayerJoined(msg.sender);
    }
  }

  function leaveGame() external {
    uint256 i = getIndex();
    if (i < players.length) {
      if (i == turn) setNextTurn();
      lives[msg.sender] = 0;
      emit PlayerLeft(msg.sender);
      decAlive();
    }
  }

  function passTurn() external {
    lives[msg.sender] -= 1;
    setNextTurn();
    emit Turn(msg.sender, lives[msg.sender], turn, '', false);
    if (lives[msg.sender] == 0) decAlive();
  }

  function sendWord(string calldata newWord) external {
    require(started && winner == address(0), 'Not Ongoing Game!');
    require(msg.sender == players[turn] || !appNeeded, 'Not Your Turn!');

    if (isLastFirstSame(lastWord, newWord)) {
      appWord = newWord;
      appNeeded = true;
      emit Approval(newWord);
    } else {
      lives[msg.sender] -= 1;
      setNextTurn();
      emit Turn(msg.sender, lives[msg.sender], turn, newWord, false);
      if (lives[msg.sender] == 0) decAlive();
    }
  }

  function setApproval(bool approved) external {
    require(started && winner == address(0), 'Not Ongoing Game!');
    require(msg.sender == judge, 'Not Game Judge!');

    if (appNeeded) {
      address player = players[turn];
      if (approved) {
        lastWord = appWord;
      } else {
        lives[player] -= 1;
      }
      appNeeded = false;
      setNextTurn();
      emit Turn(player, lives[player], turn, appWord, approved);
      if (lives[player] == 0) decAlive();
    }
  }
}
