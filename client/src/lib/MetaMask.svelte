<script>
  import { onMount } from 'svelte'

  let MetaMaskConnected = false
  let WalletConnected

  if (window.ethereum !== undefined) {
    WalletConnected = window.ethereum.selectedAddress
  }

  try {
    onMount(async () => {
      if (!(window.ethereum === undefined) && window.ethereum.isMetaMask) {
        MetaMaskConnected = true
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
        } catch (error) {
          console.log('Refresh page')
        }
      }
    })

    window.ethereum.on('accountsChanged', function () {
      WalletConnected = true
    })
  } catch (error) {}
</script>

{#if !MetaMaskConnected}
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
          href="https://metamask.io"
          target="_blank"
          rel="noreferrer"
          class="btn bth-primary">Install MetaMask</a
        >
      </div>
    </div>
  </div>
{:else if !WalletConnected}
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
