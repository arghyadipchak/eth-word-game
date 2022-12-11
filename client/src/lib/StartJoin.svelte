<script lang="ts">
  import {
    currentAddress,
    deployerAddress,
    gameAddress,
    judgeAddress,
    spectator
  } from './stores'
  import { ethers } from 'ethers'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'
  import WGFactory from '../../../truffle/build/contracts/WordGameFactory.json'

  let createButton = false
  let joinButton = false
  let joinAddress = ''
  let joinAlert = ''

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const factoryInstance = new ethers.Contract(
    $deployerAddress,
    WGFactory.abi,
    provider
  )
  const signedInstance = factoryInstance.connect(provider.getSigner())

  function toggleJoin() {
    joinButton = !joinButton
    joinAlert = ''
  }

  function createGame() {
    createButton = true
    let temp
    signedInstance
      .newGame(judgeAddress)
      .then(game => (temp = game))
      .catch(() => (createButton = false))

    factoryInstance.on('NewGame', (game, event) => {
      if (event.transactionHash == temp.hash) gameAddress.update(() => game)
    })
  }

  async function joinGame() {
    console.log('Bruh')
    if (joinAddress === '') {
      joinAlert = ''
      return
    }

    try {
      if (!(await factoryInstance.checkGame(joinAddress))) throw ''
      joinAlert = ''
    } catch (_) {
      joinAlert = 'Invalid Game Address!'
      return
    }

    const gameInstance = new ethers.Contract(
      joinAddress,
      WordGame.abi,
      provider
    )
    if (
      (await gameInstance.getPlayerIndex($currentAddress)) <
        (await gameInstance.playerCount()) &&
      (await gameInstance.getLives()) != 0
    ) {
      gameAddress.update(() => joinAddress)
    } else if (await gameInstance.gameStarted()) {
      spectator.update(() => true)
    } else if (await gameInstance.connect(provider.getSigner()).joinGame()) {
      gameAddress.update(() => joinAddress)
    } else {
      joinAlert = 'Unable to Join Game!'
    }
  }
</script>

<div class="flex h-screen">
  <div class="m-auto">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      {#if joinButton}
        <div class="form-control">
          <input
            type="text"
            bind:value={joinAddress}
            placeholder="Enter Game Address"
            class="input input-bordered input-primary input-lg max-w-prose w-[32rem] text-xl"
          />
          <label class="label" for="">
            <span class="label-text-alt text-error">{joinAlert}</span>
          </label>
        </div>
        <div>
          <button
            on:click={joinGame}
            class="btn bth-lg btn-primary m-2 h-20 text-xl w-60"
          >
            JOIN
          </button>
          <button
            on:click={toggleJoin}
            class="btn btn-ghost btn-primary m-2 h-15 text-lg"
          >
            BACK
          </button>
        </div>
      {:else if createButton}
        <div>
          <button class="btn bth-lg btn-primary m-2 h-20 text-xl w-60 loading">
            CREATING GAME
          </button>
        </div>
      {:else}
        <div>
          <button
            on:click={createGame}
            class="btn bth-lg btn-primary m-2 h-20 text-xl w-60"
          >
            CREATE A GAME
          </button>
        </div>
        <div>
          <button
            on:click={toggleJoin}
            class="btn bth-lg btn-primary m-2 h-20 text-xl  w-60"
          >
            JOIN A GAME
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
