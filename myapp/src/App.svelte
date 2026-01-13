<script>
  // ========== IMPORTS ==========================================

  import Markdown from "svelte-exmarkdown";
  import MobileNav from "./lib/MobileNav.svelte";
  import DesktopNav from "./lib/DesktopNav.svelte";

  // let active = false;

  // ========== VARIABLES ========================================
  // Variable pour stocker la valeur de mon textarea
  let userTalk = $state();
  // Tableau qui stock tous les messages tapés dans la barre des questions
  let savedTalk = $state([]);
  // Variable pour stocker la réponse de l'IA
  let robotTalk = $state({});
  // Tableau qui stock tous les messages reçus de l'IA
  let savedRobotTalk = $state([]);

  let innerWidth = $state(0);

  // ========== TOKEN ============================================
  let userToken = $state("");
  // Fonction pour sauvegarder le token
  const saveToken = (event) => {
    event.preventDefault();
    // Stocke le token renseigné par l'utilisateur dans le localStorage
    localStorage.setItem("token", `${userToken}`);
    // Force le rafraichissement de la page pour revenir à la page sans modale
    setTimeout(() => {
      window.location.reload();
    });
  };
  // Récupérer le token dans le localStorage
  const myToken = localStorage.getItem("token");

  // ========== API ==============================================
  // Fonction appelée au submit du formulaire de question
  const initReply = async (event) => {
    // empêche le rafraichissement de la page
    event.preventDefault();

    // Envoi de la question à l'IA
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${myToken}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            content: `${userTalk}`,
            role: "user",
          },
        ],
      }),
    });
    // récupère la réponse
    const result = await response.json();
    console.log(result);

    // Stock la réponse de l'IA
    robotTalk = {
      role: result.choices[0].message.role,
      message: result.choices[0].message.content,
    };
    // Créer une nouvelle réponse de l'utilisateur et récupère sa valeur
    const userReply = {
      role: "user",
      message: userTalk,
    };

    // Ajoute les réponses au tableau
    savedTalk.push(userReply);
    savedTalk.push(robotTalk);

    // Vide le textarea une fois la fonction appellée
    userTalk = "";
  };

  // localStorage.clear()
</script>

<svelte:window bind:innerWidth />

<div class="container">
  {#if innerWidth < 1200}
    <MobileNav />
  {:else}
    <DesktopNav />
  {/if}
  {#if myToken !== null}
    <main>
      <div class="robot-talk">
        <h2>Bienvenue sur O'Chat !</h2>
        <p>
          Posez vos questions et l'IA Mistral pourra vous répondre directement
          ici !
        </p>
      </div>
      {#if savedTalk.length > 0}
        {#each savedTalk as talk}
          {#if talk.role === "user"}
            <div class="user-talk"><Markdown md={talk.message} /></div>
          {:else}
            <div class="robot-talk"><Markdown md={talk.message} /></div>
          {/if}
        {/each}
      {/if}
      <div class="hide"></div>
      <form class="reply" onsubmit={initReply}>
        <textarea
          aria-label="Question"
          name="question"
          id="question"
          placeholder="Posez votre question..."
          bind:value={userTalk}
        ></textarea>
        <button>Envoyer</button>
      </form>
    </main>
  {/if}
</div>
{#if !myToken}
  <div class="modal">
    <form onsubmit={saveToken}>
      <label for="token">Veuillez renseigner votre clé API Mistral</label>
      <input id="token" type="text" bind:value={userToken} />
      <button type="submit">Valider</button>
    </form>
  </div>
{/if}

<style>
  /* Modal */

  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--main-color);
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    button {
      width: max-content;
      color: var(--dark-color);
      background-color: var(--neutral-color);
      padding: 0.3rem 1rem;
      border-radius: 1rem;
      align-self: flex-end;
    }
    input {
      padding: 0.2rem;
      width: 100%;
      border: none;
      background-color: var(--dark-color);
      outline: none;
      color: var(--neutral-color);
      &::placeholder {
        color: var(--hilight-color);
      }
      &:focus {
        background-color: var(--hilight-color);
      }
    }
  }

  /* Main */

  main {
    height: 100vh;
    width: 88%;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    /* border: 2px solid yellow; */
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
    flex-direction: row;
    justify-content: flex-start;
    gap: 1rem;
    width: 92%;
    left: 50%;
    position: fixed;
    transform: translateX(-50%);
    bottom: 2rem;
    padding: 1rem;
    border-radius: 1rem;
    min-height: 9rem;
    padding: 1.5rem;
    color: #fff;
    background-color: #77ba9886;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: -1;
      border-radius: 1rem;
    }
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100px;
      top: 9rem;
      background-color: var(--main-color);
      z-index:-2;
      transform: scale(1.1);
    }
    textarea {
      width: 100%;
      height: auto;
      padding: 0.5rem;
      border: none;
      background-color: #00000000;
      color: var(--neutral-color);
      resize: none;
      outline: none;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #77ba99;
      }
      &::placeholder {
        color: var(--neutral-color);
      }
      &:focus {
        border-left: 1px solid var(--neutral-color);
      }
    }

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
    min-height: 12rem;
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

  /* Main */
  @media (min-width: 1200px) {
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      /* border: 4px solid green; */
    }
    main {
      width: 60%;
      margin: 0 auto;
      padding-block-start: 2rem;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .robot-talk {
      max-width: 90%;
      margin-inline-start: 1rem;
    }
    .user-talk {
      max-width: 80%;
      margin-inline-end: 1rem;
    }

    .reply {
      width: 100%;
      left: 0;
      position: sticky;
      transform: translateX(0);
    }

    .hide {
      background-color: var(--main-color);
      min-height: 2rem;
    }
  }
  /* Desktop Wide */
  @media (min-width: 1400px) {
    /* ... */
  }
</style>
