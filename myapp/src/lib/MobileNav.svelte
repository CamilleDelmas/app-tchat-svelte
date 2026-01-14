<script>
  import { Menu } from "@lucide/svelte";
  import { User } from "@lucide/svelte";
  import Nav from "./Nav.svelte";

  let isOn = $state();

</script>

  <header id="mobile">
    <section class="head-desktop">
      <h1>O'Chat</h1>
    </section>
    <section class="head-mobile">
      <button id="burger-button" class="burger" onclick={() => isOn = !isOn}>
        <Menu size="42px" />
      </button>
      <h1>O'Chat</h1>
      <User size="42px" />
    </section>
    {#if isOn}
    <Nav />
    {/if}
    <section class="head-user">
      <User size="42px" />
      <p>Nom d'utilisateur</p>
    </section>
  </header>

<style>
/* Header */
  header {
    position: sticky;
    top: 0;
    width: 100%;
    padding: 1rem;
    background-color: var(--dark-color);
  }
  .head-desktop {
    display: none;
  }
  .head-mobile {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .head-user {
    display: none;
  }
  .burger {
    background-color: var(--dark-color);
    color: var(--neutral-color);
  }

</style>