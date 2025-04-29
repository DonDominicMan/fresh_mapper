<script>
	import { goto } from "$app/navigation";
	import { feature } from "$lib/stores/MapStore.js";

    let isOpen = $state(true);

    const toggleSidebar = () => isOpen = !isOpen;

    const handleZoomOut = () => {
      feature.set(undefined);
      goto('/')
    }
</script>
  
<div class="sidebar-container">
  <aside class:open={isOpen}>
    <button class="toggle-btn" onclick={toggleSidebar}>
      {!isOpen ? '◄' : '►'}
    </button>
    
    <div class="sidebar-content">
      <header class="flex-header">
        <h1>{$feature?.properties?.name || "United States"}</h1>
        <button onclick={handleZoomOut}>Zoom Out</button>
      </header>

    </div>
  </aside>
</div>

<style>
  .flex-header {
    display: flex;
    justify-content: space-between;
  }

  .sidebar-container {
    position: relative;
  }

  aside {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 35vw;
    background: rgba(40, 40, 60, 0.85);
    backdrop-filter: blur(8px);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease-out;
    /* z-index: 1000; */
    display: flex;
  }

  aside.open {
    transform: translateX(0%);
  }

  .sidebar-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    color: white;
  }

  .toggle-btn {
    position: absolute;
    right: 35vw;
    top: 1rem;
    width: 2rem;
    height: 3rem;
    background: rgba(40, 40, 60, 0.85);
    border: none;
    border-radius: 4px 0 0 4px;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .toggle-btn:hover {
    background: rgba(60, 60, 80, 0.9);
  }

</style>