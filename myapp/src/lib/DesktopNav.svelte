<script>
  import { User } from "@lucide/svelte";
  import Nav from "./Nav.svelte";
</script>

<header id="desktop">
  <div class="header-bloc">
    <section class="head-desktop">
      <h1>O'Chat</h1>
    </section>
    <Nav />
    <section class="head-user">
      <User size="42px" />
      <p>Nom d'utilisateur</p>
    </section>
  </div>
</header>

<style>
  /* Header */

  header {
    width: 350px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .header-bloc {
    position: relative;
    padding: 1rem;
    background-color: var(--dark-color);
    width: 100%;
    height: 90%;
    padding: 1rem;
    border-radius: 0 1rem 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .head-user {
    margin: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  .head-desktop {
    h1 {
      font-size: 52px;
    }
    display: block;
    position: absolute;
    top: -50px;
  }
</style>
