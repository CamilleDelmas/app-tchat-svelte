<script>
  // ========== IMPORTS ==========================================
  import { onMount } from "svelte";

  import Markdown from "svelte-exmarkdown";
  import MobileNav from "./lib/MobileNav.svelte";
  import DesktopNav from "./lib/DesktopNav.svelte";

  // ========== VARIABLES ========================================

  // Variable pour stocker la valeur de mon textarea
  let userTalk = $state();

  // Variable pour stocker la question de l'utilisateur
  let userReply = $state({
    content: "",
    role: "",
    created: null
  });

  // Variable pour stocker la réponse de l'IA
  let robotReply = $state({});

  // Tableau qui stock tous les messages
  let savedTalk = $state([]);

  // Variablepour connaitre la largeur de la fenêtre
  let innerWidth = $state(0);

  // ========== TOKEN ============================================

  // Variable liée à la valeur de l'input
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

  // ========== POCKETBASE  =======================================
  
  // Fonction pour la création des données dans PocketBase
    const createRecord = async (data) => {
    const response = await fetch(
      "http://localhost:8090/api/collections/messages/records",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  };

  // Fonction pour récupérer les informations de la base de donnée et les stocker dans le tableau des conversations
  const getMessages = async () => {
    const response = await fetch(
      "http://localhost:8090/api/collections/messages/records"
    );
    const data = await response.json();
    savedTalk = data.items;
  };

  // ========== API ==============================================
  // TODO: ajouter l'heure dans le message

  // Fonction appelée au submit du formulaire de question
  const initReply = async (event) => {
    // empêche le rafraichissement de la page
    event.preventDefault();
    // Créer une nouvelle réponse de l'utilisateur et récupère sa valeur
    userReply = {
      role: "user",
      content: userTalk.trim(),
      created: new Date()
    };

    if (userReply.content) {
      // Ajoute la question au tableau pour qu'elle s'affiche directement dans le bloc de chat sans attendre la réponse du l'IA
      savedTalk.push(userReply);

      // Créer un enregistrement du message sur PocketBase avec le message de l'user
      createRecord(userReply);

      // Vide le textarea une fois la fonction appellée
      userTalk = "";
      // Envoi de la question à l'IA
      const response = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${myToken}`,
          },
          body: JSON.stringify({
            model: "mistral-small-latest",
            messages: [
              {
                content: `${userReply.content}`,
                role: `${userReply.role}`,
              },
            ],
          }),
        }
      );
      // récupère la réponse
      const result = await response.json();

      // Stock la réponse de l'IA
      robotReply = {
        role: result.choices[0].message.role,
        content: result.choices[0].message.content,
      };

      // Ajoute la réponse au tableau
      // savedTalk.push(robotReply);
      createRecord(robotReply);
      getMessages();
    } else {
      alert("Veuillez rentrer un message");
    }
  };


  // localStorage.clear()

  onMount(async () => {
    await getMessages();
  });
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
      {#if savedTalk.length !== 0}
        {#each savedTalk as talk}
          {#if talk.role === "user"}
            <div class="user-talk"><Markdown md={talk.content} /></div>
            <div class="user-talk__time">{new Date(userReply.created).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            })}</div>
          {:else}
            <div class="robot-talk"><Markdown md={talk.content} /></div>
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
          required
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
      <input id="token" type="text" bind:value={userToken} required />
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
    padding: 1rem;
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
      top: 9.3rem;
      background-color: var(--main-color);
      z-index: -2;
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
