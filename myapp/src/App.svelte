<script>
  import { Menu } from "@lucide/svelte";
  import { User } from "@lucide/svelte";
  import { Plus } from "@lucide/svelte";
  import { MessageSquareText } from "@lucide/svelte";
  import { Trash2 } from "@lucide/svelte";
</script>

<div class="container">
  <header>
    <section class="head-desktop">
      <h1>O'Chat</h1>
    </section>
    <section class="head-mobile">
      <Menu size="42px" />
      <h1>O'Chat</h1>
      <User size="42px" />
    </section>
    <nav class="menu">
      <div class="menu__add">
        <button><Plus size={42} /></button>
        <label for="">Ajouter une discussion</label>
      </div>
      <div class="menu__add">
        <MessageSquareText size={42} strokeWidth={1.5} />
        <label for="">Discussions récentes</label>
      </div>
      <div class="menu__talk">
        <div class="talk">
          <p>Javascript</p>
          <Trash2 size={24} strokeWidth={1.5} />
        </div>
        <div class="talk">
          <p>Javascript</p>
          <Trash2 size={24} strokeWidth={1.5} />
        </div>
      </div>
    </nav>
    <section class="head-user">
      <User size="42px" />
      <p>Nom d'utilisateur</p>
    </section>
  </header>

  <main>
    <div class="robot-talk">
      <h2>Titre 2</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
        efficitur quis orci at sagittis. Etiam vitae posuere felis, sit amet
        egestas erat. Duis odio lacus, <a href="#">molestie</a> id aliquam eget,
        sagittis id arcu. Nulla commodo odio sed mi porta laoreet. Suspendisse auctor
        varius sem sed commodo. Aliquam varius sapien ut tellus consectetur aliquet.
      </p>
      <h3>Titre 3</h3>
      <p>
        Nam suscipit scelerisque imperdiet. Maecenas sit amet porttitor erat.
        Sed placerat sodales volutpat. Etiam suscipit lacinia mi, sed luctus
        lorem semper vitae. Fusce leo lacus, molestie sit amet tincidunt sit
        amet, commodo et orci. Mauris sapien urna, posuere pretium commodo ut,
        lacinia ac odio. Cras leo mauris, imperdiet accumsan rutrum in, mattis
        vitae nisl. Sed felis urna, lobortis a magna ut, condimentum bibendum
        mauris. Etiam eu nisl tellus.
      </p>
      <ul>
        <li>Test</li>
        <li>Ici</li>
        <li>Test</li>
        <li>Ici</li>
      </ul>
      <p>
        Curabitur fermentum sit amet est quis venenatis. Ut tortor purus,
        iaculis porta diam nec, laoreet rutrum ex. Fusce quis lectus non velit
        vehicula fermentum vitae ut libero. Pellentesque rutrum semper dolor, a
        egestas nisi dictum id. Sed volutpat malesuada tortor, sit amet
        pellentesque elit tempus a. Cras sed convallis ligula. Morbi ac
        tristique velit. Donec a volutpat ligula. Sed ac augue semper, tincidunt
        justo quis, tristique sapien. Suspendisse vel tempus ligula. Proin
        ullamcorper dolor non suscipit consectetur. Nullam at fermentum ex, ac
        congue turpis. Pellentesque finibus vehicula sem vel fringilla.
      </p>
    </div>
    <div class="user-talk">
      Ut eros odio, dapibus rutrum rutrum in, tempor at tortor. Pellentesque
      mattis tristique augue, vel euismod augue efficitur at. Donec volutpat
      accumsan pellentesque. Suspendisse nunc est, dapibus sit amet neque eget,
      consequat malesuada <a href="#">libero</a>. Aenean at ultricies leo, non
      fermentum nulla. Integer nec auctor est, eu pellentesque orci. Aenean
      egestas a nulla vel egestas. Nam aliquam sapien eget aliquam commodo. Cras
      id mauris sed metus laoreet euismod. Vivamus maximus lectus ac lectus
      dapibus maximus. Suspendisse consequat molestie enim, et tincidunt velit
      fermentum at. Quisque dolor quam, auctor eget erat ut, hendrerit imperdiet
      dolor. Vivamus congue felis in nisl facilisis scelerisque. Aenean et
      tellus urna. Proin quam orci, efficitur vitae risus nec, convallis
      imperdiet lorem. Aenean mattis urna vitae nunc suscipit, eu malesuada eros
      maximus. Donec tristique nibh a tellus hendrerit sagittis. Proin egestas
      diam sed urna euismod sagittis. Nam quis arcu semper, porttitor diam a,
      euismod sem.
      <p class="user-talk__time">9:00</p>
    </div>

    <div class="robot-talk">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque efficitur
      quis orci at sagittis. Etiam vitae posuere felis, sit amet egestas erat.
      Duis odio lacus, molestie id aliquam eget, sagittis id arcu. Nulla commodo
      odio sed mi porta laoreet. Suspendisse auctor varius sem sed commodo.
    </div>
    <div class="hide"></div>
    <div class="reply">
      <p>
        Nam suscipit scelerisque imperdiet. Maecenas sit amet porttitor erat.
      </p>
      <button>Envoyer</button>
    </div>
  </main>
