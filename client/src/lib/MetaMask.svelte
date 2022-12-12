<script lang="ts">
  import { onMount } from 'svelte'
  import { themeChange } from 'theme-change'
  import { currentAddress, ethereum } from './stores'

  let metaMask = false
  let refresh = false

  onMount(() => {
    themeChange(false)
    ethereum.update(() => window.ethereum)

    try {
      metaMask = $ethereum !== undefined && $ethereum.isMetaMask === true
      $ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(accs => currentAddress.update(() => accs[0] || ''))
        .catch(() => {})

      $ethereum.on('accountsChanged', accs => {
        currentAddress.update(() => accs[0] || '')
        ethereum.update(() => window.ethereum)
      })
      $ethereum.on('chainChanged', () => window.location.reload())
      $ethereum.on('disconnect', () => currentAddress.update(() => ''))
    } catch (_) {
      document.addEventListener('visibilitychange', () => {
        if (refresh && !document.hidden) window.location.reload()
      })
    }
  })
</script>

{#if !metaMask}
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
          on:click={() => (refresh = true)}
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
