// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.0;

//import '@openzeppelin/contracts/access/Ownable.sol';
import './strings.sol';

contract WordGame {
  using strings for *;
  address[] players;
  string word;
  bool hasStarted;
  uint256 turn;
  address contractCreator;

  event NewPlayer(address player);

  constructor(address creator) {
    word = 'abdakdabra';
    hasStarted = false;
    turn = 0;
    players.push(creator);
    contractCreator = creator;
    // emit NewPlayer(creator);
  }

  function playerList(uint256 i) public view returns (address) {
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
    //check is game already joined
    if (!hasStarted && !checkIfPlayer(msg.sender)) {
      // check if game has already started

      players.push(msg.sender);
      emit NewPlayer(msg.sender);
    }
  }

  function startGame() public returns (bool sufficient) {
    //start game only if a player says and s/he is contract creator
    if (checkIfPlayer(msg.sender) && msg.sender == contractCreator) {
      hasStarted = true;
      return true;
    }
    return false;
  }

  function gameStarted() public view returns (bool started) {
    return hasStarted;
  }

  function getWord() public view returns (string memory) {
    return word;
  }

  event Turn(address player, uint256 turnNumber, string word, bool correct);

  function isLastFirstSame(string memory w0, string memory w1) public pure returns (bool)
  {
    strings.slice memory s = w1.toSlice();
    s._len = 1;
    return (w0.toSlice().endsWith(s));
  }

  function sendWord(string memory newWord) public returns (bool sufficient) {
    if (players[turn] == msg.sender && isLastFirstSame(word, newWord)) 
    // the player whose turn is now sent the word and new word sent is valid
    {
        word = newWord;
        turn = turn + 1;
        turn = turn % players.length;
        emit Turn(msg.sender, turn, newWord, true);
        return true;
    }
    emit Turn(msg.sender, turn, newWord, true);
    return false;
  }

function getTurn() public view returns(uint256)
{
  return turn;
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
