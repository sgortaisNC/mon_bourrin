<!-- AjouterBrute.svelte -->
<script>
    import axios from 'axios';
  
    let nom = '';
    let hp = 0;
    let force = 0;
    let endurance = 0;
    let agilite = 0;
  
    async function ajouterBrute() {
      try {
        const response = await axios.post('http://172.16.5.71:3000/brute', {
          nom,
          hp,
          force,
          endurance,
          agilite
        });
  
        if (response.status === 201) {
          alert('Brute ajoutée avec succès !');
          // Réinitialiser les champs du formulaire
          nom = '';
          hp = 0;
          force = 0;
          endurance = 0;
          agilite = 0;
        }
      } catch (error) {
        alert('Erreur lors de l\'ajout de la brute : ' + error.response.data.error);
      }
    }
  </script>
  
  <h1>Ajouter une brute</h1>
  
  <form on:submit|preventDefault="{ajouterBrute}">
    <div>
      <label>Nom:</label>
      <input type="text" bind:value="{nom}" />
    </div>
    <button type="submit">Ajouter</button>
  </form>
  