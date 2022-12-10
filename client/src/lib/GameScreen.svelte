<script>
  import { gameAddress, currentAddress, plays } from './stores'
  import { ethers } from 'ethers'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const gameInstance = new ethers.Contract($gameAddress, WordGame.abi, provider)
  const singerGameInstance = gameInstance.connect(signer)

  let words = []
  let play = 0
  let myturn = false
  let mypos = $plays.indexOf
  let word = ''
  let turn = []

  gameInstance.on('Turn', (player, turnnumber, word, correct) =>
    turn.push({ player: player, turnno: turnnumber, word: word, err: correct })
  )

  function addWord() {
    if (word !== '') {
      words.push(word)
      words = words
      word = ''
      console.log(words)
    }
  }

  function removeWord() {
    if (words.length > 1) {
      words.pop()
      words = words
      console.log(words)
    }
  }
</script>

<div class="flex h-screen items-center">
  <div>
    <div>
      {#each words.slice(-6) as word1}
        <span class="w-32 h-24 m-1 bg-success text-success-content"
          >{word1}</span
        >
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
      <button on:click={addWord} class="btn-primary btn m-2">
        send word
      </button>
    </div>
  </div>
</div>

<style>
  /* h1 {
    margin: 0.8em 0;
  } */
  span {
    display: inline-block;
    padding: 1em;
    text-align: center;
    border-radius: 0.5em;

    /* margin: 0.8em 0; */
  }
</style>