</div>

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

  nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    .menu__add {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }
    .menu__talk {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .talk {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      gap: 1rem;
      p {
        color: var(--dark-color);
        text-align: left;
        background-color: var(--neutral-color);
        min-width: 10rem;
        padding: 0.3rem 1rem;
        border-radius: 1rem;
      }
    }
  }

  /* Main */

  main {
    width: 88%;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
  }

  .robot-talk {
    margin-block-end: 1rem;
  }
  .user-talk {
    max-width: 86%;
    padding: 1.5rem;
    margin-block-end: 1rem;
    background-color: var(--dark-color);
    align-self: flex-end;
    border-radius: 1rem;
    .user-talk__time {
      color: var(--neutral-color);
      padding: 2rem 0 0 0;
      text-align: right;
    }
    /* décoration avant l'heure du message */
    /* .user-talk__time::before {
      content: "";
      width: 100%;
      height: 1px;
      color: var(--neutral-color);
    } */
  }

  .user-talk,
  .robot-talk {
    p {
      margin-block: 1rem;
    }
    a {
      font-weight: 700;
      color: var(--hilight-color);
    }
    ul {
      margin-inline-start: 2rem;
    }
  }

  .reply {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 92%;
    left: 50%;
    position: fixed;
    bottom: 2rem;
    padding: 1rem;
    background-color: var(--hilight-color);
    transform: translateX(-50%);
    border-radius: 1rem;
    min-height: 9rem;
    button {
      width: max-content;
      color: var(--dark-color);
      background-color: var(--neutral-color);
      padding: 0.3rem 1rem;
      border-radius: 1rem;
      align-self: flex-end;
    }
  }

  .hide {
    background-color: var(--main-color);
    min-height: 10rem;
  }

  button {
    background-color: var(--hilight-color);
    border-radius: 50%;
    border: none;
  }

  /* Large mobile */
  /* @media (min-width: 576px) {

  } */

  /* Tablettes */
  /* @media (min-width: 768px) {

  } */

  /* Desktop */
  /* @media (min-width: 992px) {

  } */

  /* Desktop HD */
  @media (min-width: 1200px) {
    /* Header */

    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      gap: 2rem;
    }
    header {
      top: 30%;
      left: 0;
      transform: translateY(-30%);
      width: 350px;
      height: 500px;
      padding: 1rem;
      background-color: var(--dark-color);
      border-radius: 0 2rem 2rem 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .head-desktop {
      display: block;
      position: absolute;
      top: -40px;
    }
    .head-mobile {
      display: none;
    }
    .head-user {
      margin: 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;

    }

 /* Main */

  main {
    width: 60%;
    margin: 2rem auto;
  }

  .user-talk {
    max-width: 80%;
  }


  .reply {
    width: 100%;
    left: 0;
    position: sticky;
    transform: translateX(0);
  }

  .hide {
    background-color: var(--main-color);
    min-height: 0rem;
  }




  }

  /* Desktop Wide */
  @media (min-width: 1400px) {
    /* ... */
  }
</style>
