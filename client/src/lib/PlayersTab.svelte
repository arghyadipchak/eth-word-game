<script lang="ts">
  import { currentAddress, gameInst } from './stores'

  let players = []
  let alive = {}

  gameInst.subscribe(async gameI => {
    let tmp
    let tmpPlayers = []
    let tmpAlive = {}
    for (let i = 0; i < (await gameI.playerCount()); i++) {
      tmp = await gameI.playerList(i)
      tmpPlayers.push(tmp[0])
      tmpAlive[tmp[0]] = tmp[1]
    }
    players = tmpPlayers
    alive = tmpAlive

    gameI.on('PlayerJoined', player => {
      if (!players.includes(player)) players.push(player)
      alive[player] = true
    })
    gameI.on('PlayerLeft', player => {
      alive[player] = false
    })
    gameI.on('Turn', (player, playerLives, nextTurn, word, correct, event) => {
      if (playerLives == 0) alive[player] = false
    })
  })
</script>

<div class="m-auto h-2/3 overflow-x-hidden overflow-y-auto border-2 rounded-xl">
  <div class="flex flex-col gap-1 items-center">
    <span class="text-lg m-2 font-semibold">Players</span>
    {#each players as player}
      {#if alive[player]}
        {#if player.toLowerCase() == $currentAddress}
          <div
            class="bg-primary-focus text-primary-content w-full p-2 font-semibold font-mono"
          >
            {player}
          </div>
        {:else}<div
            class="bg-primary text-primary-content w-full p-2 font-semibold font-mono"
          >
            {player}
          </div>{/if}
      {:else}
        <div
          class="bg-error text-error-content w-full p-2 font-semibold font-mono"
        >
          {player}
        </div>
      {/if}
    {/each}
  </div>
</div>
