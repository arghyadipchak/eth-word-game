// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.0;

//import '@openzeppelin/contracts/access/Ownable.sol';
import './strings.sol';

contract WordGame {
  using strings for *;

  string word;

  constructor() {
    word = 'abdakdabra';
  }

  function getWord() public view returns (string memory) {
    return word;
  }

  function sendWord(string memory newWord) public returns (bool sufficient) {
    strings.slice memory startNew = newWord.toSlice();
    startNew._len = 1;

    if (word.toSlice().endsWith(startNew)) {
      word = newWord;
      return true;
    }

    return false;
  }
}
