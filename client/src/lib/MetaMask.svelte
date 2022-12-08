<script lang="ts">
  import { onMount } from 'svelte'
  import { themeChange } from 'theme-change'

  onMount(() => {
    themeChange(false)
  })

  let metaMask = false
  import { refresh, currentAddress } from './stores.js'
  let ethereum = window.ethereum

  let myAddress = ''
  currentAddress.subscribe(value => {
    myAddress = value
  })

  try {
    metaMask = ethereum === undefined || ethereum.isMetaMask === false
    console.log(myAddress)
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(accs => currentAddress.update(current => accs[0]))
      .catch(() => {})

    ethereum.on('accountsChanged', accs =>
      currentAddress.update(current => accs[0] || '')
    )
  } catch (_) {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && refresh) location.reload()
    })
  }
</script>

{#if metaMask}
  <input
    type="checkbox"
    id="MetaMaskConnect"
    class="modal-toggle"
    checked={true}
  />
  <div class="modal backdrop-blur-sm">
    <div class="modal-box flex flex-col items-center text-center">
      <h2 class="font-bold text-lg text-error">MetaMask Plugin Required!</h2>
      <p class="py-4 text-currentColor">
        You have to install the MetaMask plugin to play the game
      </p>
      <div class="modal-action">
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noreferrer"
          on:click={() => refresh.update(curr => true)}
          class="btn bth-primary">Install MetaMask</a
        >
      </div>
    </div>
  </div>
{:else if $currentAddress === ''}
  <input
    type="checkbox"
    id="WalletConnect"
    class="modal-toggle"
    checked={true}
  />
  <div class="modal backdrop-blur-sm">
    <div class="modal-box flex flex-col items-center text-center">
      <h1 class="font-bold text-lg text-error">
        Please connect your MetaMask account
      </h1>
      <div class="modal-action">
        <div class="grid gap-2">
          <div class="flex items-center justify-center space-x-2 animate-pulse">
            <div class="w-4 h-4 bg-primary rounded-full" />
            <div class="w-4 h-4 bg-primary rounded-full" />
            <div class="w-4 h-4 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
