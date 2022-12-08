// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.0;

import './WordGame.sol';

contract WordGameFactory {
  address[] games;
  mapping(address => string) names;

  event NameChanged(address user, string name);
  event NewGame(address game);

  function newGame(uint256 n) public returns (address newGameAdd) {
    newGameAdd = address(new WordGame(msg.sender,n));
    games.push(newGameAdd);
    emit NewGame(newGameAdd);
  }

  function checkGame(address gameAdd) public view returns (bool) {
    for (uint256 i = 0; i < games.length; i++)
      if (games[i] == gameAdd) return true;
    return false;
  }

  function setName(string memory name) public {
    names[msg.sender] = name;
    emit NameChanged(msg.sender, name);
  }

  function getName() public view returns (string memory) {
    return names[msg.sender];
  }

  function getLastGame() public view returns (address)
  {
    return games[games.length-1];
  }
}
