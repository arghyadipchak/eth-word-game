<script lang="ts">
  import { currentAddress, gameAddress } from './stores'
  import { ethers } from 'ethers'
  import StartJoin from './StartJoin.svelte'
  import GameScreen from './GameScreen.svelte'
  import WaitingScreen from './WaitingScreen.svelte'
  import WordGame from '../../../truffle/build/contracts/WordGame.json'
  import { onMount } from 'svelte'

  let gameStarted = false

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const gameInst = new ethers.Contract($gameAddress, WordGame.abi, provider)

  // onMount(async () => (gameStarted = await gameInst.gameStarted()))
  gameInst.on('GameStart', gameAdd => (gameStarted = gameAddress == gameAdd))

  // Override
  // gameAddress.update(() => '0x57a9FbE0a9D41119C0d9fDD0035EC9Da580b40ed')
</script>

{#if $gameAddress === ''}
  <StartJoin />
{:else if !gameStarted}
  <WaitingScreen />
{:else}
  <GameScreen />
{/if}
