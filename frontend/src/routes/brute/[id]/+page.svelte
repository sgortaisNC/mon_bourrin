<script>
    import axios from 'axios';
    import { onMount } from 'svelte';
    import { fade }  from 'svelte/transition';
    
    /** @type {import('./$types').PageData} */
    export let data;
    
    let brute = {
        id: 0,
        nom: '',
        level: 0,
        currentxp: 0,
        maxxp: 0,
        hp: 0,
        force: 0,
        endurance: 0,
        agilite: 0,
        nbmatch: 0
    }; 
    
    let adversaires = [
    {
        id: 0,  
        nom: '',
        level: 0,
    },
    {
        id: 0,  
        nom: '',
        level: 0,
    },
    {
        id: 0,  
        nom: '',
        level: 0,
    },
    ];
    
    /**
    * @type {String[]}
    */
    let messages = [];
    /**
    * @type {String[]}
    */
    let displayMessagePerSec = [];
    
    async function combattre(event) {
        event.preventDefault();
        brute.nbmatch += 1;
        displayMessagePerSec = [];
        event.target.innerHTML = 'En cours...';
        
        let me = event.target.dataset.me;
        let adv = event.target.dataset.adv;
        
        axios.post('http://172.16.5.71:3000/combat', {
            id1: me,
            id2: adv
        }).then(res => {
            console.log(res.data);
            event.target.innerHTML = 'BASTON';
            messages = res.data.combat;
            let displayMessagePerSecInterval = setInterval(() => {
                if (messages.length > 0) {
                    displayMessagePerSec = [...displayMessagePerSec,messages.shift()]
                }else{
                    currentBrute(me)
                    clearInterval(displayMessagePerSecInterval);
                }
                console.log(messages)
            }, 300);
        }).catch(err => {
            console.log(err);
            event.target.innerHTML = 'BASTON';
        });

    }
    
    function currentBrute(id){
        console.log(id)
        axios.get(`http://172.16.5.71:3000/brute/${id}`)
        .then(res => {
            brute = res.data;
        })
        .catch(err => {
            console.log(err);
        });
        
        axios.get(`http://172.16.5.71:3000/brute/${id}/adversaires`).then(res => {
            adversaires = res.data;
        }).catch(err => {
            console.log(err);
        });
    }
    
    onMount(() => {
        currentBrute(data.id)
    });
    
    
    let modalOpen = false 
    function openCloseModal(){
        modalOpen = !modalOpen;
        console.log(modalOpen)
    }
    
    
    const levelUp = (/** @type {string} */ str) => () => {
        
        let hp = brute.hp;
        let force = brute.force; 
        let endurance = brute.endurance;
        let agilite = brute.agilite; 
        switch (str) {
            case "HP":
            hp += 10;
            break;
            case "Force":
            force++
            break;
            case "Endurance":
            endurance++
            break;
            case "Agilité":
            agilite++
            break;
        }
        
        
        axios.post(`http://172.16.5.71:3000/brute/${data.id}/levelup`,{
            id: brute.id,
            lvl: brute.level + 1,
            maxxp: Math.round(brute.maxxp*1.1),
            hp: hp,
            force: force,
            endurance: endurance,
            agilite: agilite,
        }).then(res => {
            brute = res.data
        }).catch(err => {
            console.log(err);
        });

        modalOpen = !modalOpen;
        
    }
</script>

<div class="wrapper">
    <main>
        <a href="/">retour</a>
        
        <h1>{brute.nom} - Lvl {brute.level} ({brute.currentxp}/{brute.maxxp})</h1>
        {#if brute.currentxp >= brute.maxxp}
            <button on:click={openCloseModal}>
                Level up ! 
            </button>
        {/if}
        {#if modalOpen}            
        <div class="modal">
            <div class="inner">
                <button on:click={openCloseModal}>Fermer</button>
                <h2>Quoi qui augmente ?</h2>
                <button on:click={levelUp('HP')}>HP +10</button>
                <button on:click={levelUp('Force')}>Force +1</button>
                <button on:click={levelUp('Endurance')}>Endurance +1</button>
                <button on:click={levelUp('Agilité')}>Agilité +1</button>
            </div>
        </div>
        {/if}
        <ul>
            <li>HP : {brute.hp}</li>
            <li>Force : {brute.force}</li>
            <li>Endurance : {brute.endurance}</li>
            <li>Agilité : {brute.agilite}</li>
        </ul>
        
        <h2>Match restant : {3 - brute.nbmatch}</h2>
        <h4>Adversaire possible : </h4> 
        <ul>
            {#each adversaires as adversaire}
            <li>{adversaire.nom} - Lvl {adversaire.level} 
                {#if brute.nbmatch <= 2}
                <button data-adv={adversaire.id} data-me={brute.id} on:click={combattre}>BASTON</button>
                {/if}
            </li>
            {/each}
        </ul>
    </main>
    
    <aside id="resultatCombat">
        {#each displayMessagePerSec as message,id (id)}
        <div transition:fade>
            {message} <br> 
        </div>
        {/each}
    </aside>
</div>

<style>
    .wrapper{
        display: flex;
        gap: 1rem;
        padding: 1rem;
    }
    main{
        width: 75%;
    }
    .modal{
        position: fixed;
        inset: 0;
        z-index: 2;
        backdrop-filter: blur(10px);
        display: grid;
        place-items: center;
        
    }
    .modal .inner{
        background: #FFFFFF50;
        padding: 15px;
        color: white;
    }
</style>