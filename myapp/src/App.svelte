<script>
  //TODO: probleme lorsque l'utilisateur de créé pas de conversation, prévoir le cas avec un message à l'utilisateur, ou attribuer automatiquement les messages à une nouvelle conv.

  // ========== IMPORTS ==========================================
  import { onMount } from "svelte";

  import Markdown from "svelte-exmarkdown";
  import MobileNav from "./lib/MobileNav.svelte";
  import DesktopNav from "./lib/DesktopNav.svelte";

  // On importe l'état partagé
  import { currentIdState } from "./lib/state.svelte";

  // ========== VARIABLES ========================================

  // Variable pour stocker la valeur de mon textarea
  let userTalk = $state("");

  // Tableau qui stock tous les messages
  let savedTalk = $state([]);

  // Variable pour connaitre la largeur de la fenêtre
  let innerWidth = $state(0);


  // ========== TOKEN ============================================

  // Variable liée à la valeur de l'input
  let userToken = $state("");

  // Fonction pour sauvegarder le token
  const saveToken = (event) => {
    event.preventDefault();
    try {
      // Stocke le token renseigné par l'utilisateur dans le localStorage
      localStorage.setItem("token", `${userToken}`);
      myToken = userToken;
    } catch (error) {
      console.log("Erreur lors de la sauvegarde :", error);
      alert("Impossible de sauvegarder les données");
    }
  };

  // Récupérer le token dans le localStorage
  let myToken = $state(localStorage.getItem("token"));

  // ========== POCKETBASE  =======================================

  // Fonction pour la création des données dans PocketBase
  const createMessage = async (data) => {
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
  const getMessages = async (id_conversation) => {
    const response = await fetch(
      `http://localhost:8090/api/collections/messages/records?filter=(conversation='${id_conversation}')`
    );
    const data = await response.json();
    savedTalk = data.items;
  };

  // ========== API ==============================================

  // Fonction appelée au submit du formulaire de question
  const initReply = async (event) => {
    // empêche le rafraichissement de la page
    event.preventDefault();

    // Variable pour stocker la question de l'utilisateur
    let userReply = $state({
      role: "user",
      content: userTalk.trim(),
      created: new Date(),
      conversation: currentIdState.value,
    });

    if (userReply.content) {
      try {
        console.log($state.snapshot(savedTalk));
        // Spread Operator (l'opérateur de décomposition) pour mettre à jour le tableau et afficher directment la question à l'utilisateur (expliqué par l'IA).
        savedTalk = [...savedTalk, userReply];
        console.log($state.snapshot(savedTalk));
        // on formate les messages à envoyer à Mistral comme l'api les attend
        const formattedMessages = [];
        for (const message of savedTalk) {
          formattedMessages.push({
            role: message.role,
            content: message.content,
          });
        }
        console.log("création donnée question dans pocketbase");
        // Créer un enregistrement du message sur PocketBase avec le message de l'user
        createMessage(userReply);
        console.log("Avant appel API Mistral");
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
              messages: formattedMessages,
            }),
          }
        );
        console.log("Après appel API Mistral", response);
        // récupère la réponse
        const result = await response.json();
        // Stock la réponse de l'IA

        // Variable pour stocker la réponse de l'IA
        let robotReply = $state({
          role: result.choices[0].message.role,
          content: result.choices[0].message.content,
          conversation: currentIdState.value,
        });

        // Met à jour le tableau et afficher directment la réponse à l'utilisateur
        savedTalk = [...savedTalk, robotReply];

        // Créer un enregistrement du message sur PocketBase avec le message de l'IA
        console.log("création reponse robot dans pocketbase");
        await createMessage(robotReply);

        // Vide le textarea une fois la fonction appellée
        userTalk = "";
      } catch (error) {
        console.log("Message d'erreur", error);
        alert("Impossible de communiquer");
      }
    } else {
      alert("Veuillez rentrer un message");
    }
  };

  // A chaque changement de currentIdState.value, on appelle getMessages()
  $effect(() => {
    if (currentIdState.value) {
      getMessages(currentIdState.value)
    }
  })

  // localStorage.clear()

  // // Appelle le tableau des messages depuis PocketBase à chaque réfraichissement de la page.
  // onMount(async () => {
  //   await getMessages(currentIdState.value);
  // });

</script>

<svelte:window bind:innerWidth />

{#if myToken !== null}
  <div class="container">
    {#if innerWidth < 1100}
      <MobileNav />
    {:else}
      <DesktopNav />
    {/if}

    <main>
      <!-- Si le currentId n'est pas renseigné (pas de clique sur une conversation), on affiche un message invitant à créer une nouvelle discussion. On n'affiche pas le champ de question, cela évite qu'un utilisateur saisisse une question sans être dans une conv -->
      {#if currentIdState.value === ""}
        <div class="robot-talk">
          <h2>Bienvenue sur O'Chat !</h2>
          <p>
            Crééz une nouvelle discussion ou choisissez en une existante pour commencer à discuter avec l'IA
            Mistral !
          </p>
        </div>
        <!-- Si une conversation est bien sélectionnée, on affiche -->
      {:else}
        {#if savedTalk.length !== 0}
          {#each savedTalk as talk}
            {#if talk.role === "user"}
              <div class="user-talk">
                <Markdown md={talk.content} />
                <div class="user-talk__time">
                  {new Date(talk.created).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            {:else}
              <div class="robot-talk"><Markdown md={talk.content} /></div>
            {/if}
          {/each}
        {:else}
          <div class="robot-talk">
            <h2>C'est le début d'une nouvelle discussion !</h2>
          </div>
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
      {/if}
    </main>
  </div>
{/if}
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
  }

  .robot-talk {
    margin-block-end: 1rem;
  }
  .user-talk {
    display: flex;
    flex-direction: column;
    min-width: 20%;
    max-width: 86%;
    padding: 1rem 1rem 0 1rem;
    margin-block-end: 1rem;
    background-color: var(--dark-color);
    align-self: flex-end;
    border-radius: 1rem;
  }

  .user-talk__time {
    position: relative;
    font-size: 0.8rem;
    color: var(--neutral-color);
    background-color: var(--main-color);
    margin-block-start: 0.5rem;
    padding: 0.3rem 0 0.2rem 0.5rem;
    align-self: flex-end;
    border-radius: 1rem 0 0 0;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: var(--main-color);
    }
  }

  .user-talk,
  .robot-talk {
    :global(p) {
      margin-block-end: 0.5rem;
    }
    :global(a) {
      font-weight: 700;
      color: var(--hilight-color);
    }
    :global(ul),
    :global(ol) {
      margin-block-end: 0.5rem;
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
    background-color: rgba(119, 186, 152, 0.6);
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      backdrop-filter: blur(7px);
      -webkit-backdrop-filter: blur(7px);
      z-index: -1;
      border-radius: 1rem;
    }
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 2rem;
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
      position: relative;
      width: max-content;
      color: var(--dark-color);
      background-color: var(--neutral-color);
      padding: 0.3rem 1rem;
      border-radius: 1rem;
      align-self: flex-end;
      &:active {
        top: 2px;
      }
      &::after {
        content: "";
        font-size: 1rem;
        position: absolute;
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-left: 20px solid var(--neutral-color);
        border-bottom: 15px solid transparent;
        top: 50%;
        transform: translateY(-50%);
        right: 0px;
        transition: 300ms;
        z-index: -1;
      }
      &:hover::after {
        right: -7px;
      }
    }
  }

  .hide {
    background-color: var(--main-color);
    min-height: 12rem;
  }

  /* Main */
  @media (min-width: 1100px) {
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
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

</style>
