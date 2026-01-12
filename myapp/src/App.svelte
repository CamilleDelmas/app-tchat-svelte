<script>
  import { Menu } from "@lucide/svelte";
  import { User } from "@lucide/svelte";
  import { CirclePlus } from "@lucide/svelte";
</script>

<header>
  <section class="head">
    <Menu size="42px" />
    <h1>O'Chat</h1>
    <User size="42px" />
  </section>
  <nav class="menu-mobile">
      <div class="menu-mobile__add">
        <button><CirclePlus size="42px" /></button>
        <label for="">Ajouter une discussion</label>
      </div>
      <div class="menu-mobile__add">
        <button><CirclePlus size="42px" /></button>
        <label for="">Discussions récentes</label>
      </div>
  </nav>
</header>

<main></main>

<style>
  header {
    padding: 1rem;
    background-color: var(--dark-color);
  }

  .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    .menu-mobile__add {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }
  }

  h1 {
    margin-inline-start: 9rem;
  }

  /*Large mobile*/
  @media (min-width: 576px) {
    /* ... */
  }

  /* Tablettes */
  @media (min-width: 768px) {
    /* ... */
  }

  /* Desktop */
  @media (min-width: 992px) {
    /* ... */
  }

  /* Desktop HD */
  @media (min-width: 1200px) {
    /* ... */
  }

  /* Desktop Wide */
  @media (min-width: 1400px) {
    /* ... */
  }
</style>
