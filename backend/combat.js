module.exports = function() {

    this.str = [];

    this.calculerDegats = function (brute,crit) {
        let degats = brute.force;
        if (brute.arme) {
            degats += brute.arme.modificateurDegats;
        }        
        return crit ? degats * 2 : degats;
    }

    this.attaquer = function(bruteAttaquante, bruteCible) {
        const esquive = Math.random() < ((bruteCible.agilite / 100) + 0.1);
        if (esquive) {
            str = [...str, bruteCible.nom + " esquive ! "];
        }else{
            const crit = Math.random() < ((bruteAttaquante.agilite / 100) + 0.05);
            const degats = calculerDegats(bruteAttaquante,crit);
            let critMsg = crit ? ' (coup critique)' : '';
            bruteCible.hp -= degats;
            str = [...str, bruteCible.nom + " perd " + degats + "hp"+ critMsg+". Il lui reste " + bruteCible.hp + " hp"];
        }
    }
      
    this.determinerTour = function(brute1, brute2) {
        if (brute1.agilite === brute2.agilite) {
            return Math.random() < 0.5 ? brute1 : brute2;
        }
        if (brute1.agilite > brute2.agilite) {
            return brute1;
        } else {
            return brute2;
        }
    }
    
    this.combat = async function(brute1, brute2) { 
        const bruteEnCours = this.determinerTour(brute1, brute2);
        const bruteAdverse = bruteEnCours === brute1 ? brute2 : brute1;
        while (bruteEnCours.hp > 0 && bruteAdverse.hp > 0) {
            str = [...str, "C'est au tour de " + bruteEnCours.nom + " d'attaquer."];
            await attaquer(bruteEnCours, bruteAdverse);
            if (bruteAdverse.hp > 0) {
                str = [...str, "C'est au tour de " + bruteAdverse.nom + " d'attaquer."];
                await attaquer(bruteAdverse, bruteEnCours);
            }
        }
        
        if (bruteEnCours.hp <= 0) {
            str = [...str, `${bruteEnCours.nom} a été vaincu.`];
        } else {
            str = [...str, `${bruteAdverse.nom} a été vaincu.`];
        }
        
        return str;
    };
}
