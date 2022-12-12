// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.0;

import './WordGame.sol';

contract WordGameFactory {
  address[] games;

  event NewGame(address game);

  function newGame(address judge) public returns (address newGameAdd) {
    newGameAdd = address(new WordGame(msg.sender, judge));
    games.push(newGameAdd);
    emit NewGame(newGameAdd);
  }

  function checkGame(address gameAdd) public view returns (bool) {
    for (uint256 i = 0; i < games.length; i++)
      if (games[i] == gameAdd) return true;
    return false;
  }
}
