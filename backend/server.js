const express = require('express');
const {PrismaClient} = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
    console.log('Serveur Express démarré sur le port 3000');
});





