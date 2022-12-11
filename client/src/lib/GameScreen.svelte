<script lang="ts">
  import { ethers } from 'ethers'
  import { gameAddress, currentAddress } from './stores'
  import PlayersTab from './PlayersTab.svelte'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const gameInst = new ethers.Contract($gameAddress, WordGame.abi, provider)
  const signerGameInst = gameInst.connect(provider.getSigner())

  let lastWord = gameInst.getLastWord()
  let myturn = false
  let mypos = gameInst.getPlayerIndex($currentAddress)
  let word = ''
  let turns = [{ no: 0, player: 'initial', word: lastWord, correct: true }]
  let currentturn = turns.at(-1).no

  gameInst.on('GameStart', updatepos)
  gameInst.on('Turn', (player, turnno, word, correct) => {
    turns.push({ no: turnno, player: player, word: word, correct: correct })
    currentturn = turnno
    if (correct) {
      lastWord = word
    }
  })

  function sendWord() {
    if (word !== '') {
      signerGameInst.sendWord(word)
      word = ''
    }
  }

  async function updatepos() {
    gameInst.getPlayerIndex($currentAddress).then(value => {
      mypos = value.toNumber()
    })
    console.log(mypos)
    console.log(currentturn)
    myturn = currentturn === mypos
  }
</script>

<div class="flex h-screen items-center">
  <PlayersTab />
  <div>
    <div>
      {#each turn.slice(-6) as singleTurn}
        {#if singleTurn.Err}
          <span class="w-32 h-24 m-1 bg-success text-success-content"
            >{singleTurn.Player} <br /> {singleTurn.Word}</span
          >
        {:else}
          <span class="w-32 h-24 m-1 bg-error text-error-content"
            >{singleTurn.Player} <br /> {singleTurn.Word}</span
          >
        {/if}
      {/each}
    </div>
    <div class="items-center">
      <div>
        {#if myturn}
          <input
            bind:value={word}
            type="text"
            class={'input w-[20rem] text-xl m-3'}
            placeholder="Enter your word"
          />
        {:else}
          <input
            bind:value={word}
            type="text"
            class={'input input-disabled w-[20rem] text-xl m-3'}
            disabled
            placeholder="Wait for your turn"
          />
        {/if}
      </div>
      <button on:click={sendWord} class="btn-primary btn m-2"> SEND </button>
      <button on:click={updatepos} class="btn"> UPDATE </button>
    </div>
  </div>
</div>

<style>
  span {
    display: inline-block;
    padding: 1em;
    text-align: center;
    border-radius: 0.5em;
  }
</style>
