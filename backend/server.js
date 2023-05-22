require('./combat')();

const express = require('express');
const {PrismaClient} = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/brutes', async(req,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    const brutes = await prisma.brute.findMany();
    res.status(201).json(brutes); 
});

app.get('/brute/:bruteId', async(req,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    const brute = await prisma.brute.findUnique({where: {id: parseInt(req.params.bruteId)}});
    res.status(201).json(brute); 
});

app.get('/brute/:bruteId/adversaires', async(req,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    const adversaires = await prisma.brute.findMany({where: { NOT: {id: parseInt(req.params.bruteId)}}});
    res.status(201).json(adversaires);
});

app.post('/brute', async (req,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    try{
        const { nom } = req.body;
        
        // Création d'une nouvelle brute en utilisant Prisma
        const brute = await prisma.brute.create({
            data: {
                nom
            },
        });
        res.status(201).json(brute);
        
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la brute :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la brute' });
    }
    
});

app.post('/combat', async (req,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    try{
        const { id1, id2 } = req.body;

        let brute1 = await prisma.brute.findUnique({where: {id: parseInt(id1)}});
        let brute2 = await prisma.brute.findUnique({where: {id: parseInt(id2)}});
        let resultat = await combat(brute1, brute2);

        res.status(201).json({combat: resultat });
        
    } catch (error) {
        console.error('Erreur lors de l\'ajout du combat :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du combat' });
    }
    

});

app.listen(3000, () => {
    console.log('Serveur Express démarré sur le port 3000');
});





