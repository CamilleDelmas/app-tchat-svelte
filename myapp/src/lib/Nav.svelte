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
    try {
      const response = await fetch(
        "http://localhost:8090/api/collections/conversations/records"
      );
      if (response.ok) {
        const data = await response.json();
        savedConv = data.items;
      } else {
        console.error("Erreur de communication avec PocketBase");
      }
    } catch (error) {
      console.error("getConv error :", error);
    }
  };

  // Fonction pour supprimer une conversations dans PocketBase
  const deleteConv = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8090/api/collections/conversations/records/${id}`, {method: "DELETE",
          headers: {'Content-Type': 'application/json'}
        }
      );
      if (response.ok) {
        console.log("suppression réussie")
      } else {
        console.error("Erreur de communication avec PocketBase");
      }
    } catch (error) {
      console.error("deleteConv error :", error);
    }
  };

  // ========== FONCTION CONV  =======================================
  // Fonction de création des conversation

  // La fonction transmet l'id à la fonction de supression dans PocketBase, puis créé un nouveau tableau sans la conversation liée à  l'id.
const deleteC = async(id) => {
  await deleteConv(id);
  savedConv = savedConv.filter(conv => conv.id !== id);
}

  const initConversation = async (event) => {
    event.preventDefault();

    userConversation = userConversation.trim();
    if (userConversation) {
      try {
        let newConversation = {
          title: userConversation,
        };

        await createRecordConv(newConversation);
        await getConv();
        userConversation = "";
      } catch (error) {
        console.error("initConversation error :", error);
      }
    } else {
      alert("Veuillez rentrer un titre de discussion");
    }
  };

  // Appelle le tableau des conversations depuis PocketBase à chaque réfraichissement de la page.
  onMount(async () => {
    await getConv();
  });
</script>

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
        <button class="conv" onclick={() => (currentIdState.value = conv.id)}
          >{conv.title}</button
        >
        <!-- Lorsque l'on clique sur la poubelle, on appelle la fonction avec en  argument l'id de la conv liée au bouton -->
        <button onclick={() => deleteC(conv.id)}>
          <Trash2 size={24} strokeWidth={1.5} />
        </button>
      </div>
    {/each}
  </div>
</nav>

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
      form {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        border-radius: 2rem;
      }
      form:has(input:focus) {
        background-color: var(--hilight-color);
      }
      input {
        padding: 0.2rem;
        width: 80%;
        border: none;
        background-color: var(--dark-color);
        outline: none;
        border-radius: inherit;
        color: var(--dark-color);
        &::placeholder {
          color: var(--hilight-color);
        }
        &:focus {
          background-color: var(--hilight-color);
        }
        &:focus::placeholder {
          color: var(--dark-color);
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
      .conv {
        position: relative;
        color: var(--neutral-color-color);
        text-align: left;
        background-color: var(--main-color);
        width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0.3rem 1rem;
        border-radius: 1rem;
        &:active {
          top: 2px;
        }
        &:hover {
          background-color: var(--hilight-color);
          color: var(--dark-color);
        }
        &:focus {
          background-color: var(--hilight-color);
          color: var(--dark-color);
        }
      }
    }
  }
  .menu__add button {
    background-color: var(--hilight-color);
    border-radius: 50%;
    border: none;
    box-shadow: 2px 2px 10px var(--dark-color);
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
