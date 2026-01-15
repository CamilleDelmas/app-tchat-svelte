<script>
  import { onMount } from "svelte";
  import { Plus } from "@lucide/svelte";
  import { MessageSquareText } from "@lucide/svelte";
  import { Trash2 } from "@lucide/svelte";

  // On importe l'état partagé
  import { currentIdState } from "./state.svelte";

  let userConversation = $state("");

  let savedConv = $state([]);

  // ========== POCKETBASE  =======================================

  // Fonction pour la création des données dans PocketBase
  const createRecordConv = async (data) => {
    const response = await fetch(
      "http://localhost:8090/api/collections/conversations/records",
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
  const getConv = async () => {
    const response = await fetch(
      "http://localhost:8090/api/collections/conversations/records"
    );
    const data = await response.json();
    savedConv = data.items;
  };

  // ========== FONCTION CONV  =======================================
  // Fonction de création des conversation
  const initConversation = async (event) => {
    event.preventDefault();

    userConversation = userConversation.trim();

    let newConversation = {
      title: userConversation
    }
    // Met à jour le tableau et afficher directment la réponse à l'utilisateur
        savedConv = [...savedConv, newConversation];
    
    createRecordConv(newConversation);
    userConversation = "";
  }
  $effect(() => {
    if (savedConv) {
      getConv()
    }
  })
    // Appelle le tableau des conversations depuis PocketBase à chaque réfraichissement de la page.
  onMount(async () => {
    await getConv();
  });

</script>
<!-- Partie nav -->
<nav class="menu">
  <div class="menu__add separate">
    <form onsubmit={initConversation}>
      <button type="submit"><Plus size={42} /></button>
      <input
        id="new-talk"
        type="text"
        placeholder="Nouvelle discussion"
        bind:value={userConversation}
        required
      />
    </form>
  </div>
  <div class="menu__add">
    <MessageSquareText size={38} strokeWidth={1.5} />
    <p>Discussions récentes</p>
  </div>
  <div class="menu__talk">
    {#each savedConv as conv}
      <div class="talk">
        <!-- Au click, on passe la valeur de l'id de la dscussion à l'état -->
        <button onclick={() => currentIdState.value = conv.id}>{conv.title}</button>
        <button>
          <Trash2 size={24} strokeWidth={1.5} />
        </button>
      </div>
    {/each}
  </div>
</nav>
<!-- Fin de partie nav -->
<style>
  .menu {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    .menu__add {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
      input {
        padding: 0.2rem;
        width: 80%;
        border: none;
        background-color: var(--dark-color);
        outline: none;
        color: var(--neutral-color);
        &::placeholder {
          color: var(--hilight-color);
        }
        &:focus {
          border-right: 1px solid var(--neutral-color);
        }
      }
    }

    .separate {
      position: relative;
      margin-block-end: 2rem;
    }
    .separate::after {
      position: absolute;
      bottom: -20px;
      content: "";
      height: 1px;
      width: 100%;
      background-color: var(--main-color);
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
        color: var(--neutral-color-color);
        text-align: left;
        background-color: var(--main-color);
        min-width: 10rem;
        padding: 0.3rem 1rem;
        border-radius: 1rem;
      }
    }
  }
  .menu__add button {
    background-color: var(--hilight-color);
    border-radius: 50%;
    border: none;
    &:hover {
      transform: scale(1.1);
    }
  }

  .talk button {
    color: var(--neutral-color);
    background: none;
    border: none;
  }
</style>
