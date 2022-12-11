// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.0;

import './strings.sol';

contract WordGame {
  using strings for *;

  bool started;
  bool ended;
  address owner;
  address judge;
  address[] players;
  mapping(address => uint256) lives;
  uint256 turn;
  string lastWord;
  string appWord;
  bool appNeeded;

  event NewPlayer(address player);
  event PlayerDied(address player);
  event GameStart(address cont);
  event Approval(string word);
  event Turn(address player, uint256 turn, string word, bool correct);

  constructor(address creator, address _judge) {
    owner = creator;
    judge = _judge;
    players.push(creator);
    lives[creator] = 3;
    lastWord = 'abdakdabra';

    emit NewPlayer(creator);
  }

  function getState()
    public
    view
    returns (
      address[] memory,
      string memory,
      bool,
      uint256
    )
  {
    return (players, lastWord, started, turn);
  }

  function gameStarted() public view returns (bool) {
    return started;
  }

  function gameEnded() public view returns (bool) {
    return ended;
  }

  function startGame() public returns (bool) {
    if (started || msg.sender != owner) return false;

    started = true;
    emit GameStart(address(this));
    return true;
  }

  function playerList(uint256 i) public view returns (address, bool) {
    return (players[i], lives[players[i]] != 0);
  }

  function playerCount() public view returns (uint256) {
    return players.length;
  }

  function getPlayerIndex(address p) public view returns (uint256) {
    uint256 i;
    while (i < players.length && players[i] != p) i++;
    return i;
  }

  function joinGame() public returns (bool) {
    if (started) return false;

    if (getPlayerIndex(msg.sender) < players.length) {
      lives[msg.sender] = 5;
      emit NewPlayer(msg.sender);
      return true;
    } else if (lives[msg.sender] == 0) {
      players.push(msg.sender);
      lives[msg.sender] = 5;
      emit NewPlayer(msg.sender);
      return true;
    }
    return false;
  }

  function leaveGame() public returns (bool) {
    uint256 i = getPlayerIndex(msg.sender);
    if (i == players.length) return false;

    if (turn == i) setNextTurn();
    lives[msg.sender] = 0;
    emit PlayerDied(msg.sender);
    return true;
  }

  function getLives() public view returns (uint256) {
    return lives[msg.sender];
  }

  function decLive(address p) private {
    if (lives[p] > 0) {
      lives[p]--;
      if (lives[p] == 0) emit PlayerDied(p);
    }
  }

  function getLastWord() public view returns (string memory) {
    return lastWord;
  }

  function getTurn() public view returns (uint256) {
    return turn;
  }

  function isLastFirstSame(string memory w0, string memory w1)
    private
    pure
    returns (bool)
  {
    strings.slice memory s = w1.toSlice();
    s._len = 1;
    return (w0.toSlice().endsWith(s));
  }

  function setNextTurn() private {
    uint256 next = (turn + 1) % players.length;
    while (lives[players[next]] == 0 && next != turn) {
      next = (next + 1) % players.length;
    }
    if (next == turn) ended = true;
    else turn = next;
  }

  function sendWord(string memory newWord) public returns (bool) {
    if (!started || ended || players[turn] != msg.sender || appNeeded)
      return false;

    if (!isLastFirstSame(lastWord, newWord)) {
      decLive(msg.sender);
      setNextTurn();

      emit Turn(msg.sender, turn, newWord, false);
      return false;
    }

    appWord = newWord;
    appNeeded = true;
    emit Approval(newWord);
    return true;
  }

  function setApproval(bool approved) public returns (bool) {
    if (msg.sender != judge || !appNeeded) return false;

    if (approved) {
      lastWord = appWord;
    } else {
      decLive(players[turn]);
    }
    appNeeded = false;
    setNextTurn();

    emit Turn(players[turn], turn, appWord, approved);
    return true;
  }
}
