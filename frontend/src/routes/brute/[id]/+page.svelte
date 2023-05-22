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
    let displayMessagePerSec = [];

    function combattre(event) {
        event.preventDefault();
        displayMessagePerSec = [];
        event.target.innerHTML = 'En cours...';
        
        let me = event.target.dataset.me;
        let adv = event.target.dataset.adv;
        
        axios.post('http://localhost:3000/combat', {
            id1: me,
            id2: adv
        }).then(res => {
            console.log(res.data);
            event.target.innerHTML = 'BASTON';
            messages = res.data.combat;

            let displayMessagePerSecInterval = setInterval(() => {
                if (messages.length > 0) {
                    displayMessagePerSec = [...displayMessagePerSec, messages.shift()]
                }else{
                    clearInterval(displayMessagePerSecInterval);
                }
            }, 1000);
        }).catch(err => {
            console.log(err);
            event.target.innerHTML = 'BASTON';
        });
    }
    
    
   
    onMount(() => {
        axios.get(`http://localhost:3000/brute/${data.id}`)
        .then(res => {
            brute = res.data;
        })
        .catch(err => {
            console.log(err);
        });
        
        axios.get(`http://localhost:3000/brute/${data.id}/adversaires`).then(res => {
            adversaires = res.data;
        }).catch(err => {
            console.log(err);
        });

    });
</script>


<h1>{brute.nom} - Lvl {brute.level} ({brute.currentxp}/{brute.maxxp})</h1>
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
    <li>{adversaire.nom} - Lvl {adversaire.level} <button data-adv={adversaire.id} data-me={brute.id} on:click={combattre}>BASTON</button></li>
    {/each}
</ul>

<div id="resultatCombat">
    {#each displayMessagePerSec as message}
        <div transition:fade>
            {message} <br> 
        </div>
    {/each}
</div>
