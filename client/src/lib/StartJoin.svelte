<script lang="ts">
  // let validGame = true
  // let gameActive = false
  // let gameStarted = false

  let joinButton = false
  let startButton = false

  let joinAddress = ''
  let startAddress = '0xD2E4F96673DE0116FF2fFf80a42e222CD7Ec15B4'

  function toggleJoin() {
    joinButton = !joinButton
  }

  function toggleStart() {
    startButton = !startButton
  }

  function startGame() {
    //returns a start address
  }

  function joinGame() {
    // This is a function which first checks if the address is valid
    // Then goes to the next screen
  }
</script>

<div class="flex h-screen">
  <div class="m-auto">
    <div
      class="grid grid-cols-1 gap-1 place-content-center h-10 justify-items-center"
    >
      {#if startButton}
        <div>
          <p class="text-primary text-xl">
            Game Address : <br />
            {startAddress}
          </p>
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
            value={joinAddress}
            placeholder="Enter game address"
            class="input input-lg input-ghost max-w-prose w-[32rem] text-xl"
          />
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
