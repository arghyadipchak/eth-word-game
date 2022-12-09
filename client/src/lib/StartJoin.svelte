<script lang="ts">
  import { gameAddress, deployerAddress, currentAddress } from './stores'
  import { ethers } from 'ethers'
  import Factory from '../../../truffle/build/contracts/WordGameFactory.json'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'

  let joinButton = false
  let startButton = false
  let createButton = false
  let joinAsSpec = false
  let validGameJoined = false

  let joinAddress = ''
  let startAddress = ''
  let temp
  let flag = false

  let contractAddress
  deployerAddress.subscribe(value => {
    contractAddress = value
  })

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const instance = new ethers.Contract(contractAddress, Factory.abi, provider)
  const signer = provider.getSigner()

  function toggleJoin() {
    joinButton = !joinButton
    joinAsSpec = false
  }

  function toggleStart() {
    startButton = !startButton
  }

  async function createGame() {
    createButton = true
    const singerinstance = instance.connect(signer)
    temp = await singerinstance.newGame()

    instance.on('NewGame', (game, event) => {
      if (event.transactionHash === temp.hash) {
        startAddress = game
        gameAddress.update(_ => startAddress)
      }
      console.log(game)
    })
  }

  async function startGame() {
    const gameInstance = new ethers.Contract(
      startAddress,
      WordGame.abi,
      provider
    )
    const singerGameInstance = gameInstance.connect(signer)
    temp = await singerGameInstance.startGame()
  }

  async function joinGame() {
    const singerinstance = instance.connect(signer)
    flag = await singerinstance.checkGame(joinAddress)
    console.log(flag)
    if (flag) {
      gameAddress.update(_ => joinAddress)
      console.log($gameAddress)
      const gameInstance = new ethers.Contract(
        joinAddress,
        WordGame.abi,
        provider
      )
      const signerGameInstance = gameInstance.connect(signer)
      const flag2 = await signerGameInstance.gameStarted()
      validGameJoined = await signerGameInstance.checkIfPlayer($currentAddress)

      if (flag2 && !validGameJoined) {
        // add check for this
        joinAsSpec = true
      } else if (!validGameJoined) {
        await signerGameInstance.joinGame()
        validGameJoined = true
      }
    }
  }
</script>

<div class="flex h-screen">
  <div class="m-auto">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      {#if startButton}
        <div>
          {#if startAddress !== ''}
            <p class="text-xl">
              Game Address : <br />
              {startAddress}
            </p>
          {:else if !createButton}
            <button
              class="btn bth-lg btn-primary m-2 h-20 text-xl w-60"
              on:click={createGame}
            >
              Create Game
            </button>
          {:else}
            <button class="btn loading bth-lg btn-primary m-2 h-20 text-xl w-60"
              >generating game</button
            >
          {/if}
        </div>
        <div>
          <button
            on:click={startGame}
            class="btn bth-lg btn-primary m-2 h-20 text-xl w-60"
          >
            START
          </button>
          <button
            on:click={toggleStart}
            class="btn btn-ghost btn-primary m-2 h-15 text-lg"
          >
            BACK
          </button>
        </div>
      {:else if joinButton}
        <div>
          <input
            type="text"
            bind:value={joinAddress}
            placeholder="Enter game address"
            class="input input-lg input-ghost max-w-prose w-[32rem] text-xl"
          />
        </div>
        <div>
          {#if !joinAsSpec}
            <button
              on:click={joinGame}
              class="btn bth-lg btn-primary m-2 h-20 text-xl w-60"
            >
              JOIN
            </button>
          {:else}
            <button
              on:click={joinGame}
              class="btn bth-lg btn-primary m-2 h-20 text-xl w-60"
              >Join as spectator?
            </button>
          {/if}
          <button
            on:click={toggleJoin}
            class="btn btn-ghost btn-primary m-2 h-15 text-lg"
          >
            BACK
          </button>
        </div>
      {:else}
        <div>
          <button
            on:click={toggleStart}
            class="btn bth-lg btn-primary m-2 h-20 text-xl  w-60"
          >
            START A GAME
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
