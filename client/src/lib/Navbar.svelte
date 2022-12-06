<script>
  let CurrentAddress

  if (window.ethereum !== undefined) {
    CurrentAddress = window.ethereum.selectedAddress
  }
  try {
    window.ethereum.on('accountsChanged', function () {
      CurrentAddress = window.ethereum.selectedAddress
    })
  } catch (error) {}
</script>

<div class="navbar bg-base-100">
  <div class="flex-1">
    <button class="btn btn-ghost normal-case text-xl text-primary"
      >BlockChain Antakshari</button
    >
  </div>

  <label class="swap justify-items-end">
    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" />
    <p class="swap-on btn m-1">
      CURRENT :&nbsp&nbsp <span class="normal-case">{CurrentAddress}</span>
    </p>
    <p class="swap-off fill-current btn m-1">ACCOUNT</p>
  </label>
</div>
