<script>
  import { gameAddress, currentAddress, plays } from './stores'
  import { ethers } from 'ethers'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'
  import PlayersTab from './playersTab.svelte'

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const gameInstance = new ethers.Contract($gameAddress, WordGame.abi, provider)
  const singerGameInstance = gameInstance.connect(signer)

  let lastWord = 'abrakadabra'
  let play = 0
  let myturn = false
  let mypos = gameInstance.getPlayerIndex($currentAddress)
  let word = ''
  let turn = [{ Player: 'initial', Turnno: 0, Word: 'abrakadabra', Err: true }]
  let currentturn = turn.at(-1).Turnno

  singerGameInstance.on('GameStart', x => {
    updatepos()
  })

  gameInstance.on('Turn', (player, turnnumber, word, correct) => {
    turn.push({ Player: player, Turnno: turnnumber, Word: word, Err: correct })
    if (correct) {
      lastWord = word
    }
    currentturn = turnnumber
  })

  function addWord() {
    if (word !== '') {
      singerGameInstance.sendWord(word)
      word = ''
    }
  }

  async function updatepos() {
    await gameInstance.getPlayerIndex($currentAddress).then(value => {
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
      <button on:click={addWord} class="btn-primary btn m-2">
        send word
      </button>
      <button on:click={updatepos} class="btn">yyyyy</button>
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
