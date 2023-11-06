<h1 align="center">Ethereum Antakshari</h1>

A toy implementation of Antakshari like game on the ethereum blockchain. The game works as follows: 
There is a judge J and n players a_1, a_2 ... a_n. At k-th turn player inputs a word w_k, such that
w_k[w_k.len - 1] == w_{k-1}[0] and J determines if the word is new and valid. The game starts with a valid word set by the contract. The game ends when all but one player run out of lives, either by giving a wrong word or passing their turns.

This is the course project for the Introduction to Blockchains course at [CMI](https://www.cmi.ac.in) by
- [Arghyadip](https://github.com/arghyadipchak)
- [Arunava](https://github.com/ArunGant8)
- [Harsh](https://github.com/harsharora21)
- [Namratha](https://github.com/NamrathaG)
- [Paarth](https://github.com/Paarth314)

## Getting Started

1. Install [Truffle](https://trufflesuite.com/docs/truffle/how-to/install/)
2. Install [Ganache](https://trufflesuite.com/docs/ganache/quickstart/) for a local auto-mining blockchain \
OR Use a Test Network for dev \
OR Use the Ethereum Mainnet
3. Install [Node.js](https://nodejs.org/en/download/) and [Yarn v1](https://yarnpkg.com/getting-started/install)
4. Clone the repository
```sh
git clone https://github.com/arghyadipchak/eth-word-game
```
5. Navigate to the truffle directory
6. Setup `truffle-config.js`
7. Migrate solidity contracts and grab the `contract address` from the output
```sh
truffle migrate
```
8. Navigate to the client directory
9. Install client dependencies
```sh
yarn install
```
10. Put the `contract address` (from 7) as `deployerAddress` in `src/lib/store.ts` and as `factAddress` in `scripts/judge.js`
11.  Set an account as the Judge, set it's public key as `judgeAddress` in `src/lib/store.ts` and it's private key as `wallPrvtKey` in `scripts/judge.js`
12. Run the judge
```sh
node judge.js
```
*If you wish to use a different set of dictionary words, populate the `worddict.json` with a sorted list of your words* \

13.  Serve the client
```sh
yarn dev
```
OR Build the client
```sh
yarn build
```
and serve it using a web server such as Nginx/Traefik

## Project Report

The project report is available in the `report` directory
