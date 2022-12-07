// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.0;

import './WordGame.sol';

contract WordGameFactory {
  address[] public games;

  constructor() {}

  function newGame() public returns (address newGameAdd) {
    WordGame game = new WordGame();
    newGameAdd = address(game);
    games.push(newGameAdd);
  }
}
