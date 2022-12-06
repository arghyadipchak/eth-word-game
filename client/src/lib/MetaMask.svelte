<script>
  import { onMount } from 'svelte'

  let MetaMaskConnected = false
  let WalletConnected = window.ethereum.selectedAddress !== null

  // const onClickInstall = () => {
  //   onboardButton.innerText = 'Onboarding in progress';
  //   onboardButton.disabled = true;
  //   //On this object we have startOnboarding which will start the onboarding process for our end user
  //   onboarding.startOnboarding();
  // };

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

  window.ethereum.on('accountsChanged', function (accounts) {
    WalletConnected = true
  })
</script>

{#if !MetaMaskConnected}
  <input type="checkbox" id="my-modal" class="modal-toggle" checked={true} />
  <div class="modal">
    <div class="modal-box flex flex-col items-center text-center">
      <h3 class="font-bold text-lg text-error">MetaMask Plugin Required!</h3>
      <p class="py-4">
        You have to install the MetaMask plugin to play the game
      </p>
      <div class="modal-action">
        <a
          href="https://metamask.io"
          target="_blank"
          rel="noreferrer"
          class="btn">Install MetaMask</a
        >
      </div>
    </div>
  </div>
{:else if !WalletConnected}
  <input type="checkbox" id="my-modal" class="modal-toggle" checked={true} />
  <div class="modal">
    <div class="modal-box flex flex-col items-center text-center">
      <h3 class="font-bold text-lg text-error">
        Please connect your MetaMask account
      </h3>
      <div class="modal-action">
        <div class="grid gap-2">
          <div class="flex items-center justify-center space-x-2 animate-pulse">
            <div class="w-8 h-8 bg-red-500 rounded-full" />
            <div class="w-8 h-8 bg-red-500 rounded-full" />
            <div class="w-8 h-8 bg-red-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
