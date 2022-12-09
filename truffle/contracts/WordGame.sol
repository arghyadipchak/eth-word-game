// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import './strings.sol';

contract WordGame is Ownable {
  using strings for *;

  address[] players;
  bool started;
  bool ended;
  string word;
  uint256 turn;
  uint256 round;
  uint256 totalRounds;

  event NewPlayer(address player);
  event Turn(address player, uint256 turnNumber, string word, bool correct);

  constructor(address creator, uint256 rounds) {
    players.push(creator);
    started = false;
    ended = false;
    word = 'abdakdabra';
    turn = 0;
    round = 0;
    totalRounds = rounds;
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
    return (players, word, started, turn);
  }

  function getPlayer(uint256 i) public view returns (address) {
    return players[i];
  }

  function playerCount() public view returns (uint256) {
    return players.length;
  }

  function checkIfPlayer(address p) public view returns (bool sufficient) {
    for (uint256 i = 0; i < players.length; ++i) {
      if (players[i] == p) return true;
    }
    return false;
  }

  function joinGame() public {
    if (!started && !checkIfPlayer(msg.sender)) {
      // check if game hasnt started and player is not already joined
      players.push(msg.sender);
      emit NewPlayer(msg.sender);
    }
  }

  function startGame() public onlyOwner {
    started = true;
  }

  function gameStarted() public view returns (bool) {
    return started;
  }

  function getEnded() public view returns (bool) {
    return ended;
  }

  function getWord() public view returns (string memory) {
    return word;
  }

  function getTurn() public view returns (uint256) {
    return turn;
  }

  function isLastFirstSame(string memory w0, string memory w1)
    public
    pure
    returns (bool)
  {
    strings.slice memory s = w1.toSlice();
    s._len = 1;
    return (w0.toSlice().endsWith(s));
  }

  function sendWord(string memory newWord) public returns (bool sufficient) {
    if (
      players[turn] != msg.sender || ended || !isLastFirstSame(word, newWord)
    ) {
      emit Turn(msg.sender, turn, newWord, true);
      return false;
    }
    word = newWord;
    turn = turn + 1;
    turn = turn % players.length;
    if (turn == 0) {
      round = round + 1;
    }
    ended = round >= totalRounds;
    emit Turn(msg.sender, turn, newWord, true);
    return true;
  }
}
