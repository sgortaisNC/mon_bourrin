const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();



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
    
    this.reset = async function(brute){
        await prisma.brute.update({
            data: {
                currentxp : 0,
                maxxp : 10,
                level : 1,
                hp : 10,
                force : 1,
                endurance : 1,
                agilite : 1,
                nbmatch : 0,
            },
            where: {
                id: brute.id
            }
        });
    }


    this.checkGlitch = async function(table){
        table.forEach(brute => {
            if (brute.nbmatch < 0 || brute.nbmatch > 3){
                this.reset(brute);
                return ['Glitcheur !']
            }
            let stats = ((brute.hp / 10) + brute.agilite + brute.hp + brute.endurance - 3);
            if (stats !== brute.level){
                this.reset(brute);
                return ['Glitcheur !']
            }
        });
    }
    
    this.combat = async function(brute1, brute2) {
        this.checkGlitch([brute1,brute2]);
        str = [];
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
            bruteAdverse.currentxp += 3;
            bruteEnCours.currentxp += 1;
        } else {
            str = [...str, `${bruteAdverse.nom} a été vaincu.`];
            bruteEnCours.currentxp += 3;
            bruteAdverse.currentxp += 1;
        }
        
        await prisma.brute.update({
            data: {
                currentxp: bruteAdverse.currentxp,
            },
            where: {
                id: bruteAdverse.id
            }
        });
        
        await prisma.brute.update({
            data: {
                currentxp: bruteEnCours.currentxp,
            },
            where: {
                id: bruteEnCours.id
            }
        });
        
        await prisma.brute.update({
            data: {
                nbmatch: brute1.nbmatch + 1,
            },
            where: {
                id: brute1.id
            }
        });
        
        return str;
    };
    
    
}
