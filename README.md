# Word Game

This is a toy implementation of Antakshari like game on blockchain. The game works like this. 
There is a judge J and n players a1, a2 ... an. At k-th turn player inputs a word wk, such that
wk[wk.len-1]==wk-1[0] and J determines it to be valid word. 

In first turn the valid word is set by the contract. 
The game never ends when all but one player run out of lives, either by guessing a wrong word or passing their turns.
