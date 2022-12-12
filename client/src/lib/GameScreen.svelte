<script lang="ts">
  import { ethers } from 'ethers'
  import { currentAddress, gameAddress } from './stores'
  import PlayersTab from './PlayersTab.svelte'
  import WordsTab from './WordsTab.svelte'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'
  import { onMount } from 'svelte'

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const gameInstance = new ethers.Contract($gameAddress, WordGame.abi, provider)
  const signedGameInstance = gameInstance.connect(provider.getSigner())

  let lives = 0
  let myIndex = 0
  let turn = 0
  let word = ''
  let wordAlert = ''
  let sendingWord = false
  let waitingApp = false
  let leavingGame = false

  onMount(async () => {
    lives = await gameInstance.getLives()
    myIndex = await gameInstance.getPlayerIndex($currentAddress)
    turn = await gameInstance.getTurn()

    if (turn == myIndex) [word, waitingApp] = await gameInstance.getApproval()
    console.log(word)
  })

  function sendWord() {
    if (word === '') return
    sendingWord = true

    signedGameInstance
      .sendWord(word.toLocaleLowerCase())
      .then(sent => {
        if (sent) {
          waitingApp = true
          gameInstance.on('Turn', () => {})
        }
      })
      .catch(() => {})
    sendingWord = false
  }

  function leaveGame() {
    leavingGame = true
    signedGameInstance
      .leaveGame()
      .then(left => {
        if (left) gameAddress.update(() => '')
        else leavingGame = false
      })
      .catch(() => (leavingGame = false))
  }
</script>

<div class="flex h-screen">
  <WordsTab />
  <div class="m-auto max-h-screen justify-center">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      <div class="mb-5">
        <button class="btn btn-active">
          GAME ADDRESS: {$gameAddress}
        </button>
      </div>
      <div>
        <button class="btn btn-outline btn-accent m-2 h-20 text-xl w-60">
          LIVES LEFT: {lives}
        </button>
      </div>
      <div class="form-control mt-2">
        <input
          type="text"
          bind:value={word}
          placeholder="Enter Word"
          class="input input-bordered input-primary input-lg max-w-prose w-[32rem] text-xl"
        />
        <label class="label" for="">
          <span class="label-text-alt text-error">{wordAlert}</span>
        </label>
      </div>
      <div>
        {#if waitingApp}
          <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
            WAITING APPROVAL
          </button>
        {:else if sendingWord}
          <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
            SENDING WORD
          </button>
        {:else}
          <button
            on:click={sendWord}
            class="btn btn-primary m-2 h-20 text-xl w-60"
            disabled={leavingGame}
          >
            SEND
          </button>
        {/if}
        {#if leavingGame}
          <button class="btn btn-primary m-2 h-20 text-xl w-60 loading">
            LEAVING GAME
          </button>
        {:else}
          <button
            on:click={leaveGame}
            class="btn btn-primary m-2 h-20 text-xl w-60"
            disabled={sendingWord || waitingApp}
          >
            LEAVE
          </button>
        {/if}
      </div>
    </div>
  </div>
  <PlayersTab />
</div>
