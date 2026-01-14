<script>
  import { Plus } from "@lucide/svelte";
  import { MessageSquareText } from "@lucide/svelte";
  import { Trash2 } from "@lucide/svelte";
</script>


  <nav class="menu">
    <div class="menu__add separate">
      <button type="submit"><Plus size={42} /></button>
      <input id="new-talk" type="text" placeholder="Nouvelle discussion" />
    </div>
    <div class="menu__add">
      <MessageSquareText size={38} strokeWidth={1.5} />
      <p>Discussions récentes</p>
    </div>
    <div class="menu__talk">
      <div class="talk">
        <p>Javascript</p>
        <button>
          <Trash2 size={24} strokeWidth={1.5} />
        </button>
      </div>
      <div class="talk">
        <p>Javascript</p>
        <button>
          <Trash2 size={24} strokeWidth={1.5} />
        </button>
      </div>
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
