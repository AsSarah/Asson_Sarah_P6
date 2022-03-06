// JavaScript source code
const express = require('express');                           //framework requis / equivalent include

const app = express();                                        // mise en place d'express

const mongoose = require('mongoose');
const path = require('path');                                 // nous donne accés a notre systéme fichier image

const morgan = require('morgan');                             //Morgan est un middleware de niveau requête HTTP.
                                                              //s’avère très utile lors du débogage et également si vous souhaitez créer des fichiers journaux.


const sauceRoutes = require('./routes/sauce');
const userRoutes= require('./routes/user');

    ////////////connexion MongoDB ////////
mongoose.connect('mongodb+srv://sarah:passeword@cluster0.4q9d9.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use(express.json());                                      // intercepte toutes les requetes qui contiennent du JSON//
                                                              //requete et reponse en parametre
                                                              /// midleware///
//On ajoute des headers pour les requêtes appliquer à toutes les routes// 
// * représente tout le monde  (API) 
//on appel next pour passer l'exécution au middleware d'aprés
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(morgan('combined'));

app.use('/images', express.static(path.join(__dirname, 'images')));//qui va répondre aux requêtes envoyées à /images
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth',userRoutes);


// midleware ///
module.exports = app;