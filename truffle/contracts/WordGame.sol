// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import './strings.sol';

contract WordGame is Ownable {
  using strings for *;
  address[] players;
  string word;
  bool hasStarted;
  uint256 turn;

  constructor() {
    word = 'abdakdabra';
    hasStarted = false;
    turn = 0;
  }

  function checkIfPlayer(address p) public view returns (bool sufficient) {
    for (uint256 i = 0; i < players.length; ++i) {
      if (players[i] == p) return true;
    }
    return false;
  }

  function joinGame() public returns (bool sufficient) {
    if (checkIfPlayer(msg.sender)) return true; //check is game already joined
    if (hasStarted) return false; // check if game has already started

    players.push(msg.sender);
    return true;
  }

  function startGame() public returns (bool sufficient) {
    //start game only if a player says
    if (checkIfPlayer(msg.sender)) {
      hasStarted = true;
      return true;
    }
    return false;
  }

  function getWord() public view returns (string memory) {
    return word;
  }

  function sendWord(string memory newWord) public returns (bool sufficient) {
    if (
      players[turn] == msg.sender
    ) // the player whose turn is now sent the word
    {
      strings.slice memory startNew = newWord.toSlice();
      startNew._len = 1;

      if (word.toSlice().endsWith(startNew)) // check if word sent is valid
      {
        word = newWord;
        turn = turn + 1;
        turn = turn % players.length;
        return true;
      }
    }
    return false;
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
    return (players, word, hasStarted, turn);
  }
}
