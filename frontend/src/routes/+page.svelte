<script>
    import {onMount} from "svelte";
    import axios from 'axios';
	import { goto } from "$app/navigation";
    /**
	 * @type {any[]}
	 */
    let brutes = []
    
    const getBrutes = () => {
        axios.get('http://localhost:3000/brutes')
            .then((response) => {
                console.log(response)
                brutes = response.data;
            });
    }

    /**
	 * @param {{ target: { value: any; }; }} event
	 */
    function handleBruteSelection(event){
        goto(`/brute/${event.target.value}`);
    }
    onMount(getBrutes);
</script>

<div class="selecteur">
    <select on:change={handleBruteSelection} name="" id="select">
        <option value="">PTDR T KI ?</option>
        {#each brutes as brute}
            <option value={brute.id}>{brute.nom}</option>
        {/each}
    </select>
</div>

<style>
    .selecteur{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
    
    select{
        width: 300px;
        height: 75px;
        font-size: 48px;
    }
</style>